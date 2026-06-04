#!/usr/bin/env node

const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const { spawnSync } = require('child_process');

const workspaceRoot = process.cwd();
const manifestPath = path.join(workspaceRoot, '.github/initializer/manifest/seed-manifest.json');
const ownerStatePath = path.join(workspaceRoot, '.init_state/owner-distribution-state.json');
const syncScriptPath = path.join(workspaceRoot, '.github/initializer/tools/sync-seed-manifest.js');
const releaseNotesPath = path.join(workspaceRoot, 'initializer-release-notes.md');
const distributionsDir = path.join(workspaceRoot, 'distributions');

function parseArgs(argv) {
  const parsed = {
    pruneDeleted: false,
    releaseType: 'auto',
    noReleaseCheck: false,
  };

  for (const arg of argv) {
    if (arg === '--prune-deleted') {
      parsed.pruneDeleted = true;
      continue;
    }

    if (arg.startsWith('--release=')) {
      const value = arg.slice('--release='.length).trim().toLowerCase();
      if (!['auto', 'major', 'minor', 'patch'].includes(value)) {
        throw new Error(`Unsupported release type: ${value}. Use --release=auto|major|minor|patch.`);
      }
      parsed.releaseType = value;
      continue;
    }

    if (arg === '--no-release-check') {
      parsed.noReleaseCheck = true;
    }
  }

  return parsed;
}

const cli = parseArgs(process.argv.slice(2));
const pruneDeleted = cli.pruneDeleted;

function normalizePath(value) {
  return value.replace(/\\/g, '/').replace(/^\.\//, '');
}

function fileExists(filePath) {
  try {
    fs.accessSync(filePath, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

function uniqueSorted(items) {
  return [...new Set(items)].sort((a, b) => a.localeCompare(b));
}

function getCurrentDateLocalIso() {
  const now = new Date();
  const timezoneOffsetMs = now.getTimezoneOffset() * 60 * 1000;
  return new Date(now.getTime() - timezoneOffsetMs).toISOString().slice(0, 10);
}

function utcNowIso() {
  return new Date().toISOString();
}

function detectProjectSlug() {
  return 'ai-universal-enabler';
}

function commandExists(command) {
  const result = spawnSync('command', ['-v', command], {
    shell: true,
    stdio: 'ignore',
  });
  return result.status === 0;
}

function resolveZipCommand() {
  if (commandExists('zip')) {
    return 'zip';
  }

  if (process.platform === 'win32') {
    const windowsZipCandidates = [
      'C:/Program Files/GnuWin32/bin/zip.exe',
      'C:/Program Files (x86)/GnuWin32/bin/zip.exe',
    ];

    for (const candidate of windowsZipCandidates) {
      if (fileExists(candidate)) {
        return candidate;
      }
    }
  }

  return null;
}

function createZipArchive(artifactPath, sourceDir) {
  const zipCmd = resolveZipCommand();

  if (zipCmd) {
    const result = spawnSync(zipCmd, ['-rq', artifactPath, '.'], {
      cwd: sourceDir,
      stdio: 'inherit',
    });
    if (result.status !== 0) {
      throw new Error('zip creation failed.');
    }
    return;
  }

  if (process.platform === 'win32') {
    // PowerShell Compress-Archive fallback (available on Windows 5.0+)
    const psScript = `Compress-Archive -Path (Get-ChildItem -Force -Path '${sourceDir}' | Select-Object -ExpandProperty FullName) -DestinationPath '${artifactPath}' -Force`;
    const result = spawnSync('powershell', [
      '-NoProfile', '-ExecutionPolicy', 'Bypass', '-Command', psScript,
    ], { stdio: 'inherit' });
    if (result.status !== 0) {
      throw new Error('zip creation failed via PowerShell Compress-Archive.');
    }
    return;
  }

  throw new Error('zip command not available on this machine. Install zip and rerun finalize task.');
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

function sha256Buffer(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

function sha256Text(text) {
  return crypto.createHash('sha256').update(text, 'utf8').digest('hex');
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

function releaseRank(releaseType) {
  if (releaseType === 'major') {
    return 3;
  }
  if (releaseType === 'minor') {
    return 2;
  }
  return 1;
}

function diffManagedChanges(baselineHashes, currentHashes) {
  const keys = uniqueSorted([...Object.keys(baselineHashes || {}), ...Object.keys(currentHashes || {})]);
  const added = [];
  const removed = [];
  const modified = [];

  for (const key of keys) {
    const before = (baselineHashes || {})[key];
    const after = (currentHashes || {})[key];

    if (!before && after) {
      added.push(key);
      continue;
    }
    if (before && !after) {
      removed.push(key);
      continue;
    }
    if (before !== after) {
      modified.push(key);
    }
  }

  return { added, removed, modified };
}

function classifyRequiredRelease(changeSet) {
  const allChanged = [...changeSet.added, ...changeSet.removed, ...changeSet.modified];
  const isPromptPath = (p) =>
    p.startsWith('.github/initializer/packs/prompts/') ||
    p.startsWith('.github/prompts/');

  const isMinorPath = (p) =>
    p.startsWith('.github/initializer/packs/prompts/') ||
    p.startsWith('.github/initializer/packs/templates/') ||
    p.startsWith('.github/initializer/packs/agents/') ||
    p.startsWith('.github/initializer/packs/skills/') ||
    p.startsWith('.github/initializer/packs/root/.github/hooks/') ||
    p.startsWith('.github/skills/') ||
    p.startsWith('agents/');

  const isPatchOnlyPath = (p) =>
    p.startsWith('.github/initializer/packs/docs/') ||
    p.startsWith('docs/');

  const hasNewOrRemovedPrompt =
    changeSet.added.some((p) => isPromptPath(p)) ||
    changeSet.removed.some((p) => isPromptPath(p));
  if (hasNewOrRemovedPrompt) {
    return {
      required: 'major',
      reason: 'New or removed prompt detected.',
    };
  }

  const hasMinorChange = allChanged.some((p) => isMinorPath(p));
  if (hasMinorChange) {
    return {
      required: 'minor',
      reason: 'Prompt/template/agent/skill/hook change detected.',
    };
  }

  const hasOnlyPatchChanges = allChanged.every((p) => isPatchOnlyPath(p));
  if (hasOnlyPatchChanges) {
    return {
      required: 'patch',
      reason: 'Changes limited to docs reference content.',
    };
  }

  return {
    required: 'minor',
    reason: 'Non-doc managed changes detected.',
  };
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
  return sha256Text(payload);
}

function classifyReleaseNoteArea(filePath) {
  const pathValue = normalizePath(filePath);
  const areaRules = [
    { label: 'Workspace instructions', prefixes: ['.github/copilot-instructions.md'] },
    { label: 'Prompts', prefixes: ['.github/initializer/packs/prompts/', '.github/prompts/'] },
    { label: 'Hooks', prefixes: ['.github/initializer/packs/root/.github/hooks/', '.github/hooks/', '.githooks/'] },
    { label: 'Standards', prefixes: ['.github/initializer/packs/docs/standards/', 'docs/standards/'] },
    { label: 'Onboarding docs', prefixes: ['.github/initializer/packs/docs/onboarding/', 'docs/onboarding/'] },
    { label: 'Playbooks', prefixes: ['.github/initializer/packs/docs/playbooks/', 'docs/playbooks/'] },
    { label: 'Templates', prefixes: ['.github/initializer/packs/templates/', 'templates/'] },
    { label: 'Skills', prefixes: ['.github/initializer/packs/skills/', '.github/skills/'] },
    { label: 'Agents', prefixes: ['.github/initializer/packs/agents/', 'agents/'] },
    { label: 'Initializer tools', prefixes: ['.github/initializer/packs/root/.github/initializer/tools/', '.github/initializer/tools/'] },
    { label: 'Configuration', prefixes: ['.github/initializer/packs/root/config/', 'config/'] },
    { label: 'State', prefixes: ['.github/initializer/packs/root/.init_state/', '.init_state/'] },
    { label: 'Workspace guide', prefixes: ['.github/initializer/packs/root/workspace-ai-initialization-guide.md', 'workspace-ai-initialization-guide.md'] },
    { label: 'Release notes', prefixes: ['.github/initializer/packs/root/docs/onboarding/initializer-release-notes.md', 'docs/onboarding/initializer-release-notes.md', 'initializer-release-notes.md'] },
  ];

  for (const rule of areaRules) {
    if (rule.prefixes.some((prefix) => pathValue.startsWith(prefix))) {
      return rule.label;
    }
  }

  return 'Other managed files';
}

function summarizeReleaseAreas(changedPaths) {
  const counts = new Map();
  for (const filePath of changedPaths) {
    const area = classifyReleaseNoteArea(filePath);
    counts.set(area, (counts.get(area) || 0) + 1);
  }

  const areaPriority = [
    'Workspace instructions',
    'Prompts',
    'Hooks',
    'Standards',
    'Onboarding docs',
    'Playbooks',
    'Templates',
    'Skills',
    'Agents',
    'Initializer tools',
    'Configuration',
    'State',
    'Workspace guide',
    'Release notes',
    'Other managed files',
  ];

  return areaPriority
    .filter((area) => counts.has(area))
    .map((area) => ({ area, count: counts.get(area) }));
}

function selectRepresentativePaths(changedPaths) {
  const pathPriority = [
    '.github/copilot-instructions.md',
    '.github/initializer/packs/prompts/',
    '.github/prompts/',
    '.github/initializer/packs/root/.github/hooks/',
    '.github/hooks/',
    '.githooks/',
    '.github/initializer/packs/docs/standards/',
    'docs/standards/',
    '.github/initializer/packs/docs/onboarding/',
    'docs/onboarding/',
    '.github/initializer/packs/docs/playbooks/',
    'docs/playbooks/',
    '.github/initializer/packs/templates/',
    'templates/',
    '.github/initializer/packs/skills/',
    '.github/skills/',
    '.github/initializer/packs/root/.github/initializer/tools/',
    '.github/initializer/tools/',
    '.github/initializer/packs/root/config/',
    'config/',
    '.github/initializer/packs/root/.init_state/',
    '.init_state/',
    '.github/initializer/packs/root/workspace-ai-initialization-guide.md',
    'workspace-ai-initialization-guide.md',
    '.github/initializer/packs/root/docs/onboarding/initializer-release-notes.md',
    'docs/onboarding/initializer-release-notes.md',
    'initializer-release-notes.md',
  ];

  const ranked = [...changedPaths].sort((left, right) => {
    const leftIndex = pathPriority.findIndex((prefix) => normalizePath(left).startsWith(prefix));
    const rightIndex = pathPriority.findIndex((prefix) => normalizePath(right).startsWith(prefix));
    return (leftIndex === -1 ? pathPriority.length : leftIndex) - (rightIndex === -1 ? pathPriority.length : rightIndex) || left.localeCompare(right);
  });

  return ranked.slice(0, 8);
}

function buildDistributionSection(params) {
  const changedPaths = params.changedPaths.length > 0 ? params.changedPaths : ['(no managed source changes captured)'];
  const changedAreas = summarizeReleaseAreas(changedPaths);
  const representativePaths = selectRepresentativePaths(changedPaths);
  const lines = [
    `## ${params.dateIso} (Version ${params.version})`,
    '',
    'What downstream users get:',
    '- This distribution ships the latest initializer content to downstream workspaces.',
    '',
    'What changed:',
    ...changedAreas.map(({ area, count }) => `- ${area}: ${count} file${count === 1 ? '' : 's'}`),
    '',
    'Sections Updated:',
    ...representativePaths.map((entry) => `- ${entry}`),
    '',
    'User impact:',
    '- If you initialize or reset from this package, you will get the updated prompts, guidance, and managed assets included in this release.',
    '- Existing workspaces do not change automatically; reinitialize or reseed to pick up the new bundle.',
    '',
    'Distribution artifact:',
    `- ${params.artifactName}`,
    '',
  ];
  return lines.join('\n');
}

function upsertReleaseNotes(content, params) {
  const headingRegex = /^##\s+(\d{4}-\d{2}-\d{2})\s+\(Version\s+([^)]+)\)\s*$/gm;
  const matches = [];
  let match;
  while ((match = headingRegex.exec(content)) !== null) {
    matches.push({
      index: match.index,
      date: match[1],
      version: toSemverString(match[2], '0.0.0'),
    });
  }

  const preamble = matches.length > 0 ? content.slice(0, matches[0].index).trimEnd() : content.trimEnd();
  const sections = matches.map((entry, index) => {
    const start = entry.index;
    const end = index + 1 < matches.length ? matches[index + 1].index : content.length;
    return {
      ...entry,
      text: content.slice(start, end).trimEnd(),
    };
  });

  const filteredSections = sections.filter(
    (section) => !(section.date === params.dateIso && section.version === params.version),
  );

  const newSection = buildDistributionSection(params).trimEnd();
  filteredSections.unshift({ text: newSection });

  return `${preamble}\n\n${filteredSections.map((section) => section.text).join('\n\n').trimEnd()}\n`;
}

function copyFileOrDir(srcPath, destPath) {
  const stat = fs.statSync(srcPath);
  if (stat.isDirectory()) {
    fs.mkdirSync(destPath, { recursive: true });
    const entries = fs.readdirSync(srcPath, { withFileTypes: true });
    for (const entry of entries) {
      copyFileOrDir(path.join(srcPath, entry.name), path.join(destPath, entry.name));
    }
    return;
  }

  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  fs.copyFileSync(srcPath, destPath);
}

function removePathIfExists(targetPath) {
  if (fileExists(targetPath)) {
    fs.rmSync(targetPath, { recursive: true, force: true });
  }
}

function removeDsStoreRecursive(absDir) {
  if (!fileExists(absDir)) {
    return;
  }
  const entries = fs.readdirSync(absDir, { withFileTypes: true });
  for (const entry of entries) {
    const entryPath = path.join(absDir, entry.name);
    if (entry.isDirectory()) {
      removeDsStoreRecursive(entryPath);
    } else if (entry.isFile() && entry.name === '.DS_Store') {
      fs.unlinkSync(entryPath);
    }
  }
}

function pruneDistributionGithub(stageDir) {
  const stageGithubDir = path.join(stageDir, '.github');
  const stageSkillsDir = path.join(stageGithubDir, 'skills');
  const stageHooksDir = path.join(stageGithubDir, 'hooks');
  const stagePromptsDir = path.join(stageGithubDir, 'prompts');
  const allowedPromptNames = new Set([
    'initialize-ai-workspace.prompt.md',
    'reset-ai-workspace.prompt.md',
  ]);

  // Distribution should not include .github/skills.
  removePathIfExists(stageSkillsDir);
  // Distribution should not include .github/hooks.
  removePathIfExists(stageHooksDir);

  if (!fileExists(stagePromptsDir)) {
    return;
  }

  const promptEntries = fs.readdirSync(stagePromptsDir, { withFileTypes: true });
  for (const entry of promptEntries) {
    if (!allowedPromptNames.has(entry.name)) {
      removePathIfExists(path.join(stagePromptsDir, entry.name));
    }
  }

  // Remove macOS finder metadata from staged .github content.
  removeDsStoreRecursive(stageGithubDir);
}

// Reverse of sync's KNOWN_PACK_PREFIX_MAPPINGS — workspace target path → pack-relative path.
const TARGET_TO_PACK_PREFIXES = [
  { targetPrefix: '.github/prompts/', packPrefix: 'prompts/' },
  { targetPrefix: '.github/skills/', packPrefix: 'skills/' },
  { targetPrefix: '.github/hooks/', packPrefix: 'root/.github/hooks/' },
  { targetPrefix: 'docs/playbooks/', packPrefix: 'docs/playbooks/' },
  { targetPrefix: 'docs/architecture/', packPrefix: 'docs/architecture/' },
  { targetPrefix: 'docs/references/', packPrefix: 'docs/references/' },
  { targetPrefix: 'docs/standards/', packPrefix: 'docs/standards/' },
  { targetPrefix: 'templates/', packPrefix: 'templates/' },
  { targetPrefix: 'agents/', packPrefix: 'agents/' },
];

// Workspace directories that contain purely managed content (no user-generated outputs).
// Scanned for new files not yet tracked in the manifest.
const PACK_MANAGED_TARGET_DIRS = [
  '.github/prompts',
  '.github/skills',
  '.github/hooks',
  'docs/playbooks',
  'docs/architecture',
  'docs/references',
  'docs/standards',
  'templates',
  'agents',
];

function mapTargetToPackRelPath(targetPath) {
  if (targetPath === '.github/copilot-instructions.md') {
    return 'root/copilot-instructions.md';
  }
  for (const { targetPrefix, packPrefix } of TARGET_TO_PACK_PREFIXES) {
    if (targetPath.startsWith(targetPrefix)) {
      return packPrefix + targetPath.slice(targetPrefix.length);
    }
  }
  // Fallback: all other workspace paths map under root/ in the pack.
  return `root/${targetPath}`;
}

/**
 * Before sync runs, copy any workspace target changes back into their corresponding
 * pack source files so that sync (and the resulting zip) reflects the latest workspace state.
 *
 * Handles two cases:
 *   1. Updates to files already tracked as manifest targets with a sourcePath.
 *   2. New files appearing in pack-managed workspace directories that have no manifest entry yet.
 */
function writeBackWorkspaceToPacks(manifest) {
  const packBasePath = normalizePath(manifest.packPolicy?.packBasePath || '.github/initializer/packs');
  const absPackBase = path.join(workspaceRoot, packBasePath);
  const bootstrapPaths = new Set((manifest.resetPolicy?.bootstrapPromptPaths || []).map(normalizePath));
  let writtenCount = 0;
  const skippedDeletions = [];

  // Step 1: Write back changes to existing tracked pack targets.
  for (const target of manifest.targets || []) {
    if (!target.sourcePath || target.applyMode === 'bootstrap-protected') {
      continue;
    }
    const absTarget = path.join(workspaceRoot, target.targetPath);
    const absSource = path.join(workspaceRoot, target.sourcePath);
    if (!fileExists(absTarget)) {
      if (pruneDeleted && fileExists(absSource)) {
        fs.unlinkSync(absSource);
        console.log(`  [write-back] removed from pack: ${target.sourcePath}`);
        writtenCount++;
      } else if (!pruneDeleted && fileExists(absSource)) {
        skippedDeletions.push(target.targetPath);
      }
      continue;
    }
    const targetContent = fs.readFileSync(absTarget);
    if (!fileExists(absSource) || Buffer.compare(targetContent, fs.readFileSync(absSource)) !== 0) {
      fs.mkdirSync(path.dirname(absSource), { recursive: true });
      fs.writeFileSync(absSource, targetContent);
      console.log(`  [write-back] updated: ${target.sourcePath}`);
      writtenCount++;
    }
  }

  // Step 2: Copy new workspace files (not yet in the manifest) into the pack.
  const existingTargetPaths = new Set((manifest.targets || []).map((t) => normalizePath(t.targetPath)));
  for (const dir of PACK_MANAGED_TARGET_DIRS) {
    const absDir = path.join(workspaceRoot, dir);
    if (!fileExists(absDir)) {
      continue;
    }
    for (const absFile of collectFilesRecursive(absDir)) {
      const relTarget = normalizePath(path.relative(workspaceRoot, absFile));
      if (existingTargetPaths.has(relTarget) || bootstrapPaths.has(relTarget)) {
        continue;
      }
      const packRelPath = mapTargetToPackRelPath(relTarget);
      const absPackTarget = path.join(absPackBase, packRelPath);
      if (fileExists(absPackTarget)) {
        continue;
      }
      fs.mkdirSync(path.dirname(absPackTarget), { recursive: true });
      fs.copyFileSync(absFile, absPackTarget);
      console.log(`  [write-back] added to pack: ${packRelPath}`);
      writtenCount++;
    }
  }

  if (writtenCount > 0) {
    console.log(`Workspace write-back: ${writtenCount} file(s) synced to packs.`);
  } else {
    console.log('Workspace write-back: no workspace changes to sync to packs.');
  }

  if (skippedDeletions.length > 0) {
    console.log(`\nNote: ${skippedDeletions.length} target(s) no longer exist in the workspace but their pack sources were kept:`);
    for (const p of skippedDeletions) {
      console.log(`  - ${p}`);
    }
    console.log('  Re-run with --prune-deleted to remove them from the pack.');
  }
}

function finalizeDistribution() {
  if (!fileExists(syncScriptPath)) {
    throw new Error(`Sync script not found: ${syncScriptPath}`);
  }
  if (!fileExists(manifestPath)) {
    throw new Error(`Manifest not found: ${manifestPath}`);
  }
  if (!fileExists(ownerStatePath)) {
    throw new Error(`Owner state not found. Run sync first: ${ownerStatePath}`);
  }

  // Write back any workspace target changes into pack sources before sync runs,
  // so that sync sees the updated pack content and the zip captures the latest state.
  writeBackWorkspaceToPacks(readJson(manifestPath));

  const syncResult = spawnSync(process.execPath, [syncScriptPath], {
    cwd: workspaceRoot,
    stdio: 'inherit',
  });
  if (syncResult.status !== 0) {
    throw new Error('Sync failed; distribution finalization stopped.');
  }

  const manifest = readJson(manifestPath);
  const state = normalizeOwnerState(readJson(ownerStatePath), '0.0.0');

  if (!state.activeCycleOpen || !Array.isArray(state.pendingChangedPaths) || state.pendingChangedPaths.length === 0) {
    throw new Error('No active owner cycle with pending changes. Nothing to distribute.');
  }

  const previousVersion = state.lastDistributedVersion;
  const previousSemver = parseSemver(previousVersion) || { major: 0, minor: 0, patch: 0 };

  const managedPaths = getManagedSourcePaths(manifest);
  const hashes = computeManagedHashes(managedPaths);
  const fingerprint = computeFingerprint(hashes);
  const changeSet = diffManagedChanges(state.baselineFileHashes || {}, hashes);
  const releaseRequirement = classifyRequiredRelease(changeSet);

  const selectedReleaseType = cli.releaseType === 'auto'
    ? releaseRequirement.required
    : cli.releaseType;

  if (cli.releaseType !== 'auto' && !cli.noReleaseCheck && releaseRank(selectedReleaseType) < releaseRank(releaseRequirement.required)) {
    throw new Error(
      `Release type ${selectedReleaseType} is too low. Required at least ${releaseRequirement.required}. ${releaseRequirement.reason}`,
    );
  }

  // First distribution baseline starts at 1.0.0 regardless of release type.
  const version = previousVersion === '0.0.0'
    ? '1.0.0'
    : formatSemver(bumpSemver(previousSemver, selectedReleaseType));

  const dateIso = getCurrentDateLocalIso();
  const projectSlug = detectProjectSlug();
  const artifactName = `${projectSlug}-v${version}.zip`;

  console.log(`Release selection: requested=${cli.releaseType}, required=${releaseRequirement.required}, applied=${selectedReleaseType}${cli.noReleaseCheck ? ', check=disabled' : ''}`);

  const releaseNotesCurrent = fileExists(releaseNotesPath)
    ? fs.readFileSync(releaseNotesPath, 'utf8')
    : '# Initializer Release Notes\n\nPurpose: Track significant, user-facing updates to workspace initializer and reset prompts.\n';

  const updatedReleaseNotes = upsertReleaseNotes(releaseNotesCurrent, {
    dateIso,
    version,
    previousVersion,
    changedPaths: uniqueSorted(state.pendingChangedPaths),
    artifactName,
  });
  fs.writeFileSync(releaseNotesPath, updatedReleaseNotes, 'utf8');

  ensureDir(distributionsDir);
  const artifactPath = path.join(distributionsDir, artifactName);
  if (fileExists(artifactPath)) {
    fs.unlinkSync(artifactPath);
  }

  const stageDir = fs.mkdtempSync(path.join(os.tmpdir(), `${projectSlug}-dist-`));
  try {
    copyFileOrDir(path.join(workspaceRoot, '.github'), path.join(stageDir, '.github'));
    pruneDistributionGithub(stageDir);

    if (fileExists(path.join(workspaceRoot, 'workspace-ai-initialization-guide.md'))) {
      copyFileOrDir(
        path.join(workspaceRoot, 'workspace-ai-initialization-guide.md'),
        path.join(stageDir, 'workspace-ai-initialization-guide.md'),
      );
    }

    copyFileOrDir(path.join(workspaceRoot, 'initializer-release-notes.md'), path.join(stageDir, 'initializer-release-notes.md'));

    createZipArchive(artifactPath, stageDir);
  } finally {
    fs.rmSync(stageDir, { recursive: true, force: true });
  }

  state.lastDistributedVersion = version;
  state.lastDistributedAtUtc = utcNowIso();
  state.lastDistributedArtifact = normalizePath(path.relative(workspaceRoot, artifactPath));
  state.baselineFingerprint = fingerprint;
  state.baselineFileHashes = hashes;
  state.activeCycleOpen = false;
  state.activeWorkVersion = version;
  state.activeWorkStartedAtUtc = '';
  state.pendingChangedPaths = [];
  state.lastSyncFingerprint = fingerprint;
  state.lastSyncedAtUtc = utcNowIso();
  writeJson(ownerStatePath, state);

  console.log(`Distribution finalized: ${state.lastDistributedArtifact}`);
  console.log(`Version finalized: v${version}`);
}

finalizeDistribution();
