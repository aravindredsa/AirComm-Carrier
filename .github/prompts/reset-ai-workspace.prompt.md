---
agent: 'agent'
description: 'Remove files and folders created by initialize-ai-workspace prompt using manifest-driven inventory so the workspace can be reinitialized from a clean baseline'
---

## Goal
Return the workspace to a clean pre-initialization state by removing files/folders created by `.github/prompts/initialize-ai-workspace.prompt.md`.

## Maintenance Note
- Root `initializer-release-notes.md` is a packaged artifact, not an initializer-seeded file.
- Preserve root `initializer-release-notes.md` during reset.
- Update root `initializer-release-notes.md` when this prompt changes in a significant user-facing way, using one consolidated entry per calendar day.
- If `initialize-ai-workspace.prompt.md` and `reset-ai-workspace.prompt.md` both change on the same day, record all same-day changes under one release-note entry (no multiple same-day version entries).
- Do not add release-note entries for micro-iterations, cleanup-only edits, or refactors with no user-visible workspace impact.
- If the user explicitly says to include or skip a release-note item, follow that instruction.
- Release notes are non-blocking metadata and must never halt reset execution.

## Safety Rules
1. Never run destructive git commands (`git reset --hard`, `git checkout --`, `git clean -fdx`).
2. Use only manifest-derived inventory for deletion candidates.
3. Never delete these bootstrap/external files:
   - `.github/prompts/initialize-ai-workspace.prompt.md`
   - `.github/prompts/reset-ai-workspace.prompt.md`
   - `.github/copilot-instructions.md` (protected exception)
   - `initializer-release-notes.md`
   - `workspace-ai-initialization-guide.md`
4. If a path cannot be resolved safely, skip it and report why.
5. Never delete files that are not in manifest-derived file candidates.
6. For folder candidates, delete only initializer-created files first; delete folder only when metadata-only residue remains (`README.md`, `__MACOSX`, `.DS_Store`).

## Manifest-Driven Inventory

Required input:
- `.github/initializer/manifest/seed-manifest.json`

Hard fail if manifest is missing or unparseable.

Derive candidates from manifest:
1. File candidates:
   - all entries in `requiredFiles`
   - all entries in `createIfFolderEmpty[*].files`
2. Folder candidates:
   - all entries in `requiredFolders`
3. Protected paths:
   - all `packagedArtifacts[*].path`
   - all `resetPolicy.protectedPaths`

## Execution Steps
1. Parse manifest and build candidate sets.
2. Normalize separators to `/`, remove duplicates, classify into file and folder candidates.
3. Exclude protected paths.
4. For each file candidate:
   - if file exists, delete it
   - if symlink exists, delete symlink only
   - if absent, record `already absent`
5. Evaluate folder candidates deepest-first:
   - remove remaining initializer-created files inside the folder
   - remove metadata-only residue (`README.md`, `__MACOSX/`, `.DS_Store`) when present
   - remove folder if empty after cleanup
   - keep folder when non-initializer content remains and record reason
6. Attempt to remove empty parent directories, deepest-first, stopping at repository root.
7. Remove generated output folders only if empty:
   - `artifacts/`
   - `reports/`
   - `test-assets/`
8. If `resetPolicy.removeStateOnReset` is `true`, delete `resetPolicy.stateFile` and remove `.init_state/` if it becomes empty.

## Validation
1. Recompute manifest-derived candidate sets and verify:
   - no non-protected file candidate still exists
   - remaining folders contain non-initializer content or protected files
2. If any candidate remains, report with reason (`protected`, `contains non-initializer content`, `not empty directory parent`, `permission`, `manual review`).

## Final Report Format
Provide concise summary:
- `Total candidates`
- `Deleted`
- `Already absent`
- `Skipped (protected)`
- `Failed`
- `Empty directories removed`

Then include:
- `Deleted paths` (absolute paths)
- `Failed/Skipped paths` with reason

## Invocation
In Copilot Chat (Agent Mode), run:
```text
/reset-ai-workspace
```

Expected result:
- Workspace no longer contains initializer-managed files/folders (excluding protected bootstrap/external files), so `/initialize-ai-workspace` can run again from a clean baseline.
- Differential updater state is cleared so the next initializer run starts from a fresh baseline.
