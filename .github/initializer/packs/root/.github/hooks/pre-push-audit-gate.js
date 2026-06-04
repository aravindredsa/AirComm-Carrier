const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const repoRoot = process.cwd();
const configPath = path.join(repoRoot, '.github', 'hooks', 'pre-push-audit-gate.config.json');

const defaults = {
  reportsDir: 'reports/audits/full-codebase',
  maxAuditAgeHours: 24,
  reportPatterns: ['AuditReport_*.md', 'QAAuditReport_*.md']
};

function readConfig() {
  if (!fs.existsSync(configPath)) {
    return defaults;
  }

  const loaded = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  return {
    reportsDir: loaded.reportsDir || defaults.reportsDir,
    maxAuditAgeHours:
      Number.isFinite(loaded.maxAuditAgeHours) && loaded.maxAuditAgeHours > 0
        ? loaded.maxAuditAgeHours
        : defaults.maxAuditAgeHours,
    reportPatterns: Array.isArray(loaded.reportPatterns) && loaded.reportPatterns.length > 0
      ? loaded.reportPatterns
      : defaults.reportPatterns
  };
}

function toRegex(globPattern) {
  const escaped = globPattern
    .replace(/[.+^${}()|[\]\\]/g, '\\$&')
    .replace(/\*/g, '.*')
    .replace(/\?/g, '.');
  return new RegExp(`^${escaped}$`, 'i');
}

function findLatestAuditReport(config) {
  const reportDir = path.join(repoRoot, config.reportsDir);
  if (!fs.existsSync(reportDir)) {
    return undefined;
  }

  const patterns = config.reportPatterns.map(toRegex);
  const entries = fs
    .readdirSync(reportDir, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => name.toLowerCase().endsWith('.md'))
    .filter((name) => name.toLowerCase() !== 'readme.md')
    .filter((name) => patterns.some((pattern) => pattern.test(name)));

  if (entries.length === 0) {
    return undefined;
  }

  let latest = undefined;
  for (const name of entries) {
    const fullPath = path.join(reportDir, name);
    const stat = fs.statSync(fullPath);
    if (!latest || stat.mtimeMs > latest.modifiedTimeMs) {
      latest = {
        fullPath,
        relativePath: path.posix.join(config.reportsDir.replace(/\\/g, '/'), name),
        modifiedTimeMs: stat.mtimeMs
      };
    }
  }

  return latest;
}

function isStale(modifiedTimeMs, maxAgeHours) {
  const maxAgeMs = maxAgeHours * 60 * 60 * 1000;
  return Date.now() - modifiedTimeMs > maxAgeMs;
}

function extractKeyFindingsSection(markdown) {
  const lines = markdown.split(/\r?\n/);
  const startIndex = lines.findIndex((line) => /^##\s+Key Findings\s*$/i.test(line.trim()));
  if (startIndex < 0) {
    return '';
  }

  const sectionLines = [];
  for (let index = startIndex + 1; index < lines.length; index += 1) {
    const line = lines[index];
    if (/^##\s+/.test(line.trim())) {
      break;
    }
    sectionLines.push(line);
  }

  return sectionLines.join('\n');
}

function hasCriticalFindingsInReport(reportPath) {
  const content = fs.readFileSync(reportPath, 'utf8');
  const keyFindings = extractKeyFindingsSection(content);
  if (!keyFindings.trim()) {
    return false;
  }

  const rows = keyFindings
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith('|') && line.endsWith('|'))
    .filter((line) => !/^\|[-\s|]+\|$/.test(line));

  for (const row of rows) {
    const cells = row.slice(1, -1).split('|').map((cell) => cell.trim());
    if (cells.length < 2) {
      continue;
    }

    const severity = cells[1].toLowerCase();
    if (severity.includes('critical')) {
      return true;
    }
  }

  return false;
}

function runCommand(command, args) {
  const isWindowsNpm = process.platform === 'win32' && command === 'npm';
  const executable = isWindowsNpm ? 'npm.cmd' : command;
  return spawnSync(executable, args, {
    cwd: repoRoot,
    encoding: 'utf8',
    shell: false
  });
}

function findFirstFileWithSuffix(rootDir, suffixes, excludedDirs) {
  const queue = [rootDir];
  while (queue.length > 0) {
    const current = queue.shift();
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      const absolutePath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        if (excludedDirs.has(entry.name)) {
          continue;
        }
        queue.push(absolutePath);
        continue;
      }

      if (suffixes.some((suffix) => entry.name.endsWith(suffix))) {
        return absolutePath;
      }
    }
  }

  return undefined;
}

function scanNodeCriticalVulnerabilities() {
  const packageJsonPath = path.join(repoRoot, 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    return { executed: false, criticalCount: 0 };
  }

  const result = runCommand('npm', ['audit', '--json', '--audit-level=critical']);
  const rawOutput = `${result.stdout || ''}${result.stderr || ''}`;
  if (result.status !== 0 && !rawOutput.trim()) {
    return { executed: true, failedToRun: true, criticalCount: 0, output: rawOutput };
  }

  let parsed;
  try {
    parsed = JSON.parse(result.stdout || '{}');
  } catch {
    return { executed: true, failedToRun: true, criticalCount: 0, output: rawOutput };
  }

  const metadataCount =
    parsed && parsed.metadata && parsed.metadata.vulnerabilities
      ? Number(parsed.metadata.vulnerabilities.critical || 0)
      : 0;

  let advisoryCount = 0;
  if (parsed && parsed.vulnerabilities && typeof parsed.vulnerabilities === 'object') {
    advisoryCount = Object.values(parsed.vulnerabilities).filter((v) => {
      const severity = String(v && v.severity ? v.severity : '').toLowerCase();
      return severity === 'critical';
    }).length;
  }

  return {
    executed: true,
    criticalCount: Math.max(metadataCount, advisoryCount)
  };
}

function scanDotnetCriticalVulnerabilities() {
  const slnPath = path.join(repoRoot, `${path.basename(repoRoot)}.sln`);
  const target = fs.existsSync(slnPath)
    ? slnPath
    : findFirstFileWithSuffix(repoRoot, ['.sln', '.csproj'], new Set(['.git', 'node_modules', '.github', 'bin', 'obj']));

  if (!target) {
    return { executed: false, criticalCount: 0 };
  }

  const relativeTarget = path.relative(repoRoot, target) || path.basename(target);
  const result = runCommand('dotnet', ['list', relativeTarget, 'package', '--vulnerable', '--include-transitive', '--format', 'json']);
  if (result.status !== 0) {
    return {
      executed: true,
      failedToRun: true,
      criticalCount: 0,
      output: `${result.stdout || ''}${result.stderr || ''}`
    };
  }

  let parsed;
  try {
    parsed = JSON.parse(result.stdout || '{}');
  } catch {
    return {
      executed: true,
      failedToRun: true,
      criticalCount: 0,
      output: `${result.stdout || ''}${result.stderr || ''}`
    };
  }

  let criticalCount = 0;
  const projects = Array.isArray(parsed.projects) ? parsed.projects : [];
  for (const project of projects) {
    const frameworks = Array.isArray(project.frameworks) ? project.frameworks : [];
    for (const framework of frameworks) {
      const packageGroups = [framework.topLevelPackages, framework.transitivePackages];
      for (const group of packageGroups) {
        const packages = Array.isArray(group) ? group : [];
        for (const pkg of packages) {
          const vulnerabilities = Array.isArray(pkg.vulnerabilities) ? pkg.vulnerabilities : [];
          for (const vulnerability of vulnerabilities) {
            const severity = String(vulnerability.severity || '').toLowerCase();
            if (severity === 'critical') {
              criticalCount += 1;
            }
          }
        }
      }
    }
  }

  return {
    executed: true,
    criticalCount
  };
}

function fail(message) {
  console.error(`pre-push gate: ${message}`);
  process.exit(1);
}

function main() {
  const config = readConfig();
  const latestReport = findLatestAuditReport(config);

  if (!latestReport) {
    fail(
      `missing audit report in ${config.reportsDir}. Run /audit-fullcodebase and save a report before pushing.`
    );
  }

  if (isStale(latestReport.modifiedTimeMs, config.maxAuditAgeHours)) {
    fail(
      `latest audit report is stale (${latestReport.relativePath}). Regenerate /audit-fullcodebase before pushing.`
    );
  }

  if (hasCriticalFindingsInReport(latestReport.fullPath)) {
    fail(`critical findings detected in ${latestReport.relativePath}. Resolve before pushing.`);
  }

  const nodeScan = scanNodeCriticalVulnerabilities();
  if (nodeScan.failedToRun) {
    fail('npm audit scan failed to run. Resolve scanner/tooling issues before pushing.');
  }
  if (nodeScan.executed && nodeScan.criticalCount > 0) {
    fail(`npm audit reported ${nodeScan.criticalCount} Critical vulnerability finding(s).`);
  }

  const dotnetScan = scanDotnetCriticalVulnerabilities();
  if (dotnetScan.failedToRun) {
    fail('dotnet vulnerability scan failed to run. Resolve scanner/tooling issues before pushing.');
  }
  if (dotnetScan.executed && dotnetScan.criticalCount > 0) {
    fail(`dotnet vulnerability scan reported ${dotnetScan.criticalCount} Critical vulnerability finding(s).`);
  }

  console.log(`pre-push gate: pass (audit report: ${latestReport.relativePath})`);
}

main();