# Onboard New Client Prompt Guide

## 1) Purpose

This guide explains the owner-only onboarding prompt at:
- `.github/initializer/owner-prompts/onboard-new-client.prompt.md`

The prompt is intended for enabler maintainers. It provides an interactive onboarding flow and then runs the onboarding script with safe execution choices.

For script-level behavior, file writes, and side effects, see:
- `../tools/onboard-new-client-guide.md`

## 2) Prompt Scope

In scope:
- collecting onboarding input through interactive questions
- supporting two input modes:
  - existing questionnaire file
  - interactive answer collection
- constructing and running onboarding command(s)
- reporting execution summary

Out of scope:
- script implementation details
- config mutation logic internals
- manifest architecture internals

## 3) Owner-Only Placement

Primary prompt path:
- `.github/initializer/owner-prompts/onboard-new-client.prompt.md`

This prompt is intentionally not placed under `.github/prompts/` to avoid downstream slash-command discovery.

## 4) How Owners Run It

In Copilot Chat, run:
- `run .github/initializer/owner-prompts/onboard-new-client.prompt.md`

Expected interaction:
- choose input mode first
- if interactive mode is selected, answer questions `[1/18]` through `[18/18]`
- review dry-run/apply choices
- execute onboarding script

## 5) Input Modes

### A. Existing Questionnaire File
The prompt asks for a file path and uses it directly with `--input`.

### B. Interactive Collection
The prompt asks each questionnaire item one-by-one and writes:
- `artifacts/onboarding/client-onboarding-response-<YYYYMMDD-HHMMSS>.md`

Then that generated file is used as script input.

## 6) Control-Type Strategy

Control types are chosen to match script parsing expectations:
- checkbox for list-like and multi-signal fields
- radio for single-choice preference fields
- textbox for freeform rules/terminology

For options with `Other`, the prompt asks follow-up text and appends details to the same answer.

## 7) Execution Pattern

Script entrypoint used by prompt:
- `node .github/initializer/tools/onboard-new-client.js --input <file> --sync-manifest`

Conditional flags:
- `--dry-run` when user selects dry-run
- `--client-id <id>` when user provides override

## 8) Prompt Outputs

The prompt returns a concise summary with:
- selected input mode
- questionnaire file path used
- command(s) executed
- resolved/used client id
- manifest sync status
- script success/failure summary

## 9) Dependencies

Primary runtime dependency:
- `.github/initializer/tools/onboard-new-client.js`

Related artifacts:
- `.github/initializer/client-inputs/client-onboarding-questionnaire.md`
- `.github/initializer/client-inputs/client-onboarding-response-template.md`

Usage logging:
- `node .github/initializer/tools/log-prompt-usage.js --prompt-path=.github/initializer/owner-prompts/onboard-new-client.prompt.md`

## 10) Maintenance Checklist

When editing this prompt workflow:
1. Keep owner-only path and invocation guidance intact.
2. Keep control types aligned with script parsing behavior.
3. Keep interactive and existing-file input modes both supported.
4. Mirror owner prompt changes to pack root owner prompt copy.
5. Sync manifest metadata:

```bash
node .github/initializer/tools/sync-seed-manifest.js
```

## 11) Related Guides

- `../tools/onboard-new-client-guide.md`
- `../standards/standards-resolution-user-guide.md`
