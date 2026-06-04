# Manifest and Pack Architecture Guide

## Why We Moved Away From Monolithic Initialization
The older monolithic approach coupled inventory, content, rules, and update behavior in one flow. That made versioning and selective updates harder to control.

The new architecture separates concerns:
- content is in packs
- policy and inventory are in manifest/rules
- execution is in dedicated tools
- state is persisted for delta-aware runs

Result:
- safer incremental updates
- better traceability
- cleaner versioned distributions

## Architecture Overview
The architecture has 4 layers:

1. Content Layer (Packs)
- Location: `.github/initializer/packs/`
- Holds seed files grouped by area (`prompts`, `skills`, `docs`, `templates`, `root`, etc.)

2. Contract Layer (Manifest + Rules)
- `manifest/seed-manifest.json` defines required folders/files, targets, policies, and migration settings
- `rules/normalization.json` defines normalization for checksum comparisons
- `migrations/migration-mode.json` defines mode behavior and state file location

3. Execution Layer (Tools)
- `sync-seed-manifest.js` rebuilds target metadata and checksums
- `initialize-workspace.js` applies managed content into downstream workspace
- `finalize-distribution.js` creates versioned zips and updates release notes
- `watch-owner-loop.js` auto-runs sync on source changes

4. State Layer
- downstream run state: `.init_state/initializer-version.json`
- owner distribution state: `.init_state/owner-distribution-state.json`

## End-to-End Flow
### A) Authoring / Maintainer Flow
1. Maintainer updates pack sources and/or managed workspace files.
2. Run sync to regenerate manifest target registry and checksums.
3. Owner cycle opens when managed fingerprint diverges from baseline.
4. Run finalize to create `distributions/*-vN.zip`.
5. Finalize updates release notes, resets baseline fingerprint, and closes cycle.

### B) Downstream Consumer Flow
1. Downstream user copies initializer assets into workspace.
2. User runs `/initialize-ai-workspace`.
3. Initializer resolves mode:
   - no prior state -> bootstrap
   - prior state exists -> migrate
4. Managed targets are applied according to apply modes and checksums.
5. State file is written for future delta-aware runs.

## Important Behavior Rules
### Apply Modes
- `overwrite`: managed target can be replaced when applicable
- `preserve-meaningful`: keeps user-meaningful existing content
- `create-if-parent-empty`: creates starter files only for empty folders
- `bootstrap-protected`: protected entrypoint files are skipped during seeding

### Mode Resolution
`auto` mode (default) is state-aware:
- first run (no state file): behaves like bootstrap
- subsequent runs (state present): behaves like migrate

This gives safe repeatability without forcing full reseed each time.

## Why This Is Better
1. Deterministic and auditable updates
- target-level checksums in manifest
- explicit normalization rules
- explicit state transitions

2. Better downstream safety
- migrate mode updates only changed/missing managed targets
- preserve-meaningful behavior protects user-customized files where intended

3. Cleaner release operations
- active owner cycle tracks pending changes
- finalize only happens when real managed changes exist
- each distribution is versioned and baselined

4. Easier maintenance and troubleshooting
- clear split between content, contract, tooling, and state
- faster root-cause analysis for mismatch and drift issues

## Practical Advantages For Teams
- Faster rollout of prompt/docs/standards updates
- Lower risk of accidental broad overwrite in ongoing workspaces
- Better accountability for what changed between versions
- Better support for parallel frontend/backend enabler maintenance

## Operational Notes
- Finalize requires an active owner cycle with pending managed changes.
- If no cycle is open, make a managed source change and run sync.
- Use explicit repo `cd` commands when running frontend/backend operations to avoid wrong-cwd mistakes.
- Keep release notes focused on significant user-visible changes.

## FAQ
### Q1: What happens to old workspaces created with monolithic initializer?
If no `.init_state/initializer-version.json` exists, the first run of new initializer in `auto` mode behaves as `bootstrap`.

### Q2: Does user experience change downstream?
Minimal change for end users. They still run the initializer prompt, while internal mechanics are now more structured and reliable.

### Q3: Is reset still required in normal operations?
No. Standard flow is initialize-driven. Reset remains a compatibility entrypoint but is not part of normal day-to-day guidance.

### Q4: How do we know when to cut a new version?
When managed sources diverge from baseline, owner cycle opens. Finalize then produces the next versioned artifact.

## Quick Command Reference
```bash
# Regenerate manifest metadata and owner cycle state
node .github/initializer/tools/sync-seed-manifest.js

# Optional watcher while editing managed sources
node .github/initializer/tools/watch-owner-loop.js

# Produce versioned distribution zip
node .github/initializer/tools/finalize-distribution.js
```

## Summary
The manifest/pack architecture gives us a modular, versioned, and state-aware initializer system. It keeps downstream usage simple while making authoring, updates, and distribution far more controlled than the previous monolithic model.
