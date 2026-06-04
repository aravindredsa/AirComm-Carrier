# update-client-profile.js Guide

## Purpose

`update-client-profile.js` applies incremental changes to an existing client profile after onboarding.

Use this tool when you want to:
- add new language/framework/testing/platform/data signals for an existing client
- refine baseline expectations or guardrails
- update client profile content without re-running destructive onboarding behavior

Use `onboard-new-client.js` only for first-time onboarding or full single-client reset.

## Command

```bash
node .github/initializer/tools/update-client-profile.js --input <path> [options]
```

Options:
- `--input <path>`: required; markdown or json questionnaire delta file
- `--client-id <id>`: target existing client id
- `--dry-run`: preview changes without writing files
- `--sync-manifest`: run `sync-seed-manifest.js` after applying changes
- `--help`: show usage

## VS Code Task Availability

Dedicated task:
- `update client profile`

Task source:
- `.vscode/tasks.json`

Task command uses:
- `--input .github/initializer/client-inputs/client-onboarding-response-template.md --client-id xome --sync-manifest`

If you are updating a different client or using a different input file, run the CLI command directly.

## Interactive Prompt Workflow

Prompt file:
- `.github/initializer/owner-prompts/update-client-profile.prompt.md`

How to run:
- In Copilot Chat, run: `run .github/initializer/owner-prompts/update-client-profile.prompt.md`

What the prompt does:
- asks for target existing client id first
- supports both input modes:
  - existing questionnaire file
  - interactive update answers
- uses the same questionnaire-compatible control mapping as onboarding
- defaults to dry-run first
- runs update script with `--client-id <target-client-id> --sync-manifest`

Prompt mirror file:
- `.github/initializer/packs/root/.github/initializer/owner-prompts/update-client-profile.prompt.md`

## How It Differs From Onboarding

`update-client-profile.js` is non-destructive by default:
- updates an existing client only
- merges new signals into current client settings
- preserves existing values when answers are missing
- does not prune other client folders
- does not replace the full `clients` object with a new single entry

`onboard-new-client.js` is reset-oriented:
- establishes or replaces the single-client distribution state
- can prune non-selected client overlays and overwrite broader config state

## What It Reads

Inputs:
- questionnaire delta file from `--input`

Configuration sources read and updated:
- `config/client-profiles.json`
- `config/standards-catalog.json`
- `.github/initializer/packs/root/config/client-profiles.json`
- `.github/initializer/packs/root/config/standards-catalog.json`

Overlay documentation updated:
- `docs/standards/clients/<client>/overlays/README.md`
- `.github/initializer/packs/docs/standards/clients/<client>/overlays/README.md`

## What It Writes

### 1) Updates existing client entry

In `client-profiles.json`:
- updates only the target client entry
- preserves unrelated client profiles
- merges new values into:
  - `intendedUse`
  - `stackSignals`
  - `enabledCapabilities`
  - `baselineExpectations`
  - `requiredGuardrails`

### 2) Updates standards catalog client entry

In `standards-catalog.json`:
- updates or inserts the target client overlay entry
- preserves other client entries

### 3) Refreshes overlay README summary

For the target client overlay README:
- updates project/output/security/approval/avoid-action summary
- keeps overlay folder intact

## Safety Workflow (Recommended)

1. Run preview first:
```bash
node .github/initializer/tools/update-client-profile.js --input <file> --client-id <id> --dry-run
```

2. Apply after review:
```bash
node .github/initializer/tools/update-client-profile.js --input <file> --client-id <id>
```

3. Include manifest sync when you want metadata alignment:
```bash
node .github/initializer/tools/update-client-profile.js --input <file> --client-id <id> --sync-manifest
```

## Output Summary

On completion it prints a JSON summary with:
- mode (`apply` or `dry-run`)
- input file path
- `clientId`, `displayName`
- changed fields list
- changed field count
- whether `syncManifest` ran

## Failure Conditions

The tool exits non-zero when:
- `--input` is missing
- input file path does not exist
- target client id cannot be resolved
- target client profile does not already exist
- manifest sync fails when requested

## Related Guides

- `../tools/onboard-new-client-guide.md`
- `../prompts/update-client-profile-prompt-guide.md`
