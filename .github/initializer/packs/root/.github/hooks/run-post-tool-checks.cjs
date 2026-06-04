#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const repoRoot = process.cwd();

function commandName(baseName) {
  if (process.platform === 'win32' && (baseName === 'npm' || baseName === 'npx')) {
    return `${baseName}.cmd`;
  }
  return baseName;
}

function runCommand(executable, args, description) {
  console.log(`hook: ${description}`);
  const result = spawnSync(commandName(executable), args, {
    cwd: repoRoot,
    encoding: 'utf8',
    shell: false
  });

  if (result.status === 0) {
    return { ok: true };
  }

  const output = `${result.stdout || ''}${result.stderr || ''}`;
  return {
    ok: false,
    output,
    exitCode: result.status === null ? 1 : result.status
  };
}

function fileExists(targetPath) {
  return fs.existsSync(path.join(repoRoot, targetPath));
}

function readPackageJson() {
  const packageJsonPath = path.join(repoRoot, 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    return undefined;
  }

  try {
    return JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  } catch {
    return undefined;
  }
}

function hasScript(packageJson, scriptName) {
  return Boolean(packageJson && packageJson.scripts && packageJson.scripts[scriptName]);
}

function hasPrettierDependency(packageJson) {
  if (!packageJson) {
    return false;
  }

  const groups = [
    packageJson.dependencies,
    packageJson.devDependencies,
    packageJson.optionalDependencies
  ];

  return groups.some((group) => Boolean(group && group.prettier));
}

function detectStack() {
  const detectScript = path.join(repoRoot, '.github', 'hooks', 'detect-stack.cjs');
  if (!fs.existsSync(detectScript)) {
    return 'unknown';
  }

  const result = spawnSync(commandName('node'), [detectScript], {
    cwd: repoRoot,
    encoding: 'utf8',
    shell: false
  });

  if (result.status !== 0) {
    return 'unknown';
  }

  const value = String(result.stdout || '').trim();
  return value || 'unknown';
}

function fail(result) {
  if (result.output) {
    process.stderr.write(result.output);
  }
  process.exit(result.exitCode || 1);
}

function runBackendChecks() {
  const verify = runCommand('dotnet', ['format', '--verify-no-changes'], 'backend lint (dotnet format verify)');
  if (!verify.ok) {
    fail(verify);
  }

  const build = runCommand('dotnet', ['build', '--no-incremental'], 'backend compile check (dotnet build)');
  if (!build.ok) {
    fail(build);
  }

  const format = runCommand('dotnet', ['format'], 'backend format (dotnet format)');
  if (!format.ok) {
    fail(format);
  }
}

function runFrontendChecks() {
  const packageJson = readPackageJson();

  if (hasScript(packageJson, 'lint')) {
    const lint = runCommand('npm', ['run', 'lint'], 'frontend lint (npm run lint)');
    if (!lint.ok) {
      fail(lint);
    }
  } else if (fileExists('package.json')) {
    console.log('hook: skipping frontend lint (no lint script found)');
  }

  if (hasScript(packageJson, 'build')) {
    const build = runCommand('npm', ['run', 'build'], 'frontend compile check (npm run build)');
    if (!build.ok) {
      fail(build);
    }
  } else if (fileExists('package.json')) {
    console.log('hook: skipping frontend build (no build script found)');
  }

  if (hasPrettierDependency(packageJson)) {
    const format = runCommand('npx', ['--no-install', 'prettier', '--write', '.'], 'frontend format (prettier --write .)');
    if (!format.ok) {
      fail(format);
    }
  } else {
    console.log('hook: skipping frontend format (no local prettier dependency found)');
  }
}

function main() {
  const stack = detectStack();
  console.log(`hook: detected stack -> ${stack}`);

  if (stack === 'backend') {
    runBackendChecks();
    return;
  }

  if (stack === 'frontend') {
    runFrontendChecks();
    return;
  }

  console.log(`hook: skipping post-tool checks for stack -> ${stack}`);
}

main();
