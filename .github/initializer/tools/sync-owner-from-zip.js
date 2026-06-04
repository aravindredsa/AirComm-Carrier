#!/usr/bin/env node

const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const { spawnSync } = require('child_process');

const workspaceRoot = process.cwd();
const safeLauncherRelPath = '.github/initializer/tools/sync-owner-from-zip.js';
const safeLauncherAbsPath = path.join(workspaceRoot, safeLauncherRelPath);
const ownerStateRelPath = '.init_state/owner-distribution-state.json';
const ownerStateAbsPath = path.join(workspaceRoot, ownerStateRelPath);
const ownerBootstrapGuideRelPath = 'owner-sync-first-time-bootstrap-guide.md';
const ownerBootstrapGuideAbsPath = path.join(workspaceRoot, ownerBootstrapGuideRelPath);
const incomingDirRelPath = '.owner-sync-incoming';
const incomingDirAbsPath = path.join(workspaceRoot, incomingDirRelPath);

function normalizePath(inputPath) {
  return inputPath.replace(/\\/g, '/').replace(/^\.\//, '');
}

function fail(message) {
  console.error(`Owner sync failed: ${message}`);
  process.exit(1);
}

function ensureDir(absPath) {
  fs.mkdirSync(absPath, { recursive: true });
}

function exists(absPath) {
  try {
    fs.accessSync(absPath, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

function hashBuffer(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

function runCommand(command, args, cwd, label) {
  const result = spawnSync(command, args, {
    cwd,
    stdio: 'inherit',
  });

  if (result.status !== 0) {
    fail(`${label} failed with exit code ${result.status ?? 'unknown'}`);
  }
}

function unzipArchive(zipAbsPath, extractAbsPath) {
  // Prefer unzip to keep behavior consistent with current distribution tooling.
  runCommand('unzip', ['-q', zipAbsPath, '-d', extractAbsPath], workspaceRoot, 'Archive extraction');
}

function findLatestIncomingZipAbsPath() {
  if (!exists(incomingDirAbsPath)) {
    fail(`Incoming folder not found: ${incomingDirRelPath}`);
  }

  const candidates = fs.readdirSync(incomingDirAbsPath)
    .filter((entry) => entry.toLowerCase().endsWith('.zip'))
    .map((entry) => {
      const absPath = path.join(incomingDirAbsPath, entry);
      const stats = fs.statSync(absPath);
      return {
        absPath,
        mtimeMs: stats.mtimeMs,
      };
    })
    .sort((a, b) => b.mtimeMs - a.mtimeMs);

  if (candidates.length === 0) {
    fail(`No ZIP files found in ${incomingDirRelPath}`);
  }

  return candidates[0].absPath;
}

function parseZipArg(argv) {
  const args = argv.slice(2);
  if (args.length === 0) {
    return '';
  }

  const first = args[0].trim();
  if (!first) {
    fail('ZIP path argument is empty.');
  }

  if (first.startsWith('--zip=')) {
    return first.slice('--zip='.length).trim();
  }

  return first;
}

function writeFileAtomic(absPath, contentBuffer) {
  ensureDir(path.dirname(absPath));
  const tempPath = `${absPath}.tmp`;
  fs.writeFileSync(tempPath, contentBuffer);
  fs.renameSync(tempPath, absPath);
}

function main() {
  const zipArg = parseZipArg(process.argv);
  const zipAbsPath = zipArg
    ? path.resolve(workspaceRoot, zipArg)
    : findLatestIncomingZipAbsPath();

  if (!exists(zipAbsPath)) {
    fail(`ZIP file not found: ${normalizePath(path.relative(workspaceRoot, zipAbsPath))}`);
  }

  if (!zipAbsPath.toLowerCase().endsWith('.zip')) {
    fail('Input must be a .zip distribution artifact.');
  }

  if (!exists(safeLauncherAbsPath)) {
    fail(`Safe launcher missing at ${safeLauncherRelPath}`);
  }

  const safeLauncherBuffer = fs.readFileSync(safeLauncherAbsPath);
  const safeLauncherHashBefore = hashBuffer(safeLauncherBuffer);

  const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'owner-sync-'));

  try {
    unzipArchive(zipAbsPath, tmpRoot);

    const extractedInitializerAbsPath = path.join(tmpRoot, '.github', 'initializer');
    const currentInitializerAbsPath = path.join(workspaceRoot, '.github', 'initializer');

    if (!exists(extractedInitializerAbsPath)) {
      fail('Incoming ZIP is missing .github/initializer.');
    }

    if (exists(currentInitializerAbsPath)) {
      fs.rmSync(currentInitializerAbsPath, { recursive: true, force: true });
    }

    ensureDir(path.dirname(currentInitializerAbsPath));
    fs.cpSync(extractedInitializerAbsPath, currentInitializerAbsPath, { recursive: true });

    // Safe-file contract: restore launcher from pre-sync bytes so this run never self-upgrades.
    writeFileAtomic(safeLauncherAbsPath, safeLauncherBuffer);

    const extractedOwnerStateAbsPath = path.join(tmpRoot, ownerStateRelPath);
    if (!exists(extractedOwnerStateAbsPath)) {
      fail(`Incoming ZIP is missing ${ownerStateRelPath}; cannot enforce global distribution version consistency.`);
    }

    ensureDir(path.dirname(ownerStateAbsPath));
    fs.copyFileSync(extractedOwnerStateAbsPath, ownerStateAbsPath);

    const extractedOwnerBootstrapGuideAbsPath = path.join(tmpRoot, ownerBootstrapGuideRelPath);
    if (exists(extractedOwnerBootstrapGuideAbsPath)) {
      ensureDir(path.dirname(ownerBootstrapGuideAbsPath));
      fs.copyFileSync(extractedOwnerBootstrapGuideAbsPath, ownerBootstrapGuideAbsPath);
    }

    const safeLauncherHashAfter = hashBuffer(fs.readFileSync(safeLauncherAbsPath));
    const launcherUpdatedFromZip = safeLauncherHashAfter !== safeLauncherHashBefore;

    runCommand('node', ['.github/initializer/tools/initialize-workspace.js', '--mode=migrate'], workspaceRoot, 'Initialize migrate');
    runCommand('node', ['.github/initializer/tools/sync-seed-manifest.js'], workspaceRoot, 'Manifest sync');

    console.log('Owner sync completed successfully.');
    console.log(`Applied initializer from: ${normalizePath(path.relative(workspaceRoot, zipAbsPath))}`);
    console.log(`Safe launcher protected: ${safeLauncherRelPath}`);
    console.log(`Launcher update from ZIP deferred: ${launcherUpdatedFromZip ? 'yes' : 'no'}`);
  } finally {
    fs.rmSync(tmpRoot, { recursive: true, force: true });
  }
}

main();
