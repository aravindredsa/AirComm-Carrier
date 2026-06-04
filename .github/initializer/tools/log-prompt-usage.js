#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const workspaceRoot = process.cwd();
const usageLogPath = path.join(workspaceRoot, '.init_state/prompt-usage.jsonl');

function parseArgs(argv) {
  const args = {
    promptPath: '',
    strict: false,
  };

  for (const arg of argv) {
    if (arg === '--strict') {
      args.strict = true;
      continue;
    }

    if (arg.startsWith('--prompt-path=')) {
      args.promptPath = arg.slice('--prompt-path='.length).trim();
    }
  }

  return args;
}

function normalizePath(value) {
  return String(value || '').replace(/\\/g, '/').replace(/^\.\//, '');
}

function ensureParentDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function logUsage() {
  const args = parseArgs(process.argv.slice(2));
  const promptPath = normalizePath(args.promptPath);

  if (!promptPath) {
    throw new Error('Missing required argument: --prompt-path=<workspace-relative prompt path>');
  }

  const promptName = path.posix.basename(promptPath).replace(/\.prompt\.md$/i, '');
  const workspace = path.basename(workspaceRoot);

  const record = {
    timestampUtc: new Date().toISOString(),
    promptName,
    workspace,
  };

  ensureParentDir(usageLogPath);
  fs.appendFileSync(usageLogPath, `${JSON.stringify(record)}\n`, 'utf8');
  console.log(`Prompt usage logged: ${promptName}`);
}

try {
  logUsage();
} catch (error) {
  const args = parseArgs(process.argv.slice(2));
  const message = `Prompt usage logging warning: ${error.message || String(error)}`;
  console.warn(message);
  if (args.strict) {
    process.exitCode = 1;
  }
}