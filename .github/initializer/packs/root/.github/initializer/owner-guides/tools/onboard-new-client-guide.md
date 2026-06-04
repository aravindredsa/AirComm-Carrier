# onboard-new-client.js Guide

## Purpose

`onboard-new-client.js` converts a completed client onboarding questionnaire into a single-client standards configuration and overlay setup.

Use this tool when you want to:
- onboard or switch to one client profile
- regenerate client profile config from questionnaire answers
- prune non-selected client overlays for a single-client distribution

If you only need to change an already-onboarded client incrementally, use `update-client-profile.js` instead.

## Command

```bash
node .github/initializer/tools/onboard-new-client.js --input <path> [options]
```

Options:
- `--input <path>`: required; markdown or json questionnaire file
- `--client-id <id>`: optional override for derived client id
- `--dry-run`: preview computed changes without writing files
- `--sync-manifest`: run `sync-seed-manifest.js` after applying changes
- `--help`: show usage

## VS Code Task Availability

Dedicated task:
- `onboard new client`

Task source:
- `.vscode/tasks.json`

Task command uses:
- `--input .github/initializer/client-inputs/client-onboarding-response-template.md --sync-manifest`

If you use a different questionnaire file, run the CLI command directly with a custom `--input` path.

## Interactive Prompt Workflow

You can run the guided prompt instead of preparing the questionnaire file manually.

Prompt file:
- `.github/initializer/owner-prompts/onboard-new-client.prompt.md`

How to run:
- In Copilot Chat, run: `run .github/initializer/owner-prompts/onboard-new-client.prompt.md`

What the prompt does:
- asks user to select input mode first:
  - use existing questionnaire file
  - answer questions interactively
- asks all 18 onboarding questions one-by-one with progress labels like `[3/18]`
- uses control types based on script parsing behavior:
  - checkbox for multi-value inputs (languages, frameworks, testing, platform, outputs, approvals, restrictions)
  - radio for single-choice preference inputs (output format, sample availability, detail level)
  - textbox for freeform policy and terminology inputs
- supports `Other` follow-up capture and appends those details to the same answer
- for interactive mode, writes a completed response file to:
  - `artifacts/onboarding/client-onboarding-response-<YYYYMMDD-HHMMSS>.md`
- for existing-file mode, uses the provided questionnaire path directly as script input
- asks whether to run dry-run first and optionally collects client id override
- runs `onboard-new-client.js` with `--sync-manifest`

Execution pattern used by prompt:
- dry-run path:
  - `node .github/initializer/tools/onboard-new-client.js --input <generated-file> --dry-run --sync-manifest [--client-id <id>]`
- apply path:
  - `node .github/initializer/tools/onboard-new-client.js --input <generated-file> --sync-manifest [--client-id <id>]`

Prompt mirror file:
- `.github/initializer/packs/root/.github/initializer/owner-prompts/onboard-new-client.prompt.md`

## What It Reads

Inputs:
- questionnaire file from `--input`

Configuration sources updated in-place:
- `config/client-profiles.json`
- `config/standards-resolution-policy.json`
- `config/standards-catalog.json`
- `.github/initializer/packs/root/config/client-profiles.json`
- `.github/initializer/packs/root/config/standards-resolution-policy.json`
- `.github/initializer/packs/root/config/standards-catalog.json`

## What It Writes

### 1) Rewrites client profile config (workspace + pack root)

In `client-profiles.json`:
- sets `defaultClientId`
- replaces `clients` with a single entry for selected client
- recalculates:
  - `stackSignals`
  - `enabledCapabilities`
  - `overlayPath`
  - `baselineExpectations`
  - `requiredGuardrails`

### 2) Updates standards resolution policy (workspace + pack root)

In `standards-resolution-policy.json`:
- sets top-level `defaultClientId`
- sets `rules.clientOnboarding.defaultProfile`

### 3) Updates standards catalog (workspace + pack root)

In `standards-catalog.json`:
- replaces `layers.clients.entries` with one client entry
- sets `sourceStrategy.clientDefault`

### 4) Rebuilds client overlay folders (workspace + pack docs)

Roots affected:
- `docs/standards/clients/`
- `.github/initializer/packs/docs/standards/clients/`

Behavior:
- removes any client directory not matching selected client id
- creates selected client folder if missing
- writes:
  - `profile.yaml`
  - `overlays/README.md`

## Important Side Effects

This tool is intentionally single-client oriented:
- it prunes non-selected client folders under both standards client roots
- it replaces multi-client config entries with one client profile

If you maintain multi-client content in one branch, run with caution.

## Safety Workflow (Recommended)

1. Run preview first:
```bash
node .github/initializer/tools/onboard-new-client.js --input <file> --dry-run
```

2. Apply only after review:
```bash
node .github/initializer/tools/onboard-new-client.js --input <file>
```

3. If needed, include manifest sync:
```bash
node .github/initializer/tools/onboard-new-client.js --input <file> --sync-manifest
```

## Questionnaire Mapping Highlights

The tool maps questionnaire answers to capabilities and policy fields, including:
- language/framework/testing/data/platform signals
- intended use categories
- terminology preferences and restricted terms
- output preferences
- security/approval/avoid-action guardrails

## Output Summary

On completion it prints a JSON summary with:
- mode (`apply` or `dry-run`)
- input file path
- `clientId`, `displayName`, `overlayPath`
- `enabledCapabilities`
- whether `syncManifest` ran

## Failure Conditions

The tool exits non-zero when:
- `--input` is missing
- input file path does not exist
- client id cannot be derived and no override is given
- manifest sync fails when `--sync-manifest` is requested

## Related Incremental Update Workflow

For non-destructive post-onboarding changes, see:
- `update-client-profile.js`
- `../prompts/update-client-profile-prompt-guide.md`
