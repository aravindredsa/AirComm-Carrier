# generate-prompt-adoption-report.js Guide

## 1) Purpose

Script:
- `.github/initializer/tools/generate-prompt-adoption-report.js`

This script generates prompt adoption reports from local prompt-usage logs and attempts PDF export.

## 2) Direct Callers

Directly invoked by:
- `.github/prompts/report-prompt-adoption.prompt.md`

Indirect dependency:
- relies on `.github/initializer/tools/log-prompt-usage.js` because the report data comes from the usage log maintained by prompt executions

VS Code task status:
- No dedicated task for this script in `.vscode/tasks.json`.
- Run via prompt workflow or direct CLI.

## 3) Core Responsibilities

The script:
- validates reporting window (`1m`, `2m`, `3m`, `6m`)
- reads tracked prompt inventory from `.github/prompts/`
- excludes bootstrap prompts from metrics
- reads `.init_state/prompt-usage.jsonl`
- aggregates current-period, prior-period, and all-time usage
- writes markdown report to `reports/evaluations/`
- attempts PDF generation with dependency auto-install and engine fallbacks

## 4) Inputs and Outputs

Inputs:
- `.github/prompts/*.prompt.md`
- `.init_state/prompt-usage.jsonl`

Outputs:
- `reports/evaluations/prompt-adoption-<window>-<yyyy-mm-dd>.md`
- `reports/evaluations/prompt-adoption-<window>-<yyyy-mm-dd>.pdf` when PDF succeeds

## 5) Relationship to log-prompt-usage.js

This script does not create prompt usage data on its own.

It depends on the logging convention that seeded prompts call:
- `node .github/initializer/tools/log-prompt-usage.js --prompt-path=...`

Each workspace maintains its own independent `.init_state/prompt-usage.jsonl`, so reports are workspace-local.

## 6) PDF Dependency Model

Base converter:
- `pandoc`

Supported engines include:
- `wkhtmltopdf`
- `weasyprint`
- `tectonic`
- `pdflatex`
- `xelatex`
- `lualatex`

Platform behavior:
- macOS: attempts Homebrew install paths when dependencies are missing
- Windows: attempts winget, chocolatey, and pip fallback paths when dependencies are missing

Markdown generation remains non-blocking even if PDF fails.

## 7) Maintainer Risks

Be careful when changing:
- prompt inventory rules
- window/date boundary logic
- trend calculation semantics
- PDF dependency install behavior
- engine fallback order

Changes here affect the report prompt and any owner documentation describing prompt adoption metrics.

## 8) Validation Checklist

After editing:
1. Run `node --check .github/initializer/tools/generate-prompt-adoption-report.js`.
2. Run the report prompt or direct CLI command with a test window.
3. Confirm markdown output is always produced.
4. Confirm PDF behavior and status messages are still accurate.
