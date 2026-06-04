#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const workspaceRoot = process.cwd();
const syncScript = path.join(workspaceRoot, '.github/initializer/tools/sync-seed-manifest.js');

const watchTargets = [
  '.github/initializer/packs',
  '.github/prompts/initialize-ai-workspace.prompt.md',
  '.github/prompts/reset-ai-workspace.prompt.md',
  '.github/copilot-instructions.md',
  '.github/initializer/rules/normalization.json',
].map((p) => path.join(workspaceRoot, p));

let timer = null;
let running = false;
let rerunPending = false;

function runSync() {
  if (running) {
    rerunPending = true;
    return;
  }

  running = true;
  const result = spawnSync(process.execPath, [syncScript], {
    cwd: workspaceRoot,
    stdio: 'inherit',
  });

  running = false;
  if (result.status !== 0) {
    console.error(`[owner-loop] Sync failed with exit code ${result.status}`);
  }

  if (rerunPending) {
    rerunPending = false;
    runSync();
  }
}

function triggerDebouncedSync(reason) {
  if (timer) {
    clearTimeout(timer);
  }

  timer = setTimeout(() => {
    timer = null;
    console.log(`[owner-loop] Change detected: ${reason}. Syncing manifest metadata...`);
    runSync();
  }, 400);
}

function registerWatch(target) {
  if (!fs.existsSync(target)) {
    return;
  }

  fs.watch(target, { recursive: true }, (eventType, fileName) => {
    const label = fileName ? `${eventType}:${fileName}` : eventType;
    triggerDebouncedSync(label);
  });
}

console.log('[owner-loop] Starting initializer owner-loop watcher...');
runSync();
for (const target of watchTargets) {
  registerWatch(target);
}
console.log('[owner-loop] Watching pack and bootstrap inputs for automatic manifest updates.');
