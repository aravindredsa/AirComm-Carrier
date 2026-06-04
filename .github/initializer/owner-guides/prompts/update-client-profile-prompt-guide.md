# Update Client Profile Prompt Guide

## 1) Purpose

This guide explains the owner-only update prompt at:
- `.github/initializer/owner-prompts/update-client-profile.prompt.md`

The prompt is intended for enabler maintainers who need to make incremental changes to an already-onboarded client.

For script-level merge behavior and write targets, see:
- `../tools/update-client-profile-guide.md`

## 2) Prompt Scope

In scope:
- selecting an existing client to update
- accepting either an existing questionnaire file or interactive answer collection
- building and running update command(s)
- reporting changed fields from script output

Out of scope:
- first-time client onboarding
- destructive single-client reset behavior
- deep implementation details of config rewrites

## 3) Owner-Only Placement

Primary prompt path:
- `.github/initializer/owner-prompts/update-client-profile.prompt.md`

This prompt is not under `.github/prompts/`, so it is not exposed as a downstream slash prompt.

## 4) How Owners Run It

In Copilot Chat, run:
- `run .github/initializer/owner-prompts/update-client-profile.prompt.md`

Expected interaction:
- provide target existing client id
- choose input mode
- optionally answer update questions interactively
- review dry-run/apply choices
- execute update script

## 5) Input Modes

### A. Existing Questionnaire File
The prompt asks for a file path and uses it directly with the update script.

### B. Interactive Collection
The prompt asks questionnaire-compatible update questions and writes:
- `artifacts/onboarding/client-update-response-<YYYYMMDD-HHMMSS>.md`

That generated file becomes the script input.

## 6) Update Behavior Model

The prompt is designed for partial changes:
- blank or omitted answers mean `no change`
- target client id is always explicit
- dry-run is the recommended first pass
- successful dry-run can be followed by apply execution

## 7) Execution Pattern

Script entrypoint used by prompt:
- `node .github/initializer/tools/update-client-profile.js --input <file> --client-id <id> --sync-manifest`

Conditional flag:
- `--dry-run`

## 8) Prompt Outputs

The prompt returns a concise summary with:
- target client id
- input mode used
- questionnaire file path used
- command(s) executed
- changed fields reported by script
- manifest sync status
- success/failure summary JSON

## 9) Dependencies

Primary runtime dependency:
- `.github/initializer/tools/update-client-profile.js`

Related owner workflow:
- `.github/initializer/owner-prompts/onboard-new-client.prompt.md`

Usage logging:
- `node .github/initializer/tools/log-prompt-usage.js --prompt-path=.github/initializer/owner-prompts/update-client-profile.prompt.md`

## 10) Maintenance Checklist

When editing this prompt workflow:
1. Keep owner-only path and explicit invocation guidance intact.
2. Keep dual input modes supported.
3. Preserve `no change` semantics for missing update answers.
4. Mirror prompt changes to pack root owner prompt copy.
5. Sync manifest metadata.

## 11) Related Guides

- `../tools/update-client-profile-guide.md`
- `../prompts/onboard-new-client-prompt-guide.md`
- `../tools/onboard-new-client-guide.md`
