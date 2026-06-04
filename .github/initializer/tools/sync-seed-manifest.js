#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const workspaceRoot = process.cwd();
const manifestPath = path.join(workspaceRoot, '.github/initializer/manifest/seed-manifest.json');
const normalizationPath = path.join(workspaceRoot, '.github/initializer/rules/normalization.json');
const releaseNotesPath = path.join(workspaceRoot, 'initializer-release-notes.md');
const ownerStatePath = path.join(workspaceRoot, '.init_state/owner-distribution-state.json');

const args = new Set(process.argv.slice(2));
const checkOnly = args.has('--check');

const KNOWN_PACK_PREFIX_MAPPINGS = [
  { prefix: 'prompts/', targetPrefix: '.github/prompts/' },
  { prefix: 'skills/', targetPrefix: '.github/skills/' },
  { prefix: 'docs/playbooks/', targetPrefix: 'docs/playbooks/' },
  { prefix: 'playbooks/', targetPrefix: 'docs/playbooks/' },
  { prefix: 'templates/', targetPrefix: 'templates/' },
  { prefix: 'reports/', targetPrefix: 'reports/' },
  { prefix: 'artifacts/', targetPrefix: 'artifacts/' },
  { prefix: 'agents/', targetPrefix: 'agents/' },
  { prefix: 'vscode/', targetPrefix: '.vscode/' },
  { prefix: 'root/', targetPrefix: '' },
  { prefix: 'docs/architecture/', targetPrefix: 'docs/architecture/' },
  { prefix: 'docs/references/', targetPrefix: 'docs/references/' },
  { prefix: 'docs/standards/', targetPrefix: 'docs/standards/' },
];

const ROOT_FOLDERS_ALWAYS_REQUIRED = [
  '.github',
  '.github/hooks',
  '.github/prompts',
  '.github/skills',
  'docs',
  'docs/architecture',
  'docs/playbooks',
  'docs/references',
  'docs/standards',
  'agents',
  'artifacts',
  'artifacts/functional-requirements',
  'reports',
  'templates',
  '.vscode',
];

function normalizePath(p) {
  return p.replace(/\\/g, '/').replace(/^\.\//, '');
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, data) {
  const content = `${JSON.stringify(data, null, 2)}\n`;
  fs.writeFileSync(filePath, content, 'utf8');
}

function fileExists(filePath) {
  try {
    fs.accessSync(filePath, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

function ensureParentDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function collectFilesRecursive(absDir) {
  const collected = [];

  function walk(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.isFile()) {
        if (entry.name === '.DS_Store') {
          continue;
        }
        collected.push(fullPath);
      }
    }
  }

  walk(absDir);
  return collected;
}

function mapPackSourceToTarget(relSourcePath) {
  if (relSourcePath === 'root/copilot-instructions.md') {
    return '.github/copilot-instructions.md';
  }

  for (const mapping of KNOWN_PACK_PREFIX_MAPPINGS) {
    if (relSourcePath.startsWith(mapping.prefix)) {
      const tail = relSourcePath.slice(mapping.prefix.length);
      return normalizePath(`${mapping.targetPrefix}${tail}`);
    }
  }

  if (relSourcePath.startsWith('docs/')) {
    return normalizePath(relSourcePath);
  }

  throw new Error(`Unsupported pack source path: ${relSourcePath}`);
}

function resolveNormalizationRules(normalizationConfig) {
  const contentRules = normalizationConfig.contentRules || {};
  return {
    lineEndings: contentRules.lineEndings || normalizationConfig.lineEndings || 'LF',
    trimTrailingSpaces:
      contentRules.trimTrailingSpaces ??
      normalizationConfig.trimTrailingWhitespace ??
      normalizationConfig.trimTrailingSpaces ??
      true,
    trimFinalNewline:
      contentRules.trimFinalTrailingNewlineForCompare ??
      normalizationConfig.trimFinalNewline ??
      normalizationConfig.trimFinalTrailingNewlineForCompare ??
      true,
  };
}

function normalizeContent(content, normalizationConfig) {
  const rules = resolveNormalizationRules(normalizationConfig);
  let normalized = content;

  if (normalizationConfig.pathRules?.trimWhitespace === true) {
    normalized = normalized.replace(/^\uFEFF/, '');
  }

  if (rules.lineEndings === 'LF') {
    normalized = normalized.replace(/\r\n?/g, '\n');
  }

  if (rules.trimTrailingSpaces === true) {
    normalized = normalized
      .split('\n')
      .map((line) => line.replace(/[ \t]+$/g, ''))
      .join('\n');
  }

  if (rules.trimFinalNewline === true) {
    normalized = normalized.replace(/\n+$/g, '');
  }

  return normalized;
}

function sha256(input) {
  return crypto.createHash('sha256').update(input, 'utf8').digest('hex');
}

function sha256Buffer(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

function getApplyMode(targetPath) {
  if (targetPath === '.github/copilot-instructions.md') {
    return 'preserve-meaningful';
  }

  if (targetPath === '.init_state/prompt-usage.jsonl') {
    return 'preserve-meaningful';
  }

  if (targetPath === '.github/initializer/tools/sync-owner-from-zip.js') {
    return 'bootstrap-protected';
  }

  const fileName = path.posix.basename(targetPath);
  const parent = path.posix.dirname(targetPath);
  if (fileName === 'README.md' && (parent.startsWith('artifacts/') || parent.startsWith('reports/'))) {
    return 'create-if-parent-empty';
  }

  return 'overwrite';
}

function parentFoldersForPath(filePath) {
  const folders = [];
  let current = path.posix.dirname(filePath);

  while (current && current !== '.' && current !== '/') {
    folders.push(current);
    current = path.posix.dirname(current);
  }

  return folders;
}

function uniqueSorted(items) {
  return [...new Set(items)].sort((a, b) => a.localeCompare(b));
}

function parseSemver(value) {
  const text = String(value || '').trim();
  const match = text.match(/^(\d+)\.(\d+)\.(\d+)$/);
  if (!match) {
    return null;
  }
  return {
    major: Number.parseInt(match[1], 10),
    minor: Number.parseInt(match[2], 10),
    patch: Number.parseInt(match[3], 10),
  };
}

function formatSemver(version) {
  return `${version.major}.${version.minor}.${version.patch}`;
}

function toSemverString(value, fallback = '0.0.0') {
  if (value === null || value === undefined || value === '') {
    return fallback;
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    return `${Math.max(0, Math.trunc(value))}.0.0`;
  }

  const text = String(value).trim();
  const parsed = parseSemver(text);
  if (parsed) {
    return formatSemver(parsed);
  }

  if (/^\d+$/.test(text)) {
    return `${Number.parseInt(text, 10)}.0.0`;
  }

  return fallback;
}

function bumpSemver(version, releaseType) {
  if (releaseType === 'major') {
    return { major: version.major + 1, minor: 0, patch: 0 };
  }
  if (releaseType === 'minor') {
    return { major: version.major, minor: version.minor + 1, patch: 0 };
  }
  return { major: version.major, minor: version.minor, patch: version.patch + 1 };
}

function parseLatestVersionFromReleaseNotes(content) {
  const versionRegex = /^##\s+\d{4}-\d{2}-\d{2}\s+\(Version\s+([^)]+)\)\s*$/gm;
  let latest = { major: 0, minor: 0, patch: 0 };
  let found = false;
  let match;
  while ((match = versionRegex.exec(content)) !== null) {
    found = true;
    const candidate = toSemverString(match[1], '0.0.0');
    const parsed = parseSemver(candidate);
    if (!parsed) {
      continue;
    }
    const isGreater =
      parsed.major > latest.major ||
      (parsed.major === latest.major && parsed.minor > latest.minor) ||
      (parsed.major === latest.major && parsed.minor === latest.minor && parsed.patch > latest.patch);
    if (isGreater) {
      latest = parsed;
    }
  }
  if (!found) {
    return '';
  }
  return formatSemver(latest);
}

function getManagedSourcePaths(manifest) {
  const managed = [];
  const packBasePath = manifest.packPolicy?.packBasePath || `.github/initializer/packs/${manifest.packVersion}`;
  const absPackBase = path.join(workspaceRoot, packBasePath);

  if (fileExists(absPackBase)) {
    for (const absFile of collectFilesRecursive(absPackBase)) {
      managed.push(normalizePath(path.relative(workspaceRoot, absFile)));
    }
  }

  const bootstrapPaths = manifest.resetPolicy?.bootstrapPromptPaths || [];
  for (const relPath of bootstrapPaths) {
    if (fileExists(path.join(workspaceRoot, relPath))) {
      managed.push(normalizePath(relPath));
    }
  }

  for (const relPath of [
    '.github/copilot-instructions.md',
    'workspace-ai-initialization-guide.md',
  ]) {
    if (fileExists(path.join(workspaceRoot, relPath))) {
      managed.push(relPath);
    }
  }

  return uniqueSorted(managed);
}

function computeManagedHashes(managedPaths) {
  const hashes = {};
  for (const relPath of managedPaths) {
    const absPath = path.join(workspaceRoot, relPath);
    if (fileExists(absPath)) {
      hashes[relPath] = sha256Buffer(fs.readFileSync(absPath));
    }
  }
  return hashes;
}

function computeFingerprint(fileHashes) {
  const payload = Object.entries(fileHashes)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([filePath, hash]) => `${filePath}:${hash}`)
    .join('\n');
  return sha256(payload);
}

function diffChangedPaths(baselineHashes, currentHashes) {
  const keys = uniqueSorted([...Object.keys(baselineHashes || {}), ...Object.keys(currentHashes || {})]);
  return keys.filter((key) => (baselineHashes || {})[key] !== (currentHashes || {})[key]);
}

function utcNowIso() {
  return new Date().toISOString();
}

function normalizeOwnerState(state, fallbackVersion) {
  const normalized = { ...(state || {}) };

  normalized.schemaVersion = '2.0';
  normalized.lastDistributedVersion = toSemverString(
    normalized.lastDistributedVersion,
    fallbackVersion,
  );
  normalized.activeWorkVersion = toSemverString(
    normalized.activeWorkVersion,
    normalized.lastDistributedVersion,
  );
  normalized.lastDistributedAtUtc = normalized.lastDistributedAtUtc || '';
  normalized.lastDistributedArtifact = normalized.lastDistributedArtifact || '';
  normalized.baselineFingerprint = normalized.baselineFingerprint || '';
  normalized.baselineFileHashes = normalized.baselineFileHashes || {};
  normalized.activeCycleOpen = normalized.activeCycleOpen === true;
  normalized.activeWorkStartedAtUtc = normalized.activeWorkStartedAtUtc || '';
  normalized.pendingChangedPaths = Array.isArray(normalized.pendingChangedPaths)
    ? normalized.pendingChangedPaths
    : [];
  normalized.lastSyncFingerprint = normalized.lastSyncFingerprint || normalized.baselineFingerprint || '';
  normalized.lastSyncedAtUtc = normalized.lastSyncedAtUtc || utcNowIso();

  return normalized;
}

function loadOrInitOwnerState(initialVersion, baselineFingerprint, baselineHashes) {
  if (!fileExists(ownerStatePath)) {
    const initState = normalizeOwnerState({
      lastDistributedVersion: initialVersion,
      lastDistributedAtUtc: '',
      lastDistributedArtifact: '',
      baselineFingerprint,
      baselineFileHashes: baselineHashes,
      activeCycleOpen: false,
      activeWorkVersion: initialVersion,
      activeWorkStartedAtUtc: '',
      pendingChangedPaths: [],
      lastSyncFingerprint: baselineFingerprint,
      lastSyncedAtUtc: utcNowIso(),
    }, initialVersion);
    ensureParentDir(ownerStatePath);
    writeJson(ownerStatePath, initState);
    return initState;
  }

  const state = normalizeOwnerState(readJson(ownerStatePath), initialVersion);
  return state;
}

function buildManifest(manifest, normalizationConfig) {
  const packBasePath = manifest.packPolicy?.packBasePath || `.github/initializer/packs/${manifest.packVersion}`;
  const absPackBasePath = path.join(workspaceRoot, packBasePath);

  if (!fileExists(absPackBasePath)) {
    throw new Error(`Pack base path not found: ${packBasePath}`);
  }

  const packFilesAbs = collectFilesRecursive(absPackBasePath);
  const seededTargets = [];

  for (const absSourcePath of packFilesAbs) {
    const sourcePath = normalizePath(path.relative(workspaceRoot, absSourcePath));
    const relUnderPack = normalizePath(path.relative(absPackBasePath, absSourcePath));
    const targetPath = mapPackSourceToTarget(relUnderPack);
    const applyMode = getApplyMode(targetPath);
    const raw = fs.readFileSync(absSourcePath, 'utf8');
    const checksumSha256 = sha256(normalizeContent(raw, normalizationConfig));

    const target = {
      targetPath,
      applyMode,
      compareMode: 'normalized-exact',
      sourcePath,
      checksumSha256,
    };

    if (applyMode === 'create-if-parent-empty') {
      target.parentFolder = path.posix.dirname(targetPath);
    }

    seededTargets.push(target);
  }

  const bootstrapPromptPaths = manifest.resetPolicy?.bootstrapPromptPaths || [];
  const bootstrapTargets = bootstrapPromptPaths.map((targetPath) => ({
    targetPath: normalizePath(targetPath),
    applyMode: 'bootstrap-protected',
    compareMode: 'none',
  }));

  const allTargets = uniqueSorted(
    [...seededTargets, ...bootstrapTargets].map((target) => JSON.stringify(target)),
  ).map((serialized) => JSON.parse(serialized))
    .sort((a, b) => a.targetPath.localeCompare(b.targetPath));

  const createIfFolderEmptyMap = new Map();
  for (const target of allTargets) {
    if (target.applyMode !== 'create-if-parent-empty') {
      continue;
    }

    const folder = target.parentFolder || path.posix.dirname(target.targetPath);
    const files = createIfFolderEmptyMap.get(folder) || [];
    files.push(target.targetPath);
    createIfFolderEmptyMap.set(folder, files);
  }

  const createIfFolderEmpty = [...createIfFolderEmptyMap.entries()]
    .map(([folder, files]) => ({
      folder,
      files: uniqueSorted(files),
    }))
    .sort((a, b) => a.folder.localeCompare(b.folder));

  const requiredFiles = allTargets
    .filter((target) => target.applyMode !== 'create-if-parent-empty')
    .map((target) => target.targetPath)
    .sort((a, b) => a.localeCompare(b));

  const derivedFolders = [];
  for (const filePath of requiredFiles) {
    derivedFolders.push(...parentFoldersForPath(filePath));
  }
  for (const item of createIfFolderEmpty) {
    derivedFolders.push(...parentFoldersForPath(item.folder));
    derivedFolders.push(item.folder);
  }

  const requiredFolders = uniqueSorted([...ROOT_FOLDERS_ALWAYS_REQUIRED, ...derivedFolders]);

  return {
    ...manifest,
    requiredFolders,
    requiredFiles,
    createIfFolderEmpty,
    targets: allTargets,
  };
}

function main() {
  if (!fileExists(manifestPath)) {
    throw new Error(`Manifest not found: ${manifestPath}`);
  }
  if (!fileExists(normalizationPath)) {
    throw new Error(`Normalization rules not found: ${normalizationPath}`);
  }

  const manifest = readJson(manifestPath);
  const normalizationConfig = readJson(normalizationPath);
  const rebuilt = buildManifest(manifest, normalizationConfig);

  const oldContent = `${JSON.stringify(manifest, null, 2)}\n`;
  const newContent = `${JSON.stringify(rebuilt, null, 2)}\n`;

  if (checkOnly) {
    if (oldContent !== newContent) {
      console.error('Manifest is out of date. Run sync-seed-manifest.js to update metadata.');
      process.exit(1);
    }
    console.log('Manifest is up to date.');
    return;
  }

  writeJson(manifestPath, rebuilt);
  const releaseNotesContent = fileExists(releaseNotesPath) ? fs.readFileSync(releaseNotesPath, 'utf8') : '';
  const stageVersion = `${Number.parseInt(rebuilt.stage || '0', 10) || 0}.0.0`;
  const initialVersion = parseLatestVersionFromReleaseNotes(releaseNotesContent) || stageVersion;
  const managedPaths = getManagedSourcePaths(rebuilt);
  const currentHashes = computeManagedHashes(managedPaths);
  const currentFingerprint = computeFingerprint(currentHashes);
  const state = loadOrInitOwnerState(initialVersion, currentFingerprint, currentHashes);

  if (currentFingerprint !== state.baselineFingerprint) {
    const changedSinceDistribution = diffChangedPaths(state.baselineFileHashes || {}, currentHashes);
    if (!state.activeCycleOpen) {
      const lastVersion = parseSemver(state.lastDistributedVersion) || parseSemver(initialVersion) || { major: 0, minor: 0, patch: 0 };
      state.activeCycleOpen = true;
      state.activeWorkVersion = formatSemver(bumpSemver(lastVersion, 'patch'));
      state.activeWorkStartedAtUtc = utcNowIso();
      state.pendingChangedPaths = [];
    }
    state.pendingChangedPaths = uniqueSorted([...(state.pendingChangedPaths || []), ...changedSinceDistribution]);
  } else if (state.activeCycleOpen) {
    state.activeCycleOpen = false;
    state.activeWorkVersion = state.lastDistributedVersion;
    state.activeWorkStartedAtUtc = '';
    state.pendingChangedPaths = [];
  }

  state.lastSyncFingerprint = currentFingerprint;
  state.lastSyncedAtUtc = utcNowIso();
  ensureParentDir(ownerStatePath);
  writeJson(ownerStatePath, state);

  const seededCount = rebuilt.targets.filter((target) => target.applyMode !== 'bootstrap-protected').length;
  console.log(`Synced manifest metadata: targets=${rebuilt.targets.length}, seededTargets=${seededCount}`);
  console.log(
    `Owner cycle status: ${state.activeCycleOpen ? `open-v${state.activeWorkVersion}` : `closed-v${state.lastDistributedVersion}`}`,
  );
}

main();
