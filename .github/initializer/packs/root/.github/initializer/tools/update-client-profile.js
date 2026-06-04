#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const workspaceRoot = process.cwd();
const CONFIG_PATHS = {
  clientProfiles: [
    path.join(workspaceRoot, 'config/client-profiles.json'),
    path.join(workspaceRoot, '.github/initializer/packs/root/config/client-profiles.json'),
  ],
  standardsResolutionPolicy: [
    path.join(workspaceRoot, 'config/standards-resolution-policy.json'),
    path.join(workspaceRoot, '.github/initializer/packs/root/config/standards-resolution-policy.json'),
  ],
  standardsCatalog: [
    path.join(workspaceRoot, 'config/standards-catalog.json'),
    path.join(workspaceRoot, '.github/initializer/packs/root/config/standards-catalog.json'),
  ],
};

function printUsage() {
  console.log(`Usage: node .github/initializer/tools/update-client-profile.js --input <path> [options]

Options:
  --input <path>         Path to questionnaire delta file (markdown or json)
  --client-id <id>       Target existing client id; defaults from input or config defaultClientId
  --dry-run              Show planned changes without writing files
  --sync-manifest        Run sync-seed-manifest.js after applying changes
  --help                 Show this help
`);
}

function parseArgs(argv) {
  const parsed = {
    inputPath: null,
    clientId: null,
    dryRun: false,
    syncManifest: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') {
      printUsage();
      process.exit(0);
    }
    if (arg === '--dry-run') {
      parsed.dryRun = true;
      continue;
    }
    if (arg === '--sync-manifest') {
      parsed.syncManifest = true;
      continue;
    }
    if (arg === '--input') {
      parsed.inputPath = argv[i + 1];
      i += 1;
      continue;
    }
    if (arg === '--client-id') {
      parsed.clientId = argv[i + 1];
      i += 1;
      continue;
    }
    throw new Error(`Unknown argument: ${arg}`);
  }

  if (!parsed.inputPath) {
    throw new Error('Missing required argument: --input <path>');
  }

  return parsed;
}

function normalizePath(value) {
  return value.replace(/\\/g, '/');
}

function readText(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function writeText(filePath, content, dryRun) {
  if (dryRun) {
    return;
  }
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
}

function readJson(filePath) {
  return JSON.parse(readText(filePath));
}

function writeJson(filePath, data, dryRun) {
  writeText(filePath, `${JSON.stringify(data, null, 2)}\n`, dryRun);
}

function slugifyClientId(input) {
  return String(input || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

function splitList(value) {
  if (!value) {
    return [];
  }
  return String(value)
    .replace(/\r\n?/g, '\n')
    .split(/[\n,;]+/)
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => item.replace(/^[-*]\s*/, '').trim())
    .filter(Boolean);
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function parseQuestionnaireMarkdown(content) {
  const lines = content.replace(/\r\n?/g, '\n').split('\n');
  const answers = {};
  let currentQ = null;
  let buffer = [];

  function flush() {
    if (!currentQ) {
      return;
    }
    const cleaned = buffer
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .filter((line) => !/^Example:/i.test(line))
      .map((line) => line.replace(/^Answer:\s*/i, '').trim())
      .filter((line) => line.length > 0);

    if (cleaned.length > 0) {
      answers[currentQ] = cleaned.join('\n');
    }
    buffer = [];
  }

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    const qMatch = line.match(/^\*\*(\d+)\./);
    if (qMatch) {
      flush();
      currentQ = Number.parseInt(qMatch[1], 10);
      continue;
    }
    if (currentQ !== null) {
      if (/^##\s+/.test(line)) {
        flush();
        currentQ = null;
        continue;
      }
      buffer.push(line);
    }
  }

  flush();
  return answers;
}

function parseQuestionnaireJson(content) {
  const obj = JSON.parse(content);
  const answers = {};

  if (Array.isArray(obj.answers)) {
    for (const item of obj.answers) {
      if (!item) {
        continue;
      }
      const q = Number.parseInt(item.question || item.q || item.id, 10);
      const answer = item.answer || item.value || '';
      if (Number.isInteger(q) && String(answer).trim()) {
        answers[q] = String(answer).trim();
      }
    }
  }

  for (const [key, value] of Object.entries(obj)) {
    const q = Number.parseInt(String(key).replace(/[^0-9]/g, ''), 10);
    if (Number.isInteger(q) && !answers[q] && typeof value !== 'object' && String(value).trim()) {
      answers[q] = String(value).trim();
    }
  }

  return answers;
}

function parseQuestionnaireFile(inputPath) {
  const content = readText(inputPath);
  const trimmed = content.trim();
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    try {
      return parseQuestionnaireJson(content);
    } catch {
      return parseQuestionnaireMarkdown(content);
    }
  }
  return parseQuestionnaireMarkdown(content);
}

function mapLanguages(input) {
  const t = String(input || '').toLowerCase();
  const set = new Set();
  if (/(c#|\bcsharp\b|\.net|dotnet)/.test(t)) set.add('csharp');
  if (/\bjava\b/.test(t)) set.add('java');
  if (/(typescript|\bts\b)/.test(t)) set.add('typescript');
  if (/\bsql\b/.test(t)) set.add('sql');
  return [...set];
}

function mapFrameworks(input) {
  const t = String(input || '').toLowerCase();
  const set = new Set();
  if (/react/.test(t)) set.add('react');
  if (/(asp\.net\s*core|aspnet\s*core|\.net\s*core)/.test(t)) set.add('aspnet-core');
  if (/spring\s*boot|springboot/.test(t)) set.add('spring-boot');
  return [...set];
}

function mapTesting(input) {
  const t = String(input || '').toLowerCase();
  const set = new Set();
  if (/xunit|x-unit/.test(t)) set.add('xunit');
  if (/junit/.test(t)) set.add('junit');
  if (/vitest/.test(t)) set.add('vitest');
  if (/playwright/.test(t)) set.add('playwright');
  if (/testng|selenium/.test(t)) set.add('testng');
  return [...set];
}

function mapPlatform(input) {
  const t = String(input || '').toLowerCase();
  const set = new Set();
  if (/azure/.test(t)) set.add('azure');
  if (/\baws\b|amazon/.test(t)) set.add('aws');
  if (/\bgcp\b|google\s*cloud/.test(t)) set.add('gcp');
  if (/on[-\s]?prem|datacenter|data\s*center/.test(t)) set.add('onprem');
  return [...set];
}

function mapData(input) {
  const t = String(input || '').toLowerCase();
  const set = new Set();
  if (/sql\s*server|postgres|mysql|oracle|relational|database|db/.test(t)) set.add('relational-schema');
  if (/stored\s*procedure|sproc|proc/.test(t)) set.add('stored-procedures');
  if (/api|payload|dto|contract|json/.test(t)) set.add('data-contracts');
  return [...set];
}

function mapIntendedUse(input) {
  const t = String(input || '').toLowerCase();
  const set = new Set();
  if (/feature|implementation|build|code/.test(t)) set.add('feature-implementation');
  if (/analysis|reverse|gap|assessment/.test(t)) set.add('analysis');
  if (/audit|review/.test(t)) set.add('audit');
  if (/test|qa/.test(t)) set.add('testing');
  if (/document|doc|story|report|diagram|bpmn/.test(t)) set.add('documentation');
  if (/all of the above|all/.test(t)) {
    return ['feature-implementation', 'analysis', 'audit', 'testing', 'documentation'];
  }
  return [...set];
}

function diffValue(before, after) {
  return JSON.stringify(before) !== JSON.stringify(after);
}

function mergeArray(existing, incoming) {
  if (!incoming || incoming.length === 0) {
    return existing || [];
  }
  return unique([...(existing || []), ...incoming]);
}

function mergeLines(existing, incoming) {
  if (!incoming || incoming.length === 0) {
    return existing || [];
  }
  return unique([...(existing || []), ...incoming]);
}

function buildUpdatedClientState(existingClient, answers, targetClientId) {
  const inputDisplayName = (answers[1] || '').trim();
  const inputClientId = slugifyClientId(inputDisplayName);
  const shouldUpdateIdentity = Boolean(inputDisplayName) && inputClientId === targetClientId;
  const displayName = shouldUpdateIdentity
    ? inputDisplayName
    : (existingClient.displayName || inputDisplayName || targetClientId);
  const projectName = (answers[2] || '').trim();
  const preferredTerms = splitList(answers[13]);
  const restrictedTerms = splitList(answers[14]);
  const teamRules = splitList(answers[15]);
  const securityRules = splitList(answers[16]);
  const approvals = splitList(answers[17]);
  const avoidActions = splitList(answers[18]);
  const outputTypes = splitList(answers[9]);
  const outputFormat = (answers[10] || '').trim();
  const outputDetail = (answers[12] || '').trim();

  const enabledCapabilities = {
    language: mergeArray(existingClient.enabledCapabilities?.language || [], mapLanguages(answers[4])),
    framework: mergeArray(existingClient.enabledCapabilities?.framework || [], mapFrameworks(answers[5])),
    testing: mergeArray(existingClient.enabledCapabilities?.testing || [], mapTesting(answers[6])),
    data: mergeArray(existingClient.enabledCapabilities?.data || [], mapData(answers[7])),
    platform: mergeArray(existingClient.enabledCapabilities?.platform || [], mapPlatform(answers[8])),
    architecture: existingClient.enabledCapabilities?.architecture || ['api', 'workers', 'modular-boundaries'],
  };

  if (String(answers[9] || '').toLowerCase().includes('workflow')) {
    enabledCapabilities.architecture = unique([...(enabledCapabilities.architecture || []), 'events']);
  }

  const intendedUse = mergeArray(existingClient.intendedUse || [], mapIntendedUse(answers[3]));
  const stackSignals = unique([
    ...(existingClient.stackSignals || []),
    ...enabledCapabilities.language,
    ...enabledCapabilities.framework,
    ...enabledCapabilities.testing,
    ...enabledCapabilities.platform,
  ]);

  const baselineExpectations = mergeLines(existingClient.baselineExpectations || [], unique([
    outputFormat ? `Prefer output format: ${outputFormat}.` : '',
    outputDetail ? `Output detail preference: ${outputDetail}.` : '',
    outputTypes.length > 0 ? `Target output types: ${outputTypes.join(', ')}.` : '',
    preferredTerms.length > 0 ? `Preferred terminology: ${preferredTerms.join(', ')}.` : '',
    restrictedTerms.length > 0 ? `Avoid terminology: ${restrictedTerms.join(', ')}.` : '',
  ]));

  const requiredGuardrails = mergeLines(existingClient.requiredGuardrails || [], unique([
    'Do not weaken common security or quality rules.',
    ...securityRules,
    ...avoidActions,
    approvals.length > 0 ? `Approval gate: ${approvals.join(', ')}` : '',
  ]));

  return {
    clientId: targetClientId,
    displayName,
    description: shouldUpdateIdentity
      ? `Single-client distribution profile for ${displayName}.`
      : (existingClient.description || `Single-client distribution profile for ${displayName}.`),
    projectName,
    intendedUse: intendedUse.length > 0 ? intendedUse : existingClient.intendedUse || [],
    stackSignals,
    enabledCapabilities,
    overlayPath: existingClient.overlayPath || `docs/standards/clients/${targetClientId}/overlays`,
    baselineExpectations,
    requiredGuardrails,
    preferredTerms,
    restrictedTerms,
    outputFormat,
    outputDetail,
    outputTypes,
    securityRules,
    approvals,
    avoidActions,
    rules: mergeLines([], unique([
      ...teamRules,
      ...securityRules,
      ...avoidActions.map((item) => `Avoid: ${item}`),
      approvals.length > 0 ? `Require approvals: ${approvals.join(', ')}` : '',
    ])),
  };
}

function ensureClientExists(clientProfiles, clientId) {
  const client = clientProfiles.clients?.[clientId];
  if (!client) {
    throw new Error(`Client profile not found for update: ${clientId}`);
  }
  return client;
}

function buildDiff(existingClient, updatedClient) {
  const changes = [];
  const fields = [
    'displayName',
    'description',
    'intendedUse',
    'stackSignals',
    'enabledCapabilities',
    'overlayPath',
    'baselineExpectations',
    'requiredGuardrails',
  ];

  for (const field of fields) {
    if (diffValue(existingClient[field], updatedClient[field])) {
      changes.push({ field, before: existingClient[field], after: updatedClient[field] });
    }
  }

  return changes;
}

function applyClientProfileUpdate(targetClientId, updatedClient, dryRun) {
  for (const filePath of CONFIG_PATHS.clientProfiles) {
    const json = readJson(filePath);
    json.clients[targetClientId] = {
      ...json.clients[targetClientId],
      displayName: updatedClient.displayName,
      description: updatedClient.description,
      intendedUse: updatedClient.intendedUse,
      stackSignals: updatedClient.stackSignals,
      enabledCapabilities: updatedClient.enabledCapabilities,
      overlayPath: updatedClient.overlayPath,
      baselineExpectations: updatedClient.baselineExpectations,
      requiredGuardrails: updatedClient.requiredGuardrails,
    };
    writeJson(filePath, json, dryRun);
  }
}

function applyStandardsCatalogUpdate(targetClientId, updatedClient, dryRun) {
  for (const filePath of CONFIG_PATHS.standardsCatalog) {
    const json = readJson(filePath);
    if (!json.layers) {
      json.layers = {};
    }
    if (!json.layers.clients) {
      json.layers.clients = { description: 'Client overlays that narrow or extend the universal baseline.', entries: [] };
    }

    const existingEntries = Array.isArray(json.layers.clients.entries) ? json.layers.clients.entries : [];
    const nextEntries = existingEntries.filter((entry) => entry.id !== targetClientId);
    nextEntries.push({
      id: targetClientId,
      profile: `config/client-profiles.json#clients.${targetClientId}`,
      overlayRoot: updatedClient.overlayPath,
      description: `Single-client overlay profile for ${updatedClient.displayName}`,
    });
    json.layers.clients.entries = nextEntries;

    writeJson(filePath, json, dryRun);
  }
}

function applyOverlayReadmeUpdate(targetClientId, updatedClient, dryRun) {
  const roots = [
    path.join(workspaceRoot, 'docs/standards/clients', targetClientId, 'overlays'),
    path.join(workspaceRoot, '.github/initializer/packs/docs/standards/clients', targetClientId, 'overlays'),
  ];

  const lines = [];
  lines.push(`# ${updatedClient.displayName} Overlays`);
  lines.push('');
  lines.push('This folder contains client-specific standards that narrow or supplement the universal baseline.');
  lines.push('');
  lines.push('## Client Inputs Used');
  lines.push(`- Project: ${updatedClient.projectName || 'not provided'}`);
  lines.push(`- Output format preference: ${updatedClient.outputFormat || 'not provided'}`);
  lines.push(`- Output detail preference: ${updatedClient.outputDetail || 'not provided'}`);
  if (updatedClient.approvals.length > 0) {
    lines.push(`- Approval requirements: ${updatedClient.approvals.join('; ')}`);
  }
  if (updatedClient.securityRules.length > 0) {
    lines.push(`- Security and privacy requirements: ${updatedClient.securityRules.join('; ')}`);
  }
  if (updatedClient.avoidActions.length > 0) {
    lines.push(`- Avoid list: ${updatedClient.avoidActions.join('; ')}`);
  }
  lines.push('');
  lines.push('## Notes');
  lines.push('- Updated incrementally by update-client-profile.js.');
  const content = `${lines.join('\n')}\n`;

  for (const dirPath of roots) {
    if (dryRun) {
      continue;
    }
    fs.mkdirSync(dirPath, { recursive: true });
    writeText(path.join(dirPath, 'README.md'), content, false);
  }
}

function runManifestSync(dryRun) {
  if (dryRun) {
    return;
  }
  const syncPath = path.join(workspaceRoot, '.github/initializer/tools/sync-seed-manifest.js');
  const result = spawnSync('node', [syncPath], { stdio: 'inherit' });
  if (result.status !== 0) {
    throw new Error('Manifest sync failed after updating client profile.');
  }
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const inputAbsPath = path.isAbsolute(args.inputPath)
    ? args.inputPath
    : path.join(workspaceRoot, args.inputPath);

  if (!fs.existsSync(inputAbsPath)) {
    throw new Error(`Questionnaire input file not found: ${inputAbsPath}`);
  }

  const clientProfiles = readJson(CONFIG_PATHS.clientProfiles[0]);
  const requestedClientId = slugifyClientId(args.clientId || '');
  const derivedFromAnswer = slugifyClientId(parseQuestionnaireFile(inputAbsPath)[1] || '');
  const targetClientId = requestedClientId || derivedFromAnswer || clientProfiles.defaultClientId;
  if (!targetClientId) {
    throw new Error('Unable to resolve target client id. Pass --client-id or include question 1 answer.');
  }

  const answers = parseQuestionnaireFile(inputAbsPath);
  const existingClient = ensureClientExists(clientProfiles, targetClientId);
  const updatedClient = buildUpdatedClientState(existingClient, answers, targetClientId);
  const changes = buildDiff(existingClient, updatedClient);

  applyClientProfileUpdate(targetClientId, updatedClient, args.dryRun);
  applyStandardsCatalogUpdate(targetClientId, updatedClient, args.dryRun);
  applyOverlayReadmeUpdate(targetClientId, updatedClient, args.dryRun);

  if (args.syncManifest) {
    runManifestSync(args.dryRun);
  }

  const summary = {
    mode: args.dryRun ? 'dry-run' : 'apply',
    inputFile: normalizePath(path.relative(workspaceRoot, inputAbsPath)),
    clientId: targetClientId,
    displayName: updatedClient.displayName,
    changedFields: changes.map((change) => change.field),
    changedFieldCount: changes.length,
    syncManifest: args.syncManifest,
  };

  console.log(JSON.stringify(summary, null, 2));
}

try {
  main();
} catch (error) {
  console.error(`[update-client-profile] ${error.message}`);
  process.exit(1);
}
