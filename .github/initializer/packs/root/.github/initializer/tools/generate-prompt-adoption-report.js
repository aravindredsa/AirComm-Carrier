#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const workspaceRoot = process.cwd();
const promptsDir = path.join(workspaceRoot, '.github/prompts');
const usageLogPath = path.join(workspaceRoot, '.init_state/prompt-usage.jsonl');
const reportsDir = path.join(workspaceRoot, 'reports/evaluations');
const bootstrapPromptNames = new Set(['initialize-ai-workspace', 'reset-ai-workspace']);

function parseArgs(argv) {
  const args = {
    window: '1m',
  };

  for (const arg of argv) {
    if (arg.startsWith('--window=')) {
      args.window = arg.slice('--window='.length).trim().toLowerCase();
    }
  }

  return args;
}

function parseWindowMonths(value) {
  const match = String(value || '').match(/^([1-9]\d*)m$/i);
  if (!match) {
    throw new Error('Invalid --window value. Supported format: 1m, 2m, 3m, 6m.');
  }

  const months = Number.parseInt(match[1], 10);
  if (![1, 2, 3, 6].includes(months)) {
    throw new Error('Invalid --window value. Supported values: 1m, 2m, 3m, 6m.');
  }

  return months;
}

function formatDate(value) {
  return value.toISOString().slice(0, 10);
}

function formatReadableDateTime(value) {
  const yyyy = value.getUTCFullYear();
  const mm = String(value.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(value.getUTCDate()).padStart(2, '0');
  const hh = String(value.getUTCHours()).padStart(2, '0');
  const mi = String(value.getUTCMinutes()).padStart(2, '0');
  const ss = String(value.getUTCSeconds()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss} UTC`;
}

function toIsoDate(value) {
  if (!value) {
    return '-';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '-';
  }

  return formatDate(date);
}

function startOfUtcDay(date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0, 0));
}

function shiftMonthsUtc(date, monthsDelta) {
  return new Date(Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth() + monthsDelta,
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds(),
    date.getUTCMilliseconds(),
  ));
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function listTrackedPromptNames() {
  if (!fs.existsSync(promptsDir)) {
    return [];
  }

  const names = [];
  for (const entry of fs.readdirSync(promptsDir, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith('.prompt.md')) {
      continue;
    }

    const promptName = entry.name.replace(/\.prompt\.md$/i, '');
    if (bootstrapPromptNames.has(promptName)) {
      continue;
    }

    names.push(promptName);
  }

  return names.sort((a, b) => a.localeCompare(b));
}

function readUsageRecords() {
  if (!fs.existsSync(usageLogPath)) {
    return { records: [], malformedLines: 0 };
  }

  const text = fs.readFileSync(usageLogPath, 'utf8');
  const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);
  const records = [];
  let malformedLines = 0;

  for (const line of lines) {
    try {
      const parsed = JSON.parse(line);
      if (!parsed || typeof parsed !== 'object') {
        malformedLines += 1;
        continue;
      }

      const promptName = String(parsed.promptName || '').trim();
      const timestampUtc = String(parsed.timestampUtc || '').trim();
      if (!promptName || !timestampUtc) {
        malformedLines += 1;
        continue;
      }

      const date = new Date(timestampUtc);
      if (Number.isNaN(date.getTime())) {
        malformedLines += 1;
        continue;
      }

      records.push({
        promptName,
        timestampUtc,
        date,
      });
    } catch {
      malformedLines += 1;
    }
  }

  return { records, malformedLines };
}

function aggregatePromptStats(promptNames, records, rangeStart, rangeEnd, prevStart, prevEnd) {
  const statsByPrompt = new Map();

  for (const promptName of promptNames) {
    statsByPrompt.set(promptName, {
      promptName,
      totalRuns: 0,
      periodRuns: 0,
      previousPeriodRuns: 0,
      firstUsedOn: '',
      lastUsedOn: '',
    });
  }

  for (const record of records) {
    if (!statsByPrompt.has(record.promptName)) {
      continue;
    }

    const stats = statsByPrompt.get(record.promptName);
    stats.totalRuns += 1;

    if (!stats.firstUsedOn || record.timestampUtc < stats.firstUsedOn) {
      stats.firstUsedOn = record.timestampUtc;
    }

    if (!stats.lastUsedOn || record.timestampUtc > stats.lastUsedOn) {
      stats.lastUsedOn = record.timestampUtc;
    }

    if (record.date >= rangeStart && record.date < rangeEnd) {
      stats.periodRuns += 1;
    }

    if (record.date >= prevStart && record.date < prevEnd) {
      stats.previousPeriodRuns += 1;
    }
  }

  return [...statsByPrompt.values()].sort((a, b) => {
    if (b.periodRuns !== a.periodRuns) {
      return b.periodRuns - a.periodRuns;
    }
    return a.promptName.localeCompare(b.promptName);
  });
}

function computeTrend(currentRuns, previousRuns) {
  if (previousRuns === 0 && currentRuns === 0) {
    return '0 (flat)';
  }
  if (previousRuns === 0 && currentRuns > 0) {
    return `+${currentRuns} (new)`;
  }

  const delta = currentRuns - previousRuns;
  const deltaPrefix = delta > 0 ? '+' : '';
  const pct = ((delta / previousRuns) * 100).toFixed(1);
  const pctPrefix = Number(pct) > 0 ? '+' : '';
  return `${deltaPrefix}${delta} (${pctPrefix}${pct}%)`;
}

function commandExists(command) {
  const result = process.platform === 'win32'
    ? spawnSync('where', [command], {
      shell: true,
      stdio: 'ignore',
    })
    : spawnSync('command', ['-v', command], {
      shell: true,
      stdio: 'ignore',
    });
  return result.status === 0;
}

function hasSupportedPdfEngine() {
  const engineCommands = ['wkhtmltopdf', 'weasyprint', 'tectonic', 'xelatex', 'lualatex', 'pdflatex'];
  return engineCommands.some((command) => commandExists(command));
}

function runInstallCommand(command, args) {
  return spawnSync(command, args, {
    cwd: workspaceRoot,
    stdio: 'pipe',
    encoding: 'utf8',
  });
}

function summarizeInstallError(result) {
  const raw = (result.stderr || result.stdout || '').trim();
  return raw.split(/\r?\n/).find((line) => line.trim().length > 0) || 'unknown install error';
}

function runInstallAttempts(attempts, isSatisfied, installLogs) {
  for (const attempt of attempts) {
    if (isSatisfied()) {
      break;
    }

    const result = runInstallCommand(attempt.cmd, attempt.args);
    if (result.status !== 0) {
      installLogs.push(`${attempt.label} failed: ${summarizeInstallError(result)}`);
    }
  }
}

function maybeInstallPdfToolchain() {
  const missingPandoc = !commandExists('pandoc');
  const missingEngine = !hasSupportedPdfEngine();

  if (!missingPandoc && !missingEngine) {
    return {
      attempted: false,
      message: 'PDF dependencies already available.',
    };
  }

  const installLogs = [];

  if (process.platform === 'darwin') {
    if (!commandExists('brew')) {
      return {
        attempted: true,
        message: 'Unable to auto-install PDF dependencies (Homebrew is not available).',
      };
    }

    if (missingPandoc) {
      const pandocResult = runInstallCommand('brew', ['install', 'pandoc']);
      if (pandocResult.status !== 0) {
        installLogs.push(`brew install pandoc failed: ${summarizeInstallError(pandocResult)}`);
      }
    }

    if (missingEngine && !hasSupportedPdfEngine()) {
      runInstallAttempts([
        { cmd: 'brew', args: ['install', 'weasyprint'], label: 'brew install weasyprint' },
        { cmd: 'brew', args: ['install', 'tectonic'], label: 'brew install tectonic' },
        { cmd: 'brew', args: ['install', '--cask', 'basictex'], label: 'brew install --cask basictex' },
        { cmd: 'brew', args: ['install', '--cask', 'wkhtmltopdf'], label: 'brew install --cask wkhtmltopdf' },
      ], hasSupportedPdfEngine, installLogs);
    }
  } else if (process.platform === 'win32') {
    const canUseWinget = commandExists('winget');
    const canUseChoco = commandExists('choco');

    if (!canUseWinget && !canUseChoco) {
      return {
        attempted: true,
        message: 'Unable to auto-install PDF dependencies (winget/choco not available).',
      };
    }

    if (canUseWinget && missingPandoc && !commandExists('pandoc')) {
      runInstallAttempts([
        {
          cmd: 'winget',
          args: [
            'install',
            '--id',
            'JohnMacFarlane.Pandoc',
            '--silent',
            '--accept-package-agreements',
            '--accept-source-agreements',
          ],
          label: 'winget install JohnMacFarlane.Pandoc',
        },
        {
          cmd: 'winget',
          args: [
            'install',
            '--name',
            'Pandoc',
            '--silent',
            '--accept-package-agreements',
            '--accept-source-agreements',
          ],
          label: 'winget install --name Pandoc',
        },
      ], () => commandExists('pandoc'), installLogs);
    }

    if (canUseWinget && missingEngine && !hasSupportedPdfEngine()) {
      runInstallAttempts([
        {
          cmd: 'winget',
          args: [
            'install',
            '--id',
            'wkhtmltopdf.wkhtmltopdf',
            '--silent',
            '--accept-package-agreements',
            '--accept-source-agreements',
          ],
          label: 'winget install wkhtmltopdf.wkhtmltopdf',
        },
        {
          cmd: 'winget',
          args: [
            'install',
            '--id',
            'Tectonic.Tectonic',
            '--silent',
            '--accept-package-agreements',
            '--accept-source-agreements',
          ],
          label: 'winget install Tectonic.Tectonic',
        },
        {
          cmd: 'winget',
          args: [
            'install',
            '--id',
            'MiKTeX.MiKTeX',
            '--silent',
            '--accept-package-agreements',
            '--accept-source-agreements',
          ],
          label: 'winget install MiKTeX.MiKTeX',
        },
      ], hasSupportedPdfEngine, installLogs);
    }

    if (canUseChoco && !commandExists('pandoc')) {
      runInstallAttempts([
        { cmd: 'choco', args: ['install', 'pandoc', '-y'], label: 'choco install pandoc -y' },
      ], () => commandExists('pandoc'), installLogs);
    }

    if (canUseChoco && !hasSupportedPdfEngine()) {
      runInstallAttempts([
        { cmd: 'choco', args: ['install', 'wkhtmltopdf', '-y'], label: 'choco install wkhtmltopdf -y' },
        { cmd: 'choco', args: ['install', 'tectonic', '-y'], label: 'choco install tectonic -y' },
        { cmd: 'choco', args: ['install', 'miktex', '-y'], label: 'choco install miktex -y' },
      ], hasSupportedPdfEngine, installLogs);
    }

    if (!hasSupportedPdfEngine() && commandExists('py')) {
      runInstallAttempts([
        {
          cmd: 'py',
          args: ['-m', 'pip', 'install', '--upgrade', 'weasyprint'],
          label: 'py -m pip install --upgrade weasyprint',
        },
      ], hasSupportedPdfEngine, installLogs);
    }

    if (!hasSupportedPdfEngine() && commandExists('python')) {
      runInstallAttempts([
        {
          cmd: 'python',
          args: ['-m', 'pip', 'install', '--upgrade', 'weasyprint'],
          label: 'python -m pip install --upgrade weasyprint',
        },
      ], hasSupportedPdfEngine, installLogs);
    }
  } else {
    return {
      attempted: true,
      message: `Unable to auto-install PDF dependencies on this platform (${process.platform}).`,
    };
  }

  const hasPandoc = commandExists('pandoc');
  const hasEngine = hasSupportedPdfEngine();
  const status = hasPandoc && hasEngine ? 'completed' : 'incomplete';
  const details = installLogs.length > 0 ? ` Issues: ${installLogs.join(' | ')}` : '';
  return {
    attempted: true,
    message: `PDF dependency installation ${status}. Pandoc=${hasPandoc ? 'yes' : 'no'}, engine=${hasEngine ? 'yes' : 'no'}.${details}`,
  };
}

function runPandoc(markdownPath, pdfPath, engine) {
  const args = [markdownPath, '-o', pdfPath];
  if (engine) {
    args.push(`--pdf-engine=${engine}`);
  }

  return spawnSync('pandoc', args, {
    cwd: workspaceRoot,
    stdio: 'pipe',
    encoding: 'utf8',
  });
}

function maybeCreatePdf(markdownPath, pdfPath) {
  const installStatus = maybeInstallPdfToolchain();

  if (!commandExists('pandoc')) {
    return {
      attempted: false,
      created: false,
      message: `${installStatus.message} Skipped PDF generation (pandoc not available).`,
    };
  }

  const attempts = [
    { label: 'pandoc-default', engine: '' },
    { label: 'wkhtmltopdf', engine: 'wkhtmltopdf' },
    { label: 'weasyprint', engine: 'weasyprint' },
    { label: 'tectonic', engine: 'tectonic' },
    { label: 'pdflatex', engine: 'pdflatex' },
    { label: 'xelatex', engine: 'xelatex' },
    { label: 'lualatex', engine: 'lualatex' },
  ];

  const errors = [];
  for (const attempt of attempts) {
    const result = runPandoc(markdownPath, pdfPath, attempt.engine);
    if (result.status === 0) {
      return {
        attempted: true,
        created: true,
        message: `${installStatus.message} PDF generated successfully using ${attempt.label}.`,
      };
    }

    const raw = (result.stderr || result.stdout || '').trim();
    const firstLine = raw.split(/\r?\n/).find((line) => line.trim().length > 0) || 'unknown pandoc error';
    errors.push(`${attempt.label}: ${firstLine}`);
  }

  return {
    attempted: true,
    created: false,
    message: `${installStatus.message} PDF generation failed after fallback attempts. ${errors.join(' | ')}`,
  };
}

function generateReport() {
  const args = parseArgs(process.argv.slice(2));
  const months = parseWindowMonths(args.window);

  const now = new Date();
  const rangeEnd = now;
  const rangeStart = shiftMonthsUtc(startOfUtcDay(now), -months);
  const prevEnd = rangeStart;
  const prevStart = shiftMonthsUtc(rangeStart, -months);

  const promptNames = listTrackedPromptNames();
  const { records, malformedLines } = readUsageRecords();
  const stats = aggregatePromptStats(promptNames, records, rangeStart, rangeEnd, prevStart, prevEnd);

  const totalPeriodRuns = stats.reduce((sum, item) => sum + item.periodRuns, 0);
  const totalAllTimeRuns = stats.reduce((sum, item) => sum + item.totalRuns, 0);
  const activePrompts = stats.filter((item) => item.periodRuns > 0).length;
  const zeroUsagePrompts = stats.filter((item) => item.periodRuns === 0).map((item) => item.promptName);

  const reportDate = formatDate(now);
  const reportBaseName = `prompt-adoption-${args.window}-${reportDate}`;
  const markdownPath = path.join(reportsDir, `${reportBaseName}.md`);
  const pdfPath = path.join(reportsDir, `${reportBaseName}.pdf`);

  const lines = [];
  lines.push('# Prompt Adoption Report');
  lines.push('');
  lines.push(`- Generated on: ${formatReadableDateTime(now)}`);
  lines.push(`- Reporting window: last ${months} month(s)`);
  lines.push(`- Range start: ${formatReadableDateTime(rangeStart)}`);
  lines.push(`- Range end: ${formatReadableDateTime(rangeEnd)}`);
  lines.push(`- Previous range (trend comparison baseline): ${formatReadableDateTime(prevStart)} to ${formatReadableDateTime(prevEnd)}`);
  lines.push('');
  lines.push('## Summary');
  lines.push('');
  lines.push(`- Prompts tracked: ${promptNames.length}`);
  lines.push(`- Active prompts in period: ${activePrompts}`);
  lines.push(`- Total runs in period: ${totalPeriodRuns}`);
  lines.push(`- Total runs all time: ${totalAllTimeRuns}`);
  lines.push(`- Malformed log lines skipped: ${malformedLines}`);
  lines.push('');
  lines.push('## Prompt Breakdown');
  lines.push('');
  lines.push('| Prompt | Runs (period) | Trend vs previous | Total runs | First used on | Last used on |');
  lines.push('|---|---:|---:|---:|---|---|');
  for (const item of stats) {
    lines.push(`| ${item.promptName} | ${item.periodRuns} | ${computeTrend(item.periodRuns, item.previousPeriodRuns)} | ${item.totalRuns} | ${toIsoDate(item.firstUsedOn)} | ${toIsoDate(item.lastUsedOn)} |`);
  }

  lines.push('');
  lines.push('## Zero-Usage Prompts (Period)');
  lines.push('');
  if (zeroUsagePrompts.length === 0) {
    lines.push('- None');
  } else {
    for (const promptName of zeroUsagePrompts) {
      lines.push(`- ${promptName}`);
    }
  }

  ensureDir(reportsDir);
  fs.writeFileSync(markdownPath, `${lines.join('\n')}\n`, 'utf8');

  const pdfStatus = maybeCreatePdf(markdownPath, pdfPath);

  console.log('Prompt adoption report generated.');
  console.log(`Markdown: ${path.relative(workspaceRoot, markdownPath)}`);
  if (pdfStatus.created) {
    console.log(`PDF: ${path.relative(workspaceRoot, pdfPath)}`);
  }
  console.log(pdfStatus.message);
}

try {
  generateReport();
} catch (error) {
  console.error(`Failed to generate prompt adoption report: ${error.message || String(error)}`);
  process.exitCode = 1;
}