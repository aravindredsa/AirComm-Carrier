#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const workspaceRoot = process.cwd();

function printUsage() {
  console.log(`Usage: node .github/initializer/tools/onboard-new-client.js --input <path> [options]

Options:
  --input <path>         Path to completed questionnaire file (markdown or json)
  --client-id <id>       Override derived client id
  --dry-run              Show planned changes without writing files
  --sync-manifest        Run sync-seed-manifest.js after applying changes
  --help                 Show this help
`);
}

function parseArgs(argv) {
  const parsed = {
    inputPath: null,
    clientIdOverride: null,
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
      parsed.clientIdOverride = argv[i + 1];
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

function normalizePath(p) {
  return p.replace(/\\/g, '/');
}

function readText(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function readJson(filePath) {
  return JSON.parse(readText(filePath));
}

function writeJson(filePath, data, dryRun) {
  const content = `${JSON.stringify(data, null, 2)}\n`;
  writeText(filePath, content, dryRun);
}

function writeText(filePath, content, dryRun) {
  if (dryRun) {
    return;
  }
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
}

function ensureDir(dirPath, dryRun) {
  if (dryRun) {
    return;
  }
  fs.mkdirSync(dirPath, { recursive: true });
}

function removeDir(dirPath, dryRun) {
  if (!fs.existsSync(dirPath)) {
    return;
  }
  if (dryRun) {
    return;
  }
  fs.rmSync(dirPath, { recursive: true, force: true });
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
    .map((v) => v.trim())
    .filter(Boolean)
    .map((v) => v.replace(/^[-*]\s*/, '').trim())
    .filter(Boolean);
}

function normalizeBooleanText(value) {
  const t = String(value || '').trim().toLowerCase();
  if (!t) {
    return null;
  }
  if (['yes', 'y', 'true'].includes(t)) {
    return true;
  }
  if (['no', 'n', 'false'].includes(t)) {
    return false;
  }
  return null;
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
      const a = item.answer || item.value || '';
      if (Number.isInteger(q) && String(a).trim()) {
        answers[q] = String(a).trim();
      }
    }
  }

  for (const [k, v] of Object.entries(obj)) {
    const q = Number.parseInt(String(k).replace(/[^0-9]/g, ''), 10);
    if (Number.isInteger(q) && !answers[q] && typeof v !== 'object' && String(v).trim()) {
      answers[q] = String(v).trim();
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
  if (/\bjava\b|spring\s*webflux|\bwebflux\b/.test(t)) set.add('java');
  if (/(typescript|\bts\b)/.test(t)) set.add('typescript');
  if (/\bsql\b/.test(t)) set.add('sql');
  return [...set];
}

function mapFrameworks(input) {
  const t = String(input || '').toLowerCase();
  const set = new Set();
  if (/react/.test(t)) set.add('react');
  if (/(asp\.net\s*core|aspnet\s*core|\.net\s*core)/.test(t)) set.add('aspnet-core');
  if (/spring\s*boot|springboot|spring\s*webflux|\bwebflux\b/.test(t)) set.add('spring-boot');
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
  if (/cassandra|mongodb|dynamodb|cosmos\s*db|nosql/.test(t)) set.add('data-contracts');
  if (set.size === 0) {
    set.add('relational-schema');
  }
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
  if (set.size === 0) {
    return ['analysis', 'implementation', 'testing', 'documentation'];
  }
  return [...set];
}

function quoteYaml(value) {
  return String(value || '').replace(/"/g, '\\"');
}

function buildClientProfileYaml(state) {
  const lines = [];
  lines.push(`clientId: ${state.clientId}`);
  lines.push(`displayName: ${state.displayName}`);
  lines.push(`description: ${state.description}`);
  lines.push('default: true');
  lines.push('intendedUse:');
  if (state.intendedUse.length === 0) {
    lines.push('  - analysis');
  } else {
    for (const v of state.intendedUse) {
      lines.push(`  - ${v}`);
    }
  }
  lines.push('enabledCapabilities:');
  for (const group of ['language', 'framework', 'testing', 'data', 'platform', 'architecture']) {
    const arr = state.enabledCapabilities[group] || [];
    if (arr.length === 0) {
      lines.push(`  ${group}: []`);
    } else {
      lines.push(`  ${group}:`);
      for (const v of arr) {
        lines.push(`    - ${v}`);
      }
    }
  }
  lines.push(`overlayRoot: docs/standards/clients/${state.clientId}/overlays`);
  lines.push('rules:');
  if (state.rules.length === 0) {
    lines.push('  - Keep client overlay rules additive and narrow relative to universal standards.');
  } else {
    for (const r of state.rules) {
      lines.push(`  - ${r}`);
    }
  }
  lines.push('examples:');
  lines.push(`  preferredOutputStyle: "${quoteYaml(state.outputDetail)}"`);
  if (state.preferredTerms.length === 0) {
    lines.push('  clientSpecificTerminology: []');
  } else {
    lines.push('  clientSpecificTerminology:');
    for (const t of state.preferredTerms) {
      lines.push(`    - ${t}`);
    }
  }
  return `${lines.join('\n')}\n`;
}

function buildOverlayReadme(state) {
  const lines = [];
  lines.push(`# ${state.displayName} Overlays`);
  lines.push('');
  lines.push('This folder contains client-specific standards that narrow or supplement the universal baseline.');
  lines.push('');
  lines.push('## Rules');
  lines.push('- Add only client-specific deltas here.');
  lines.push('- Do not duplicate universal common, domain, or capability rules unless a narrower client rule is required.');
  lines.push('- If a rule applies to more than one client, move it to a capability or domain file instead of keeping it in the overlay.');
  lines.push('');
  lines.push('## Client Inputs Used');
  lines.push(`- Project: ${state.projectName || 'not provided'}`);
  lines.push(`- Output format preference: ${state.outputFormat || 'not provided'}`);
  lines.push(`- Output detail preference: ${state.outputDetail || 'not provided'}`);
  if (state.approvals.length > 0) {
    lines.push(`- Approval requirements: ${state.approvals.join('; ')}`);
  }
  if (state.securityRules.length > 0) {
    lines.push(`- Security and privacy requirements: ${state.securityRules.join('; ')}`);
  }
  if (state.avoidActions.length > 0) {
    lines.push(`- Avoid list: ${state.avoidActions.join('; ')}`);
  }
  lines.push('');
  lines.push('## Notes');
  lines.push('- This distribution is prepared for a single client profile by design.');
  lines.push('- Do not add other client folders in this package unless explicitly required.');
  return `${lines.join('\n')}\n`;
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function buildState(answers, clientIdOverride) {
  const displayName = (answers[1] || '').trim();
  if (!displayName && !clientIdOverride) {
    throw new Error('Question 1 answer is required (client name), or pass --client-id.');
  }
  const derivedClientId = slugifyClientId(clientIdOverride || displayName || 'client');
  if (!derivedClientId) {
    throw new Error('Unable to derive client id. Provide a valid answer for question 1 or pass --client-id.');
  }

  const preferredTerms = unique(splitList(answers[13]));
  const restrictedTerms = unique(splitList(answers[14]));
  const teamRules = unique(splitList(answers[15]));
  const securityRules = unique(splitList(answers[16]));
  const approvals = unique(splitList(answers[17]));
  const avoidActions = unique(splitList(answers[18]));

  const outputTypes = unique(splitList(answers[9]));
  const outputFormat = (answers[10] || '').trim();
  const outputDetail = (answers[12] || '').trim();

  const enabledCapabilities = {
    language: mapLanguages(answers[4]),
    framework: mapFrameworks(answers[5]),
    testing: mapTesting(answers[6]),
    data: mapData(answers[7]),
    platform: mapPlatform(answers[8]),
    architecture: ['api', 'workers', 'modular-boundaries'],
  };

  if (String(answers[9] || '').toLowerCase().includes('workflow')) {
    enabledCapabilities.architecture = unique([...enabledCapabilities.architecture, 'events']);
  }

  const rules = unique([
    ...teamRules,
    ...securityRules,
    ...avoidActions.map((a) => `Avoid: ${a}`),
    approvals.length > 0 ? `Require approvals: ${approvals.join(', ')}` : '',
  ]);

  const baselineExpectations = unique([
    'Use common standards first, then domain and capability standards, then this client overlay when needed.',
    outputFormat ? `Prefer output format: ${outputFormat}.` : '',
    outputDetail ? `Output detail preference: ${outputDetail}.` : '',
    outputTypes.length > 0 ? `Target output types: ${outputTypes.join(', ')}.` : '',
    preferredTerms.length > 0 ? `Preferred terminology: ${preferredTerms.join(', ')}.` : '',
    restrictedTerms.length > 0 ? `Avoid terminology: ${restrictedTerms.join(', ')}.` : '',
  ]);

  const requiredGuardrails = unique([
    'Do not weaken common security or quality rules.',
    ...securityRules,
    ...avoidActions,
    approvals.length > 0 ? `Approval gate: ${approvals.join(', ')}` : '',
  ]);

  return {
    clientId: derivedClientId,
    displayName: displayName || derivedClientId,
    description: `Single-client distribution profile for ${displayName || derivedClientId}.`,
    projectName: (answers[2] || '').trim(),
    intendedUse: mapIntendedUse(answers[3]),
    enabledCapabilities,
    overlayPath: `docs/standards/clients/${derivedClientId}/overlays`,
    baselineExpectations,
    requiredGuardrails,
    preferredTerms,
    restrictedTerms,
    rules,
    outputFormat,
    outputDetail,
    outputTypes,
    securityRules,
    approvals,
    avoidActions,
  };
}

function updateClientProfiles(clientState, dryRun) {
  const paths = [
    path.join(workspaceRoot, 'config/client-profiles.json'),
    path.join(workspaceRoot, '.github/initializer/packs/root/config/client-profiles.json'),
  ];

  for (const p of paths) {
    const json = readJson(p);
    json.defaultClientId = clientState.clientId;
    json.clients = {
      [clientState.clientId]: {
        displayName: clientState.displayName,
        description: clientState.description,
        intendedUse: clientState.intendedUse,
        stackSignals: unique([
          ...clientState.enabledCapabilities.language,
          ...clientState.enabledCapabilities.framework,
          ...clientState.enabledCapabilities.testing,
          ...clientState.enabledCapabilities.platform,
        ]),
        enabledCapabilities: clientState.enabledCapabilities,
        overlayPath: clientState.overlayPath,
        baselineExpectations: clientState.baselineExpectations,
        requiredGuardrails: clientState.requiredGuardrails,
      },
    };
    writeJson(p, json, dryRun);
  }
}

function updateStandardsResolutionPolicy(clientId, dryRun) {
  const paths = [
    path.join(workspaceRoot, 'config/standards-resolution-policy.json'),
    path.join(workspaceRoot, '.github/initializer/packs/root/config/standards-resolution-policy.json'),
  ];

  for (const p of paths) {
    const json = readJson(p);
    json.defaultClientId = clientId;
    if (!json.rules) {
      json.rules = {};
    }
    if (!json.rules.clientOnboarding) {
      json.rules.clientOnboarding = {};
    }
    json.rules.clientOnboarding.defaultProfile = clientId;
    writeJson(p, json, dryRun);
  }
}

function updateStandardsCatalog(clientState, dryRun) {
  const paths = [
    path.join(workspaceRoot, 'config/standards-catalog.json'),
    path.join(workspaceRoot, '.github/initializer/packs/root/config/standards-catalog.json'),
  ];

  for (const p of paths) {
    const json = readJson(p);
    if (!json.layers) {
      json.layers = {};
    }
    if (!json.layers.clients) {
      json.layers.clients = { description: 'Client overlays that narrow or extend the universal baseline.', entries: [] };
    }
    json.layers.clients.entries = [
      {
        id: clientState.clientId,
        profile: `config/client-profiles.json#clients.${clientState.clientId}`,
        overlayRoot: clientState.overlayPath,
        description: `Single-client overlay profile for ${clientState.displayName}`,
      },
    ];

    if (!json.sourceStrategy) {
      json.sourceStrategy = {};
    }
    json.sourceStrategy.clientDefault = clientState.clientId;

    writeJson(p, json, dryRun);
  }
}

function updateClientFolders(clientState, dryRun) {
  const workspaceClientsRoot = path.join(workspaceRoot, 'docs/standards/clients');
  const packClientsRoot = path.join(workspaceRoot, '.github/initializer/packs/docs/standards/clients');

  const roots = [workspaceClientsRoot, packClientsRoot];
  for (const root of roots) {
    ensureDir(root, dryRun);

    const existing = fs.existsSync(root)
      ? fs.readdirSync(root, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name)
      : [];

    for (const dirName of existing) {
      if (dirName !== clientState.clientId) {
        removeDir(path.join(root, dirName), dryRun);
      }
    }

    const clientDir = path.join(root, clientState.clientId);
    const overlaysDir = path.join(clientDir, 'overlays');
    ensureDir(overlaysDir, dryRun);

    const yamlContent = buildClientProfileYaml(clientState);
    writeText(path.join(clientDir, 'profile.yaml'), yamlContent, dryRun);

    const readmeContent = buildOverlayReadme(clientState);
    writeText(path.join(overlaysDir, 'README.md'), readmeContent, dryRun);
  }
}

function runManifestSync(dryRun) {
  if (dryRun) {
    return;
  }
  const { spawnSync } = require('child_process');
  const syncPath = path.join(workspaceRoot, '.github/initializer/tools/sync-seed-manifest.js');
  const result = spawnSync('node', [syncPath], { stdio: 'inherit' });
  if (result.status !== 0) {
    throw new Error('Manifest sync failed after applying client questionnaire.');
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

  const answers = parseQuestionnaireFile(inputAbsPath);
  const state = buildState(answers, args.clientIdOverride);

  updateClientProfiles(state, args.dryRun);
  updateStandardsResolutionPolicy(state.clientId, args.dryRun);
  updateStandardsCatalog(state, args.dryRun);
  updateClientFolders(state, args.dryRun);

  if (args.syncManifest) {
    runManifestSync(args.dryRun);
  }

  const summary = {
    mode: args.dryRun ? 'dry-run' : 'apply',
    inputFile: normalizePath(path.relative(workspaceRoot, inputAbsPath)),
    clientId: state.clientId,
    displayName: state.displayName,
    overlayPath: state.overlayPath,
    enabledCapabilities: state.enabledCapabilities,
    syncManifest: args.syncManifest,
  };

  console.log(JSON.stringify(summary, null, 2));
}

try {
  main();
} catch (error) {
  console.error(`[onboard-new-client] ${error.message}`);
  process.exit(1);
}
