# Initialize AI Workspace Prompt Guide

## 1) Purpose

This guide explains the maintainer-facing architecture behind `.github/prompts/initialize-ai-workspace.prompt.md`.

This prompt is the canonical downstream entrypoint for workspace alignment. It does not implement initialization logic itself. Its job is to enforce a strict execution contract around one Node entrypoint.

## 2) Prompt Role in the System

The prompt exists to keep initialization deterministic.

It tells the agent to:
- trust manifest and pack sources, not prompt prose, for inventory
- invoke exactly one executable entrypoint
- avoid ad-hoc shell orchestration or helper scripts
- report a standardized summary back to the user

Single entrypoint:
- `node .github/initializer/tools/initialize-workspace.js`

## 3) Files This Prompt Depends On

Canonical inputs declared by the prompt:
- `.github/initializer/manifest/seed-manifest.json`
- `.github/initializer/manifest/schema-version.json`
- `.github/initializer/rules/policy.json`
- `.github/initializer/rules/normalization.json`
- `.github/initializer/migrations/migration-mode.json`
- `.github/initializer/migrations/state-template.json`

Execution dependency:
- `.github/initializer/tools/initialize-workspace.js`

Related runtime state:
- `.init_state/initializer-version.json`

## 4) Behavioral Contract

The prompt delegates all operational behavior to `initialize-workspace.js`, including:
- mode resolution
- differential target selection
- managed-file apply modes
- normalized verification and retry behavior
- state writes
- transient cleanup
- optional strict regression reporting

The prompt explicitly forbids:
- re-implementing initialization logic in chat
- using Python helper scripts
- replacing the Node runner with manual shell copy flows

## 5) Supported Modes

Optional flags accepted by the prompt contract:
- `--mode=auto`
- `--mode=bootstrap`
- `--mode=migrate`
- `--mode=reseed`
- `--mode=audit`
- `--strict-regression`

Important default behavior:
- downstream users normally run the prompt with no explicit mode
- `auto` is the expected standard path
- strict regression is opt-in only

## 6) What the Prompt Must Report

The prompt requires a normalized summary including:
- mode
- manifest status
- pack status
- folders created
- created/updated/skipped/repaired targets
- validation mismatches
- standards seeding status
- transient cleanup status
- regression report status and path when applicable
- state write status
- release notes status
- recommendations

This keeps user-facing output stable even if internals evolve.

## 7) Runtime Call Relationships

Direct caller:
- `.github/prompts/initialize-ai-workspace.prompt.md`

Shared dependency path:
- the prompt calls `initialize-workspace.js`
- `initialize-workspace.js` reads manifest, rules, migration config, and state templates

Indirect relationship:
- `.github/initializer/tools/sync-owner-from-zip.js` also calls `initialize-workspace.js --mode=migrate`
- this means any breaking change to `initialize-workspace.js` affects both normal downstream initialization and owner-side zip sync flows

## 8) Maintainer Rules

When changing this prompt:
1. Keep the single-entrypoint contract intact.
2. Do not duplicate inventory rules that belong in manifest/rules files.
3. Keep the required summary fields aligned with actual script output.
4. If user-visible behavior changes significantly, update `initializer-release-notes.md` in the same change set.
5. Keep mirrored pack/bootstrap expectations aligned where applicable.

## 9) Validation Checklist

After editing the prompt:
1. Confirm it still points only to `node .github/initializer/tools/initialize-workspace.js`.
2. Confirm canonical input paths still match the real files.
3. Confirm required summary fields still match script output.
4. Confirm no ad-hoc execution instructions were introduced.

## 10) Related Owner Guides

See also:
- `../tools/initialize-workspace-guide.md`
- `../architecture/manifest-pack-architecture-guide.md`
- `./report-prompt-adoption-guide.md`
