# sync-seed-manifest.js Guide

## 1) Purpose

Script:
- `.github/initializer/tools/sync-seed-manifest.js`

This script rebuilds manifest-derived metadata from pack sources and updates owner-cycle state.

It is the core metadata synchronizer for the manifest/pack system.

## 2) Direct Callers

Directly invoked by:
- VS Code task `initializer: sync manifest metadata`
- `.github/initializer/tools/watch-owner-loop.js`
- `.github/initializer/tools/finalize-distribution.js`
- `.github/initializer/tools/sync-owner-from-zip.js`

Task source:
- The label is defined in `.vscode/tasks.json`.

## 3) Core Responsibilities

The script:
- scans pack sources
- maps pack files to downstream target paths
- computes normalized checksums
- rebuilds `requiredFolders`, `requiredFiles`, `createIfFolderEmpty`, and `targets`
- writes updated manifest JSON
- computes managed-source fingerprint
- updates `.init_state/owner-distribution-state.json`
- opens or closes the active owner cycle based on divergence from baseline

## 4) Important Inputs

Required files:
- `.github/initializer/manifest/seed-manifest.json`
- `.github/initializer/rules/normalization.json`
- `initializer-release-notes.md` for latest-version inference

Key source areas:
- `.github/initializer/packs/**`
- bootstrap prompt paths from manifest reset policy
- selected root-managed files such as `.github/copilot-instructions.md`

## 5) Pack-to-Target Mapping Role

This script is the place where pack source paths are translated into downstream target paths.

Examples:
- `packs/prompts/*` -> `.github/prompts/*`
- `packs/skills/*` -> `.github/skills/*`
- `packs/root/*` -> root-aligned targets

It also assigns apply modes for targets, including special handling for:
- `.github/copilot-instructions.md`
- `.init_state/prompt-usage.jsonl`
- `.github/initializer/tools/sync-owner-from-zip.js`
- README files under selected generated-output folders

## 6) Owner Cycle Behavior

The script maintains owner release-cycle state in:
- `.init_state/owner-distribution-state.json`

It compares the current managed-source fingerprint to the baseline fingerprint.

If different:
- owner cycle opens (or remains open)
- pending changed paths are accumulated

If same as baseline:
- owner cycle closes
- pending changes are cleared

## 7) Check-Only Mode

Supported flag:
- `--check`

In this mode the script validates whether manifest content is already current and exits non-zero if metadata is stale.

## 8) Important Couplings

This script is upstream of:
- `initialize-workspace.js` because it produces the manifest metadata initialization depends on
- `finalize-distribution.js` because finalize requires synced metadata and owner-cycle state
- `watch-owner-loop.js` because watch mode is just an auto-trigger wrapper around this script

## 9) Maintainer Risks

Be careful when changing:
- prefix mappings between pack sources and target paths
- apply-mode assignment rules
- owner-state schema handling
- fingerprint logic
- root folders always required

These changes affect both downstream initialization behavior and release-cycle tracking.

## 10) Validation Checklist

After editing:
1. Run `node --check .github/initializer/tools/sync-seed-manifest.js`.
2. Run `node .github/initializer/tools/sync-seed-manifest.js`.
3. Confirm manifest metadata updates as expected.
4. Confirm owner cycle status reflects actual divergence.
