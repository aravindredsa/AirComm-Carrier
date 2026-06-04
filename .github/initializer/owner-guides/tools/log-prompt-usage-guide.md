# log-prompt-usage.js Guide

## 1) Purpose

Script:
- `.github/initializer/tools/log-prompt-usage.js`

This script appends one usage event for a successfully completed prompt run.

It is the shared logging utility behind prompt adoption tracking.

## 2) Direct Callers

Called at the end of seeded prompt workflows.

Examples include:
- `audit-fullcodebase.prompt.md`
- `build-feature-from-plan.prompt.md`
- `BA_generate-gap-analysis.prompt.md`
- `report-prompt-adoption.prompt.md`

The expected convention is that every seeded non-bootstrap prompt logs usage after successful completion.

VS Code task status:
- No dedicated task for this script in `.vscode/tasks.json`.
- It is called from prompt workflows or direct CLI.

## 3) Core Responsibilities

The script:
- parses `--prompt-path=<workspace-relative-prompt-path>`
- derives prompt name from prompt file name
- derives workspace name from current workspace root
- lazily creates parent log directory
- appends one JSON line to `.init_state/prompt-usage.jsonl`

## 4) Log Record Model

Each record contains:
- `timestampUtc`
- `promptName`
- `workspace`

The log format is append-only JSON Lines.

## 5) Workspace Scope

The log file is local to the current workspace:
- `.init_state/prompt-usage.jsonl`

There is no cross-workspace aggregation in this design.

## 6) Relationship to Report Generation

Downstream dependency:
- `generate-prompt-adoption-report.js` reads the log produced by this script

If prompt instrumentation is missing or incorrect, adoption reports will undercount usage.

## 7) Strict Mode

Optional flag:
- `--strict`

Default behavior:
- logging failures warn but do not fail the parent workflow

Strict behavior:
- returns non-zero on error so callers can treat logging as blocking

## 8) Maintainer Risks

Be careful when changing:
- prompt-name derivation
- append format
- workspace scoping
- error-handling semantics

A change here affects every prompt that logs usage and every report derived from the log.

## 9) Validation Checklist

After editing:
1. Run `node --check .github/initializer/tools/log-prompt-usage.js`.
2. Execute it manually with a test prompt path.
3. Confirm one valid JSON line is appended.
4. Confirm report generation still reads the output successfully.
