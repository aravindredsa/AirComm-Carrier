# initialize-workspace.js Guide

## 1) Purpose

Script:
- `.github/initializer/tools/initialize-workspace.js`

This is the runtime engine behind downstream workspace initialization and alignment.

It applies manifest-managed content into the current workspace using mode-aware, checksum-aware behavior.

## 2) Direct Callers

Directly invoked by:
- `.github/prompts/initialize-ai-workspace.prompt.md`
- `.github/initializer/tools/sync-owner-from-zip.js`

The initialize prompt is the normal downstream entrypoint.
`sync-owner-from-zip.js` uses this script in `--mode=migrate` after bringing in a released initializer from a zip.

VS Code task status:
- No dedicated task for this script in `.vscode/tasks.json`.
- It is typically invoked by prompts/tools rather than directly as a task.

## 3) Required Inputs

Canonical inputs loaded by the script:
- `.github/initializer/manifest/seed-manifest.json`
- `.github/initializer/manifest/schema-version.json`
- `.github/initializer/rules/policy.json`
- `.github/initializer/rules/normalization.json`
- `.github/initializer/migrations/migration-mode.json`
- `.github/initializer/migrations/state-template.json`

If any are missing, the script hard-fails.

## 4) Core Responsibilities

The script is responsible for:
- mode parsing and auto-resolution
- required folder creation
- target selection from manifest
- apply-mode handling
- normalized verification and one retry on mismatch
- state-file write/update
- renamed legacy prompt cleanup
- transient cleanup
- optional strict regression snapshot/diff reporting

## 5) Mode Model

Accepted modes:
- `auto`
- `bootstrap`
- `migrate`
- `reseed`
- `audit`

Behavior notes:
- `auto` resolves to `bootstrap` when no state file exists
- `auto` resolves to `migrate` when state already exists
- `audit` computes change intent without applying writes

## 6) Apply Modes It Honors

Per-target behavior comes from manifest metadata:
- `overwrite`
- `preserve-meaningful`
- `create-if-parent-empty`
- `bootstrap-protected`

The script does not decide inventory on its own. It executes the contract encoded in the manifest.

## 7) State and Output Files

Primary state file:
- `.init_state/initializer-version.json`

Optional strict-regression artifacts:
- `.init_state/initializer-regression-pre.json`
- `.init_state/initializer-regression-post.json`
- `.init_state/initializer-regression-diff-<version>.json`

## 8) Important Internal Dependencies

Depends on:
- manifest target metadata produced by `sync-seed-manifest.js`
- normalization rules for checksum comparison
- migration/state template config

Operationally coupled to:
- `sync-seed-manifest.js` because stale manifest metadata changes behavior
- `sync-owner-from-zip.js` because owner zip sync triggers this script in migrate mode

## 9) Key Output Summary

At completion it prints a normalized operational summary including:
- mode
- manifest/pack status
- folder and target counts
- missing repairs
- skipped files and reasons
- validation mismatches
- regression status
- state write status
- release-notes presence
- recommendations

The initialize prompt depends on this stable summary shape.

## 10) Maintainer Risks

Be careful when changing:
- mode resolution logic
- apply-mode semantics
- normalization/verification logic
- state schema fields
- cleanup rules for legacy prompts or transient files

A change here can affect both first-time downstream setup and owner-side migrate flows from zip sync.

## 11) Validation Checklist

After editing:
1. Run `node --check .github/initializer/tools/initialize-workspace.js`.
2. Run the initialize prompt or direct script in a safe workspace.
3. Confirm summary output fields still align with prompt expectations.
4. Confirm state file writes still work in bootstrap and migrate paths.
