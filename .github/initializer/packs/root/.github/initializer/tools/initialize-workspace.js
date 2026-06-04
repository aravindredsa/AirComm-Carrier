#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const workspaceRoot = process.cwd();

const canonicalPaths = {
  manifest: '.github/initializer/manifest/seed-manifest.json',
  schemaMarker: '.github/initializer/manifest/schema-version.json',
  policy: '.github/initializer/rules/policy.json',
  normalization: '.github/initializer/rules/normalization.json',
  migrationMode: '.github/initializer/migrations/migration-mode.json',
  stateTemplate: '.github/initializer/migrations/state-template.json',
};

const args = process.argv.slice(2);
const flags = parseArgs(args);

const legacyRenamedPromptTargets = [
  {
    oldPath: '.github/prompts/reverse-engineer-application.prompt.md',
    newPath: '.github/prompts/BA_reverse-engineer-application.prompt.md',
  },
  {
    oldPath: '.github/prompts/generate-functional-requirements.prompt.md',
    newPath: '.github/prompts/BA_generate-functional-requirements.prompt.md',
  },
  {
    oldPath: '.github/prompts/ui-analysis-prompt.md',
    newPath: '.github/prompts/BA_ui-analysis.prompt.md',
  },
  {
    oldPath: '.github/prompts/evaluate-reverse-engineer-document.prompt.md',
    newPath: '.github/prompts/BA_evaluate-reverse-engineer-document.prompt.md',
  },
  {
    oldPath: '.github/prompts/generate-user-stories.prompt.md',
    newPath: '.github/prompts/BA_generate-user-stories.prompt.md',
  },
  {
    oldPath: '.github/prompts/generate-gap-analysis.prompt.md',
    newPath: '.github/prompts/BA_generate-gap-analysis.prompt.md',
  },
  {
    oldPath: '.github/prompts/refine-user-story-backend.prompt.md',
    newPath: '.github/prompts/BA_refine-user-story-backend.prompt.md',
  },
  {
    oldPath: '.github/prompts/refine-user-story-frontend.prompt.md',
    newPath: '.github/prompts/BA_refine-user-story-frontend.prompt.md',
  },
  {
    oldPath: '.github/prompts/refine-user-story-qa.prompt.md',
    newPath: '.github/prompts/BA_refine-user-story-qa.prompt.md',
  },
];

function parseArgs(argv) {
  const parsed = {
    mode: undefined,
    strictRegression: false,
  };

  for (const arg of argv) {
    if (arg.startsWith('--mode=')) {
      parsed.mode = arg.slice('--mode='.length).trim();
      continue;
    }
    if (arg === '--strict-regression') {
      parsed.strictRegression = true;
      continue;
    }
  }

  return parsed;
}

function fail(message) {
  console.error(`Initialization failed: ${message}`);
  process.exit(1);
}

function normalizePath(inputPath) {
  return inputPath.replace(/\\/g, '/').replace(/^\.\//, '');
}

function toAbs(relPath) {
  return path.join(workspaceRoot, relPath);
}

function exists(filePath) {
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

function readJsonFile(relPath) {
  const absPath = toAbs(relPath);
  if (!exists(absPath)) {
    fail(`Required file missing: ${relPath}`);
  }
  try {
    return JSON.parse(fs.readFileSync(absPath, 'utf8'));
  } catch (error) {
    fail(`Invalid JSON at ${relPath}: ${error.message}`);
  }
}

function writeJsonAtomic(relPath, value) {
  const absPath = toAbs(relPath);
  ensureDir(path.dirname(absPath));
  const tempPath = `${absPath}.tmp`;
  fs.writeFileSync(tempPath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
  fs.renameSync(tempPath, absPath);
}

function sha256(content) {
  return crypto.createHash('sha256').update(content, 'utf8').digest('hex');
}

function readUtf8(absPath) {
  return fs.readFileSync(absPath, 'utf8');
}

function normalizeContent(content, normalizationRules) {
  let normalized = content;

  if (normalizationRules.pathRules?.trimWhitespace === true) {
    normalized = normalized.replace(/^\uFEFF/, '');
  }

  const lineEndingRule = normalizationRules.contentRules?.lineEndings;
  if (lineEndingRule === 'LF') {
    normalized = normalized.replace(/\r\n?/g, '\n');
  }

  const trimTrailingSpaces =
    normalizationRules.contentRules?.trimTrailingSpaces === true ||
    normalizationRules.contentRules?.trimTrailingWhitespace === true;
  if (trimTrailingSpaces) {
    normalized = normalized
      .split('\n')
      .map((line) => line.replace(/[ \t]+$/g, ''))
      .join('\n');
  }

  if (normalizationRules.contentRules?.trimFinalTrailingNewlineForCompare === true) {
    normalized = normalized.replace(/\n+$/g, '');
  }

  return normalized;
}

function readNormalized(absPath, normalizationRules) {
  return normalizeContent(readUtf8(absPath), normalizationRules);
}

function isFolderEmpty(relFolder) {
  const absFolder = toAbs(relFolder);
  if (!exists(absFolder)) {
    return true;
  }
  const entries = fs.readdirSync(absFolder);
  return entries.length === 0;
}

function isMeaningfulContent(text) {
  return text.trim().length > 0;
}

function collectWorkspaceFileHashes() {
  const hashes = {};

  function walk(absDir) {
    const entries = fs.readdirSync(absDir, { withFileTypes: true });
    for (const entry of entries) {
      const absEntry = path.join(absDir, entry.name);
      const relEntry = normalizePath(path.relative(workspaceRoot, absEntry));

      if (entry.isDirectory()) {
        if (relEntry === '.git' || relEntry.startsWith('.git/')) {
          continue;
        }
        walk(absEntry);
        continue;
      }

      if (!entry.isFile()) {
        continue;
      }

      if (entry.name === '.DS_Store') {
        continue;
      }

      const buffer = fs.readFileSync(absEntry);
      hashes[relEntry] = crypto.createHash('sha256').update(buffer).digest('hex');
    }
  }

  walk(workspaceRoot);
  return hashes;
}

function diffSnapshots(before, after) {
  const keys = new Set([...Object.keys(before), ...Object.keys(after)]);
  const added = [];
  const modified = [];
  const removed = [];

  for (const key of [...keys].sort((a, b) => a.localeCompare(b))) {
    if (!(key in before)) {
      added.push(key);
      continue;
    }
    if (!(key in after)) {
      removed.push(key);
      continue;
    }
    if (before[key] !== after[key]) {
      modified.push(key);
    }
  }

  return { added, modified, removed };
}

function removeIfExists(relPath) {
  const absPath = toAbs(relPath);
  if (!exists(absPath)) {
    return false;
  }
  fs.rmSync(absPath, { recursive: true, force: true });
  return true;
}

function cleanupRenamedPromptTargets(manifest) {
  const targets = (manifest.targets || []).map((item) => normalizePath(item.targetPath));
  const targetSet = new Set(targets);
  const removed = [];

  for (const mapping of legacyRenamedPromptTargets) {
    const oldPath = normalizePath(mapping.oldPath);
    const newPath = normalizePath(mapping.newPath);

    // Only clean up when the new canonical target is managed by this manifest.
    if (!targetSet.has(newPath)) {
      continue;
    }

    const oldAbs = toAbs(oldPath);
    const newAbs = toAbs(newPath);
    if (!exists(oldAbs) || !exists(newAbs)) {
      continue;
    }

    fs.rmSync(oldAbs, { force: true });
    removed.push(oldPath);
  }

  return removed;
}

function ensureCanonicalInputs() {
  for (const relPath of Object.values(canonicalPaths)) {
    if (!exists(toAbs(relPath))) {
      fail(`Required canonical input missing: ${relPath}`);
    }
  }
}

function main() {
  ensureCanonicalInputs();

  const manifest = readJsonFile(canonicalPaths.manifest);
  readJsonFile(canonicalPaths.schemaMarker);
  readJsonFile(canonicalPaths.policy);
  const normalizationRules = readJsonFile(canonicalPaths.normalization);
  const migrationModeRules = readJsonFile(canonicalPaths.migrationMode);
  const stateTemplate = readJsonFile(canonicalPaths.stateTemplate);

  const supportedModes =
    manifest.migrations?.supportedModes || migrationModeRules.supportedModes || ['auto', 'bootstrap', 'migrate'];
  const configuredDefaultMode =
    flags.mode || migrationModeRules.defaultMode || manifest.migrations?.defaultMode || 'auto';

  if (!supportedModes.includes(configuredDefaultMode)) {
    fail(`Unsupported mode: ${configuredDefaultMode}`);
  }

  const stateFile =
    manifest.migrations?.stateFile || migrationModeRules.stateFile || '.init_state/initializer-version.json';
  const stateAbsPath = toAbs(stateFile);

  let existingState = null;
  if (exists(stateAbsPath)) {
    try {
      existingState = JSON.parse(fs.readFileSync(stateAbsPath, 'utf8'));
    } catch {
      existingState = null;
    }
  }

  let effectiveMode = configuredDefaultMode;
  if (configuredDefaultMode === 'auto') {
    effectiveMode = existingState ? 'migrate' : 'bootstrap';
  }

  if (!supportedModes.includes(effectiveMode)) {
    fail(`Resolved mode is not supported: ${effectiveMode}`);
  }

  const summary = {
    mode: effectiveMode,
    manifestStatus: 'ok',
    packStatus: 'ok',
    foldersCreated: 0,
    targetsCreatedUpdated: 0,
    targetsSkippedUnchanged: 0,
    missingTargetsRepaired: 0,
    renamedLegacyPromptsRemoved: 0,
    filesSkipped: [],
    validationMismatches: 0,
    standardsSeedingStatus: 'pack-seeded',
    transientCleanupStatus: 'not-run',
    regressionReportStatus: flags.strictRegression ? 'pending' : 'not-run',
    regressionReportPath: '',
    unexpectedChanges: 0,
    stateWriteStatus: 'not-run',
    releaseNotesStatus: exists(toAbs('initializer-release-notes.md')) ? 'present' : 'missing',
    recommendations: [],
  };

  const reportOnlyPaths = new Set(
    (manifest.packagedArtifacts || [])
      .filter((item) => item.behavior === 'report-only')
      .map((item) => normalizePath(item.path)),
  );

  const targets = (manifest.targets || []).slice().sort((a, b) => a.targetPath.localeCompare(b.targetPath));
  const seededTargets = targets.filter((target) => target.applyMode !== 'bootstrap-protected');

  for (const target of seededTargets) {
    if (!target.sourcePath || !target.checksumSha256) {
      fail(`Seeded target missing sourcePath/checksumSha256: ${target.targetPath}`);
    }
    if (!exists(toAbs(target.sourcePath))) {
      fail(`Missing source file for target ${target.targetPath}: ${target.sourcePath}`);
    }
  }

  if (effectiveMode !== 'audit') {
    for (const relFolder of manifest.requiredFolders || []) {
      const absFolder = toAbs(relFolder);
      if (!exists(absFolder)) {
        ensureDir(absFolder);
        summary.foldersCreated += 1;
      }
    }
  }

  const sourceNormalizedCache = new Map();
  function getSourceNormalized(target) {
    if (sourceNormalizedCache.has(target.sourcePath)) {
      return sourceNormalizedCache.get(target.sourcePath);
    }
    const normalized = readNormalized(toAbs(target.sourcePath), normalizationRules);
    sourceNormalizedCache.set(target.sourcePath, normalized);
    return normalized;
  }

  const touchedTargets = new Map();
  const changedTargets = [];
  const unchangedTargets = [];
  const repairedMissingTargets = [];
  const verificationTargets = [];

  const currentState = existingState || JSON.parse(JSON.stringify(stateTemplate));
  if (!currentState.targetStates || typeof currentState.targetStates !== 'object') {
    currentState.targetStates = {};
  }

  let preSnapshot = null;
  if (flags.strictRegression && effectiveMode !== 'audit') {
    preSnapshot = collectWorkspaceFileHashes();
    writeJsonAtomic('.init_state/initializer-regression-pre.json', {
      snapshotType: 'pre',
      capturedAtUtc: new Date().toISOString(),
      files: preSnapshot,
    });
  }

  for (const target of targets) {
    const targetPath = normalizePath(target.targetPath);
    const targetAbs = toAbs(targetPath);

    if (reportOnlyPaths.has(targetPath)) {
      summary.filesSkipped.push({ path: targetPath, reason: 'report-only' });
      continue;
    }

    if (target.applyMode === 'bootstrap-protected') {
      summary.filesSkipped.push({ path: targetPath, reason: 'bootstrap-protected' });
      continue;
    }

    const sourceChanged =
      !currentState.targetStates[targetPath] ||
      currentState.targetStates[targetPath].sourceChecksumSha256 !== target.checksumSha256;

    const targetExists = exists(targetAbs);
    const repairRequired = !targetExists;

    let driftedLocal = false;
    if (effectiveMode === 'migrate' && target.applyMode === 'overwrite' && targetExists) {
      const targetNormalized = readNormalized(targetAbs, normalizationRules);
      driftedLocal = targetNormalized !== getSourceNormalized(target);
    }

    const needsActionInMigrate = sourceChanged || repairRequired || driftedLocal;

    if (effectiveMode === 'migrate' && !needsActionInMigrate) {
      unchangedTargets.push(targetPath);
      continue;
    }

    if (effectiveMode === 'audit') {
      if (effectiveMode === 'audit' && (sourceChanged || repairRequired || driftedLocal || configuredDefaultMode === 'bootstrap')) {
        changedTargets.push(targetPath);
      } else {
        unchangedTargets.push(targetPath);
      }
      continue;
    }

    if (target.applyMode === 'preserve-meaningful' && targetExists) {
      const existingContent = readUtf8(targetAbs);
      if (isMeaningfulContent(existingContent)) {
        summary.filesSkipped.push({ path: targetPath, reason: 'preserve-meaningful' });
        continue;
      }
    }

    if (target.applyMode === 'create-if-parent-empty') {
      const parentFolder = target.parentFolder || path.posix.dirname(targetPath);
      if (!isFolderEmpty(parentFolder)) {
        summary.filesSkipped.push({ path: targetPath, reason: 'parent-not-empty' });
        continue;
      }
    }

    ensureDir(path.dirname(targetAbs));
    fs.copyFileSync(toAbs(target.sourcePath), targetAbs);

    if (repairRequired) {
      repairedMissingTargets.push(targetPath);
      touchedTargets.set(targetPath, 'repaired');
    } else if (targetExists) {
      touchedTargets.set(targetPath, 'updated');
    } else {
      touchedTargets.set(targetPath, 'created');
    }

    changedTargets.push(targetPath);
    verificationTargets.push(target);
  }

  const mismatches = [];
  const verifiedTargetPaths = new Set();

  function verifyTarget(target) {
    const targetPath = normalizePath(target.targetPath);
    const targetAbs = toAbs(targetPath);
    const targetRaw = readUtf8(targetAbs);
    const targetNormalized = normalizeContent(targetRaw, normalizationRules);
    const sourceNormalized = getSourceNormalized(target);
    const checksumMatch = sha256(targetNormalized) === target.checksumSha256;
    const contentMatch = targetNormalized === sourceNormalized;
    return { targetPath, checksumMatch, contentMatch };
  }

  for (const target of verificationTargets) {
    const targetPath = normalizePath(target.targetPath);
    if (verifiedTargetPaths.has(targetPath)) {
      continue;
    }
    verifiedTargetPaths.add(targetPath);

    const result = verifyTarget(target);
    if (!result.checksumMatch || !result.contentMatch) {
      mismatches.push(target);
    }
  }

  if (mismatches.length > 0) {
    for (const target of mismatches) {
      fs.copyFileSync(toAbs(target.sourcePath), toAbs(target.targetPath));
    }

    const persistentMismatches = [];
    for (const target of mismatches) {
      const result = verifyTarget(target);
      if (!result.checksumMatch || !result.contentMatch) {
        persistentMismatches.push(result.targetPath);
      }
    }

    if (persistentMismatches.length > 0) {
      summary.validationMismatches = persistentMismatches.length;
      fail(`Verification failed for targets: ${persistentMismatches.join(', ')}`);
    }
  }

  summary.validationMismatches = 0;
  summary.targetsCreatedUpdated = changedTargets.length;
  summary.targetsSkippedUnchanged = unchangedTargets.length;
  summary.missingTargetsRepaired = repairedMissingTargets.length;

  if (effectiveMode !== 'audit') {
    const nowUtc = new Date().toISOString();
    const migratedWriteModes =
      migrationModeRules.writeStateInModes ||
      (manifest.migrationPolicy ? manifest.migrationPolicy.writeStateInModes : null) ||
      ['bootstrap', 'migrate', 'reseed'];

    if (migratedWriteModes.includes(effectiveMode)) {
      const stateOut = JSON.parse(JSON.stringify(currentState));
      stateOut.schemaVersion = manifest.migrations?.stateSchemaVersion || stateTemplate.schemaVersion || '2.0';
      stateOut.changedTargets = [...new Set(changedTargets)].sort((a, b) => a.localeCompare(b));
      stateOut.unchangedTargets = [...new Set(unchangedTargets)].sort((a, b) => a.localeCompare(b));
      stateOut.repairedMissingTargets = [...new Set(repairedMissingTargets)].sort((a, b) => a.localeCompare(b));

      for (const targetPath of stateOut.changedTargets) {
        const target = targets.find((item) => normalizePath(item.targetPath) === targetPath);
        if (!target || !target.sourcePath || !target.checksumSha256) {
          continue;
        }
        stateOut.targetStates[targetPath] = {
          sourcePath: target.sourcePath,
          sourceChecksumSha256: target.checksumSha256,
          applyMode: target.applyMode,
          lastAction: touchedTargets.get(targetPath) || 'updated',
          lastAppliedAtUtc: nowUtc,
          manifestVersion: manifest.manifestVersion,
          packVersion: manifest.packVersion,
        };
      }

      for (const targetPath of stateOut.unchangedTargets) {
        const target = targets.find((item) => normalizePath(item.targetPath) === targetPath);
        if (!target || !target.sourcePath || !target.checksumSha256) {
          continue;
        }
        stateOut.targetStates[targetPath] = {
          sourcePath: target.sourcePath,
          sourceChecksumSha256: target.checksumSha256,
          applyMode: target.applyMode,
          lastAction: 'verified-current',
          lastAppliedAtUtc: nowUtc,
          manifestVersion: manifest.manifestVersion,
          packVersion: manifest.packVersion,
        };
      }

      stateOut.manifestVersionApplied = manifest.manifestVersion;
      stateOut.packVersionApplied = manifest.packVersion;
      stateOut.appliedAtUtc = nowUtc;
      stateOut.runId = `init-${Date.now()}`;
      stateOut.mode = effectiveMode;
      stateOut.result = 'success';

      writeJsonAtomic(stateFile, stateOut);
      summary.stateWriteStatus = 'written';
    }
  }

  const removedLegacyPrompts =
    effectiveMode !== 'audit' ? cleanupRenamedPromptTargets(manifest) : [];
  summary.renamedLegacyPromptsRemoved = removedLegacyPrompts.length;

  if (flags.strictRegression && effectiveMode !== 'audit') {
    const postSnapshot = collectWorkspaceFileHashes();
    writeJsonAtomic('.init_state/initializer-regression-post.json', {
      snapshotType: 'post',
      capturedAtUtc: new Date().toISOString(),
      files: postSnapshot,
    });

    const regressionDiffVersion = `v${manifest.manifestVersion || 'unknown'}-p${manifest.packVersion || 'unknown'}`;
    const initStateDir = toAbs('.init_state');
    ensureDir(initStateDir);

    for (const name of fs.readdirSync(initStateDir)) {
      if (name.startsWith('initializer-regression-diff-') && name.endsWith('.json')) {
        fs.rmSync(path.join(initStateDir, name), { force: true });
      }
    }

    const diff = diffSnapshots(preSnapshot || {}, postSnapshot);
    const expectedChanged = new Set([
      ...changedTargets,
      ...removedLegacyPrompts,
      normalizePath(stateFile),
    ]);

    const unexpectedAdded = diff.added.filter((item) => !expectedChanged.has(item));
    const unexpectedModified = diff.modified.filter((item) => !expectedChanged.has(item));
    const unexpectedRemoved = diff.removed.filter((item) => !expectedChanged.has(item));

    const report = {
      generatedAtUtc: new Date().toISOString(),
      mode: effectiveMode,
      regressionDiffVersion,
      expectedChangedPaths: [...expectedChanged].sort((a, b) => a.localeCompare(b)),
      added: diff.added,
      modified: diff.modified,
      removed: diff.removed,
      unexpectedAdded,
      unexpectedModified,
      unexpectedRemoved,
      regressionPass: unexpectedAdded.length === 0 && unexpectedModified.length === 0 && unexpectedRemoved.length === 0,
    };

    const reportPath = `.init_state/initializer-regression-diff-${regressionDiffVersion}.json`;
    writeJsonAtomic(reportPath, report);
    summary.regressionReportStatus = report.regressionPass ? 'pass' : 'fail';
    summary.regressionReportPath = reportPath;
    summary.unexpectedChanges =
      report.unexpectedAdded.length + report.unexpectedModified.length + report.unexpectedRemoved.length;

    removeIfExists('.init_state/initializer-regression-pre.json');
  }

  const removedTransient = [];
  if (removeIfExists('.is.EOF')) {
    removedTransient.push('.is.EOF');
  }
  if (removeIfExists('.init_state/tmp')) {
    removedTransient.push('.init_state/tmp');
  }

  const knownTransientScripts = [
    'seed_workspace.py',
    'verify_workspace.py',
    'gen_regression.py',
    'gen_regression2.py',
  ];
  for (const fileName of knownTransientScripts) {
    if (removeIfExists(fileName)) {
      removedTransient.push(fileName);
    }
  }
  summary.transientCleanupStatus = removedTransient.length > 0 ? `removed (${removedTransient.length})` : 'nothing-to-remove';

  if (summary.regressionReportStatus === 'fail') {
    summary.recommendations.push('Review strict regression diff report before accepting this run.');
  }
  if (summary.filesSkipped.some((item) => item.reason === 'preserve-meaningful')) {
    summary.recommendations.push('Review preserved meaningful files if template updates are expected.');
  }

  printSummary(summary);
}

function printSummary(summary) {
  console.log('Workspace Initialization Complete');
  console.log(`Mode: ${summary.mode}`);
  console.log(`Manifest status: ${summary.manifestStatus}`);
  console.log(`Pack status: ${summary.packStatus}`);
  console.log(`Folders created: ${summary.foldersCreated}`);
  console.log(`Targets created/updated: ${summary.targetsCreatedUpdated}`);
  console.log(`Targets skipped unchanged: ${summary.targetsSkippedUnchanged}`);
  console.log(`Missing targets repaired: ${summary.missingTargetsRepaired}`);
  console.log(`Renamed legacy prompts removed: ${summary.renamedLegacyPromptsRemoved}`);
  console.log(`Validation mismatches: ${summary.validationMismatches}`);
  console.log(`Standards seeding status: ${summary.standardsSeedingStatus}`);
  console.log(`Transient cleanup status: ${summary.transientCleanupStatus}`);
  console.log(`Regression report status: ${summary.regressionReportStatus}`);
  if (summary.regressionReportPath) {
    console.log(`Regression report path: ${summary.regressionReportPath}`);
  }
  if (summary.regressionReportStatus !== 'not-run') {
    console.log(`Unexpected changes: ${summary.unexpectedChanges}`);
  }
  console.log(`State write status: ${summary.stateWriteStatus}`);
  console.log(`Release notes status: ${summary.releaseNotesStatus}`);

  if (summary.filesSkipped.length > 0) {
    console.log('Files skipped:');
    for (const item of summary.filesSkipped) {
      console.log(`- ${item.path} (${item.reason})`);
    }
  }

  if (summary.recommendations.length > 0) {
    console.log('Recommendations:');
    for (const recommendation of summary.recommendations) {
      console.log(`- ${recommendation}`);
    }
  }
}

main();
