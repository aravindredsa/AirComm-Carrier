# sync-owner-from-zip.js Guide

## 1) Purpose

Script:
- `.github/initializer/tools/sync-owner-from-zip.js`

This script lets an owner update the local initializer from a released distribution zip while protecting the current sync launcher during the same run.

It is an owner-maintenance and recovery tool, not a normal downstream workflow.

## 2) Direct Callers

Directly invoked by:
- VS Code task `initializer: sync owner from zip`
- manual CLI usage described in `.owner-sync-incoming/README.md`

Task source:
- The label is defined in `.vscode/tasks.json`.

## 3) Core Responsibilities

The script:
- finds the requested zip or latest incoming zip
- unzips it to a temp directory
- replaces local `.github/initializer/` with the extracted copy
- restores its own launcher bytes to avoid self-upgrade during execution
- copies owner state from the zip
- optionally copies `owner-sync-first-time-bootstrap-guide.md`
- runs `initialize-workspace.js --mode=migrate`
- runs `sync-seed-manifest.js`
- cleans up temp files

## 4) Important Inputs

Default incoming source folder:
- `.owner-sync-incoming/`

Key files involved:
- `.github/initializer/tools/sync-owner-from-zip.js`
- `.init_state/owner-distribution-state.json`
- `owner-sync-first-time-bootstrap-guide.md`

## 5) Safe-Launcher Contract

This script intentionally preserves its own pre-run bytes.

Why:
- the zip may contain a newer copy of the launcher
- replacing the currently running launcher mid-run is unsafe
- the script restores the original launcher bytes for the current execution
- the updated launcher can be adopted on a later run

This is why `sync-seed-manifest.js` marks this target as `bootstrap-protected`.

## 6) Downstream Script Dependencies

After copying initializer content from the zip, this script invokes:
- `node .github/initializer/tools/initialize-workspace.js --mode=migrate`
- `node .github/initializer/tools/sync-seed-manifest.js`

This means it is operationally coupled to both scripts.

## 7) Maintainer Risks

Be careful when changing:
- safe-launcher preservation behavior
- zip extraction assumptions
- owner-state copy behavior
- sequence of migrate then sync

This script exists specifically to avoid broken owner self-upgrade flows.

## 8) Validation Checklist

After editing:
1. Run `node --check .github/initializer/tools/sync-owner-from-zip.js`.
2. Test with a disposable zip in `.owner-sync-incoming/`.
3. Confirm initializer content updates, owner state copies, and migrate/sync both run.
4. Confirm the current launcher is protected during the run.
