---
agent: 'agent'
description: Initialize or align the AI enablement workspace using manifest and pack sources with checksum-based differential updates.
---

# Initialize AI Workspace

## Purpose

Set up the standard AI enablement workspace structure in the current workspace root using the canonical manifest and pack files only.

## Maintenance Note

- Root `initializer-release-notes.md` is a packaged artifact supplied with the distributed zip.
- Do not create or seed `initializer-release-notes.md` in this prompt.
- When this prompt or `.github/prompts/reset-ai-workspace.prompt.md` changes in a significant user-facing way, update root `initializer-release-notes.md` with one consolidated entry per calendar day.
- If both prompts change on the same day, record all same-day changes under a single release-note entry (do not create multiple same-day version entries).
- Significant changes include additions/removals/renames of managed folders or files, meaningful seeding-content changes, workflow/order changes, new user actions, or compatibility-impacting behavior changes.
- Do not add release-note entries for micro-iterations, wording cleanup, or refactors with no user-visible workspace impact.
- If the user explicitly says to include or skip a release-note item, follow that instruction.
- Release notes are non-blocking metadata: report status if needed, but never halt initialization.

## Source Contract

This prompt uses manifest and pack sources.

- Do not infer required files/folders from this prompt body.
- Required inventory must come from `.github/initializer/manifest/seed-manifest.json`.
- Seed content must come from `.github/initializer/packs/**`.
- If manifest or required pack source is missing/unreadable, stop with failure and report the exact missing path(s).

## Single Entrypoint

Use exactly one executable entrypoint:

- `node .github/initializer/tools/initialize-workspace.js`

Optional flags:

- `--mode=auto|bootstrap|migrate|reseed|audit`
- `--strict-regression` (opt-in only)

Do not replace this with ad-hoc orchestration.

- Do not generate Python helper scripts.
- Do not generate multiline shell copy blocks.
- Do not manually re-implement diff/verification/state logic in chat steps.

## Execution Rules

1. Work from the current workspace root.
2. Invoke only the single entrypoint script.
3. Use default fast behavior unless the user explicitly asks for strict regression mode.
4. Do not create auxiliary scripts for seeding, verification, or regression.
5. Report script output summary to the user, including mode and key counts.

## Canonical Inputs

Required files:
- Manifest: `.github/initializer/manifest/seed-manifest.json`
- Schema marker: `.github/initializer/manifest/schema-version.json`
- Policy: `.github/initializer/rules/policy.json`
- Normalization: `.github/initializer/rules/normalization.json`
- Migration mode: `.github/initializer/migrations/migration-mode.json`
- State template: `.github/initializer/migrations/state-template.json`

Hard-fail if any canonical input above is missing.

## Behavioral Contract

The entrypoint script is responsible for all operational behavior:

- mode resolution (`auto/bootstrap/migrate/reseed/audit`)
- differential target selection
- apply-mode behavior (`overwrite`, `preserve-meaningful`, `create-if-parent-empty`, `bootstrap-protected`)
- normalized verification and single retry on mismatch
- state write/update at `.init_state/initializer-version.json`
- transient cleanup
- strict regression snapshots/diff only when `--strict-regression` is used

## Final Summary Output

Provide concise output with:

- `Mode`
- `Manifest status`
- `Pack status`
- `Folders created`
- `Targets created/updated`
- `Targets skipped unchanged`
- `Missing targets repaired`
- `Files skipped` with reason
- `Validation mismatches` (if any)
- `Standards seeding status`
- `Transient cleanup status`
- `Regression report status` (`not-run` by default; `pass/fail` only in strict regression mode)
- `Regression report path` (strict mode only)
- `Unexpected changes` (strict mode only)
- `State write status`
- `Release notes status` (`present` or `missing`)
- `Recommendations`

## Invocation

In Copilot Chat (Agent Mode), run:

```text
/initialize-ai-workspace
```

Command to execute:

```text
node .github/initializer/tools/initialize-workspace.js
```

When strict regression is explicitly requested:

```text
node .github/initializer/tools/initialize-workspace.js --strict-regression
```

Expected result:
- Workspace alignment is executed by one deterministic Node runner end-to-end.
- Default path is fast bootstrap/migrate differential update with no ad-hoc helper scripts.
- Strict regression reporting runs only when explicitly requested.
