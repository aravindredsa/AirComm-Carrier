# watch-owner-loop.js Guide

## 1) Purpose

Script:
- `.github/initializer/tools/watch-owner-loop.js`

This is a convenience watcher for owners editing managed sources.

It automatically re-runs `sync-seed-manifest.js` when pack/bootstrap inputs change.

## 2) Direct Callers

Directly invoked by:
- VS Code task `initializer: watch owner loop`

Task source:
- The label is defined in `.vscode/tasks.json`.

## 3) Core Responsibilities

The script:
- watches selected managed-source paths
- debounces rapid file-system events
- invokes `sync-seed-manifest.js`
- queues a rerun if changes happen while sync is already executing

## 4) Watched Inputs

Current watch targets:
- `.github/initializer/packs`
- `.github/prompts/initialize-ai-workspace.prompt.md`
- `.github/prompts/reset-ai-workspace.prompt.md`
- `.github/copilot-instructions.md`
- `.github/initializer/rules/normalization.json`

## 5) Dependency Relationship

This script is a thin wrapper over:
- `.github/initializer/tools/sync-seed-manifest.js`

It contains almost no business logic beyond debounce and rerun control.

If sync behavior changes, this watcher inherits that behavior automatically.

## 6) Operational Notes

Startup behavior:
- runs an immediate sync once at launch
- then continues watching for changes

Concurrency behavior:
- if sync is already running, it marks a rerun as pending
- after current sync finishes, it runs again once

## 7) Maintainer Risks

Be careful when changing:
- watch target list
- debounce timing
- rerun-pending logic

This script should remain simple. More complex metadata logic belongs in `sync-seed-manifest.js`, not here.

## 8) Validation Checklist

After editing:
1. Run `node --check .github/initializer/tools/watch-owner-loop.js`.
2. Start the watcher.
3. Touch a pack file and confirm sync re-runs.
4. Confirm repeated quick edits do not launch overlapping sync processes.
