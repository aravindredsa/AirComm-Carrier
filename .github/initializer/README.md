# Initializer Scaffold

This folder contains manifest, pack, rules, and state assets for the initializer architecture.

## Stage 1

- Externalized selected high-churn prompt seed sources into pack files under `.github/initializer/packs/prompts/`.
- Prompt seed content lives under `.github/initializer/packs/prompts/`.

## Stage 2

- Added canonical inventory manifest at `.github/initializer/manifest/seed-manifest.json`.
- Added schema marker at `.github/initializer/manifest/schema-version.json`.
- Added policy and normalization rules under `.github/initializer/rules/`.
- Inventory is defined by the manifest and supporting rules files.

## Stage 3

- Introduced migration mode config under `.github/initializer/migrations/`.
- Added persistent initializer state contract at `.init_state/initializer-version.json`.
- Initializer prompt now supports `auto/bootstrap/migrate/reseed/audit` mode semantics.
- Cleanup rules preserve persistent `.init_state/initializer-version.json` and remove transient artifacts only.

## Stage 4

- Added `resetPolicy` block to `seed-manifest.json` — centralizes protected paths and inventory source declarations for reset operations.
- Reset prompt uses manifest-managed inventory from the same source of truth as initializer.

## Stage 5

- Initializer uses manifest and pack sources.
- Reset uses manifest-managed inventory.
- Added `packPolicy` contract in manifest to make the source model explicit and auditable.

## Stage 6

- Added per-target manifest registry with `sourcePath` and `checksumSha256` metadata.
- Initializer `migrate` mode now compares target checksums against persisted state and updates only changed or missing managed targets.
- State schema moved to `2.0` and now records `targetStates`, `changedTargets`, `unchangedTargets`, and `repairedMissingTargets`.
- Reset now clears differential updater state for a true clean baseline.

## Notes

- User entrypoint remains unchanged: `.github/prompts/initialize-ai-workspace.prompt.md`.
- Permanent distribution rule: `.github/prompts/initialize-ai-workspace.prompt.md` and `.github/prompts/reset-ai-workspace.prompt.md` are bootstrap entrypoints and must be shipped directly under `.github/prompts/` (not pack-only).
- Current architecture is manifest and pack based.
