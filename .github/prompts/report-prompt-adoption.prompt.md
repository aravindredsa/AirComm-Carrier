---
agent: 'agent'
description: Generate prompt adoption report for last 1, 2, 3, or 6 months using local usage logs with best-effort PDF export
version: 1.0.0
---

# Report Prompt Adoption

Generate prompt adoption metrics from local usage logs in this workspace.

## Input

Reporting window:

${input:window:Enter reporting window: 1m, 2m, 3m, or 6m}

## Steps

1. Validate the input window value (`1m`, `2m`, `3m`, or `6m`).
2. Run:

```bash
node .github/initializer/tools/generate-prompt-adoption-report.js --window=${input:window}
```

3. Return a concise summary with:
   - reporting window used
   - markdown report path
   - pdf report path if created
   - note when PDF generation is skipped or fails

## Rules

- Use `.init_state/prompt-usage.jsonl` as the usage source.
- Exclude bootstrap prompts from adoption metrics (`initialize-ai-workspace`, `reset-ai-workspace`).
- Output reports directly under `reports/evaluations`.
- PDF export is best-effort and must not block markdown report generation.

## Prompt Usage Logging (Required)

After successful completion of this workflow, run:

```bash
node .github/initializer/tools/log-prompt-usage.js --prompt-path=.github/prompts/report-prompt-adoption.prompt.md
```