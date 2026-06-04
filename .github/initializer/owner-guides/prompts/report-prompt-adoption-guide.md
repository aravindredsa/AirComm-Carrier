# Report Prompt Adoption Guide

## 1) Purpose

The Report Prompt Adoption workflow measures downstream usage of seeded prompts and produces a time-windowed adoption report.

This guide is intended for new owners of this enabler. It explains:
- how to run the prompt
- how usage data is captured
- how the report is generated
- how PDF generation and dependency fallback works on macOS and Windows
- which files to maintain when the workflow evolves

## 2) Scope and Non-Goals

In scope:
- local workspace usage tracking via JSON Lines log
- report generation for windows: 1m, 2m, 3m, 6m
- markdown report output
- best-effort PDF output with dependency auto-install attempts

Out of scope:
- central telemetry across multiple workspaces
- user identity analytics
- guaranteed/tamper-proof audit trail

## 3) Primary Components

### Prompt Entrypoint
- `.github/prompts/report-prompt-adoption.prompt.md`
- Collects `window` input and calls the report generator script.
- Requires prompt usage logging after successful completion.

### Usage Logger
- `.github/initializer/tools/log-prompt-usage.js`
- Appends one JSONL record per successful prompt run into `.init_state/prompt-usage.jsonl`.
- Every seeded prompt workflow should invoke this logger at the end of successful execution.
- Logs are workspace-local: each workspace maintains its own independent `.init_state/prompt-usage.jsonl` file.
- Record fields:
  - `timestampUtc`
  - `promptName`
  - `workspace`

### Report Generator
- `.github/initializer/tools/generate-prompt-adoption-report.js`
- Validates reporting window.
- Enumerates tracked prompt inventory from `.github/prompts`.
- Excludes bootstrap prompts from metrics:
  - `initialize-ai-workspace`
  - `reset-ai-workspace`
- Aggregates usage by period and previous-period baseline.
- Writes markdown report and attempts PDF conversion.

### Mirrored Pack Copy (Distribution Source)
- `.github/initializer/packs/root/.github/initializer/tools/generate-prompt-adoption-report.js`
- Must stay aligned with the runtime copy above.

### Usage Data and Outputs
- Input log: `.init_state/prompt-usage.jsonl`
- Output directory: `reports/evaluations`
- Generated files:
  - `prompt-adoption-<window>-<yyyy-mm-dd>.md`
  - `prompt-adoption-<window>-<yyyy-mm-dd>.pdf` (if PDF succeeds)

## 4) Execution Paths

### A. Run via Prompt
Use the seeded prompt and provide one of:
- `1m`
- `2m`
- `3m`
- `6m`

The prompt runs:

```bash
node .github/initializer/tools/generate-prompt-adoption-report.js --window=<window>
```

### B. Run Directly via CLI

```bash
node .github/initializer/tools/generate-prompt-adoption-report.js --window=1m
```

### C. Log Prompt Usage (required by prompt design)

```bash
node .github/initializer/tools/log-prompt-usage.js --prompt-path=.github/prompts/report-prompt-adoption.prompt.md
```

For consistency across the enabler, all seeded prompts should include a matching end-of-workflow logging call with their own prompt path.

## 5) Aggregation Rules

### Window Validation
Allowed values: `1m`, `2m`, `3m`, `6m`.

### Date Boundaries
- Current range: `[rangeStart, rangeEnd)`
- Previous range: same duration immediately before `rangeStart`

### Stats Computed Per Prompt
- `periodRuns`
- `previousPeriodRuns`
- `totalRuns`
- `firstUsedOn`
- `lastUsedOn`

### Output Sections
- `Summary`
- `Prompt Breakdown`
- `Zero-Usage Prompts (Period)`

## 6) PDF Generation Model

PDF is best-effort by design. Markdown generation must not be blocked.

### Base Conversion Tool
- `pandoc`

### Engine Detection
A supported engine is considered available if any of these commands exist:
- `wkhtmltopdf`
- `weasyprint`
- `tectonic`
- `xelatex`
- `lualatex`
- `pdflatex`

### Engine Attempt Order During Conversion
1. pandoc default engine
2. wkhtmltopdf
3. weasyprint
4. tectonic
5. pdflatex
6. xelatex
7. lualatex

### Auto-Install Strategy: macOS
If dependencies are missing, the script attempts:
- `brew install pandoc` (if pandoc is missing)
- engine installs (until one succeeds):
  - `brew install weasyprint`
  - `brew install tectonic`
  - `brew install --cask basictex`
  - `brew install --cask wkhtmltopdf`

### Auto-Install Strategy: Windows
If dependencies are missing, the script attempts multiple paths:

Pandoc:
- `winget install --id JohnMacFarlane.Pandoc ...`
- `winget install --name Pandoc ...`
- `choco install pandoc -y`

Engines:
- `winget install --id wkhtmltopdf.wkhtmltopdf ...`
- `winget install --id Tectonic.Tectonic ...`
- `winget install --id MiKTeX.MiKTeX ...`
- `choco install wkhtmltopdf -y`
- `choco install tectonic -y`
- `choco install miktex -y`
- pip fallback for weasyprint:
  - `py -m pip install --upgrade weasyprint`
  - `python -m pip install --upgrade weasyprint`

### Behavior on Failure
- Markdown report is still generated.
- PDF may be skipped.
- Console output includes dependency/install status and fallback errors.

## 7) Report Interpretation Notes

### Prompt Breakdown vs Zero-Usage Section
- `Prompt Breakdown` is complete tabular data for all prompts.
- `Zero-Usage Prompts (Period)` is an explicit filtered list for fast action planning.

### Trends
Trend is computed against the previous equivalent period.
Examples:
- `0 (flat)`
- `+2 (new)`
- percentage delta when previous period was non-zero

## 8) Owner Maintenance Checklist

When modifying this workflow, update all relevant assets:

1. Runtime script:
- `.github/initializer/tools/generate-prompt-adoption-report.js`

2. Mirrored pack source:
- `.github/initializer/packs/root/.github/initializer/tools/generate-prompt-adoption-report.js`

3. Prompt entrypoint (if behavior changes):
- `.github/prompts/report-prompt-adoption.prompt.md`
- `.github/initializer/packs/prompts/report-prompt-adoption.prompt.md`

4. Sync manifest metadata:

```bash
node .github/initializer/tools/sync-seed-manifest.js
```

5. Validate script syntax:

```bash
node --check .github/initializer/tools/generate-prompt-adoption-report.js
node --check .github/initializer/packs/root/.github/initializer/tools/generate-prompt-adoption-report.js
```

## 9) Troubleshooting

### No PDF created
Check:
1. Is `pandoc` available?
2. Is at least one engine available?
3. Did package manager installs fail due to permissions, policy, or repository availability?

The console message from the generator includes exact attempted installs and first-line failures.

### Empty report data
Check:
1. Does `.init_state/prompt-usage.jsonl` exist?
2. Are records valid JSON lines?
3. Are timestamps within selected window?

### Unexpected zero usage
Check:
1. Prompt names in logs match current `.github/prompts/*.prompt.md` names.
2. Prompt instrumentation still calls `log-prompt-usage.js` after successful completion.

## 10) Recommended Location for This and Future Guides

Recommended location: `.github/initializer/owner-guides`
