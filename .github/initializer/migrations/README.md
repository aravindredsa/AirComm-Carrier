# Migration Modes

This folder contains migration mode and state templates for checksum-based differential initializer execution.

Files:
- migration-mode.json: mode resolution and state-file references.
- state-template.json: baseline state shape for `.init_state/initializer-version.json` using state schema `2.0`.

Supported modes:
- auto
- bootstrap
- migrate
- reseed
- audit

Mode behavior summary:
- auto: choose bootstrap when state is missing, otherwise migrate.
- bootstrap: full initialization and seeding.
- migrate: compare target checksums to persisted `targetStates`, apply only changed targets, and repair missing required targets.
- reseed: force overwrite managed targets by policy.
- audit: validate/report only, no writes.
