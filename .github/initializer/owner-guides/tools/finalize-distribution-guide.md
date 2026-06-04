# finalize-distribution.js Guide

## 1) Purpose

Script:
- `.github/initializer/tools/finalize-distribution.js`

This script creates the official versioned distribution zip for the enabler and closes the active owner cycle.

It is the release boundary for managed changes.

## 2) Direct Callers

Directly invoked by VS Code tasks:
- `initializer: finalize distribution zip (auto)`
- `initializer: finalize distribution zip (patch)`
- `initializer: finalize distribution zip (minor)`
- `initializer: finalize distribution zip (major)`
- `initializer: finalize distribution zip (prune deleted)`

These task labels are defined in `.vscode/tasks.json`.

## 3) Core Responsibilities

The script:
- writes back workspace-managed target changes into pack sources
- runs `sync-seed-manifest.js`
- verifies there is an active owner cycle with pending changes
- classifies required release level
- selects final version bump
- updates `initializer-release-notes.md`
- stages releasable content
- prunes non-distribution `.github` content
- creates the zip artifact in `distributions/`
- updates owner baseline state and closes the cycle

## 4) Required Inputs and Dependencies

Depends on:
- `.github/initializer/manifest/seed-manifest.json`
- `.init_state/owner-distribution-state.json`
- `.github/initializer/tools/sync-seed-manifest.js`
- managed pack sources and selected root-managed files

Distribution support dependencies:
- `zip` command when available
- PowerShell `Compress-Archive` fallback on Windows

## 5) Release Semantics

Supported flags:
- `--release=auto|major|minor|patch`
- `--prune-deleted`
- `--no-release-check`

Behavior notes:
- `auto` chooses release level based on changed managed content
- prompt add/remove changes force a higher release level
- `--no-release-check` disables minimum-release enforcement
- `--prune-deleted` removes missing workspace targets from pack sources during write-back

## 6) Write-Back Relationship to Packs

Before syncing and packaging, this script copies changed workspace-managed files back into pack sources.

This ensures:
- pack source remains canonical after owner edits in workspace-aligned locations
- sync sees the latest content
- the distribution zip includes current managed content

This is a critical dependency relationship:
- finalize depends on sync
- sync depends on pack state
- finalize updates pack state before calling sync

## 7) Distribution Contents

The staged distribution includes:
- `.github/initializer/**`
- bootstrap prompts under `.github/prompts/`
- `workspace-ai-initialization-guide.md` when present
- `initializer-release-notes.md`

The staged distribution prunes:
- `.github/skills/`
- `.github/hooks/`
- non-bootstrap prompts from `.github/prompts/`

## 8) State Files Updated

Updates:
- `initializer-release-notes.md`
- `.init_state/owner-distribution-state.json`
- `distributions/<artifact>.zip`

## 9) Important Couplings

Coupled to:
- `sync-seed-manifest.js` for refreshed metadata and cycle state
- owner state file for release gating
- pack mappings and bootstrap prompt rules for staged artifact composition

## 10) Maintainer Risks

Be careful when changing:
- release classification rules
- staged distribution pruning rules
- write-back logic
- artifact naming
- owner-cycle close/baseline reset behavior

This script defines what becomes official and what ships to downstream users.

## 11) Validation Checklist

After editing:
1. Run `node --check .github/initializer/tools/finalize-distribution.js`.
2. Run sync first and confirm an active owner cycle exists.
3. Test finalize in a safe branch or disposable copy.
4. Confirm release notes, artifact creation, and owner-state closeout all succeed together.
