# Hooks Guide

## 1) Purpose

This guide explains the maintainer-facing hook files used by the unified enabler for editor-triggered checks and local git push gating.

Managed hook source areas:
- `.github/initializer/packs/root/.github/hooks/`
- `.github/initializer/packs/root/.githooks/`

Primary downstream target areas:
- `.github/hooks/`
- `.githooks/`

## 2) Files Covered

### Editor/Copilot Hook Files
- `.github/hooks/format.json`
- `.github/hooks/detect-stack.cjs`
- `.github/hooks/run-post-tool-checks.cjs`
- `.github/hooks/README.md`

### Git Hook Gate Files
- `.githooks/pre-push`
- `.github/hooks/pre-push-audit-gate.config.json`
- `.github/hooks/pre-push-audit-gate.js`

### Managed Pack Mirrors
- `.github/initializer/packs/root/.github/hooks/*`
- `.github/initializer/packs/root/.githooks/pre-push`

## 3) Why These Hooks Exist

These files serve two distinct hook surfaces:
1. editor/Copilot post-tool hooks that run formatting and validation after tool activity
2. local git pre-push gating that blocks pushes when audit or vulnerability requirements are not satisfied

They are intentionally kept outside standards-resolution policy logic. Stack detection for runtime hook behavior is handled locally by hook scripts, not by the client-plus-capability standards model.

The standards model itself is driven by:
- `config/standards-resolution-policy.json`
- `config/client-profiles.json`
- `config/standards-catalog.json`

## 4) Ownership and Mirroring Model

The initializer model treats hook files as managed root assets.

Owner-maintained sources live under:
- `.github/initializer/packs/root/.github/hooks/`
- `.github/initializer/packs/root/.githooks/`

Downstream seeded targets live at:
- `.github/hooks/`
- `.githooks/`

When changing hook behavior:
1. update the pack-managed source
2. ensure the workspace copy matches when owner workspace parity is expected
3. run `node .github/initializer/tools/sync-seed-manifest.js`

## 5) Runtime Flow A: Post-Tool Checks

Entry point:
- `.github/hooks/format.json`

Current behavior:
1. `format.json` calls `node .github/hooks/run-post-tool-checks.cjs`
2. `run-post-tool-checks.cjs` calls `detect-stack.cjs`
3. stack-specific commands are run only when supported by the workspace

### detect-stack.cjs
Responsibilities:
- scan the workspace for lightweight stack markers
- classify the repo as `backend`, `frontend`, `db`, or `unknown`
- remain independent of audit prompt routing config

Current signals include:
- backend: `.csproj`, `.sln`
- frontend: `package.json`, `tsconfig.json`, `vite.config.*`
- db: `.sql`

### run-post-tool-checks.cjs
Responsibilities:
- orchestrate guarded post-tool commands
- avoid failing due to missing scripts or missing prettier dependency where possible
- preserve a single hook entry in `format.json`

Current per-stack behavior:
- backend:
  - `dotnet format --verify-no-changes`
  - `dotnet build --no-incremental`
  - `dotnet format`
- frontend:
  - `npm run lint` when `lint` script exists
  - `npm run build` when `build` script exists
  - `npx --no-install prettier --write .` when local prettier dependency exists
- other stacks:
  - log skip message and exit successfully

## 6) Runtime Flow B: Git Pre-Push Gate

Git hook entry point:
- `.githooks/pre-push`

Execution flow:
1. git invokes `.githooks/pre-push`
2. the shell wrapper runs `node .github/hooks/pre-push-audit-gate.js`
3. the gate loads `.github/hooks/pre-push-audit-gate.config.json`
4. push is blocked if audit/vulnerability requirements fail

### .githooks/pre-push
Responsibilities:
- act as the executable git hook entrypoint
- forward execution into the Node-based gate script
- preserve non-zero exit behavior when the gate fails

Important note:
- this hook runs only when git is configured to use `.githooks` as `core.hooksPath`, or when the hook is otherwise installed into `.git/hooks`

### pre-push-audit-gate.config.json
Responsibilities:
- define report directory
- define allowed audit report filename patterns
- define freshness window for latest required report

Current defaults:
- `reportsDir`: `reports/audits/full-codebase`
- `maxAuditAgeHours`: `24`
- `reportPatterns`:
  - `AuditReport_*.md`
  - `QAAuditReport_*.md`

### pre-push-audit-gate.js
Responsibilities:
- locate the latest matching audit report
- fail if no report exists
- fail if the latest report is stale
- parse the `## Key Findings` section and fail on Critical findings
- run Node vulnerability scan via `npm audit` when applicable
- run .NET vulnerability scan via `dotnet list package --vulnerable` when applicable

## 7) Maintainer Change Rules

When editing hook files:
1. keep `.github/hooks/*` and pack mirror files aligned for managed assets
2. keep `.githooks/pre-push` and its pack mirror aligned
3. do not bind runtime hook logic to audit prompt-only policy files unless that coupling is explicitly intended
4. prefer one small entrypoint file with heavier logic in script files over long shell command strings
5. preserve executable permissions on `.githooks/pre-push`

## 8) Common Risks

Be careful about:
- changing hook entry paths without updating pack mirrors
- introducing shell-specific behavior that breaks on Windows
- making hook scripts depend on tools that may not exist in mixed or uninitialized workspaces
- turning advisory checks into hard failures without documenting the behavioral change
- forgetting to re-sync manifest metadata after adding, removing, or renaming managed hook files

## 9) Validation Checklist

After editing hook files:
1. Run `node --check .github/hooks/detect-stack.cjs` when that file changes.
2. Run `node --check .github/hooks/run-post-tool-checks.cjs` when that file changes.
3. Run `node --check .github/hooks/pre-push-audit-gate.js` when that file changes.
4. Run `node .github/hooks/run-post-tool-checks.cjs` for a lightweight runtime check.
5. Run `node .github/hooks/pre-push-audit-gate.js` only when audit-report prerequisites are intentionally available for validation.
6. Confirm pack mirror files match the intended root-managed files.
7. Run `node .github/initializer/tools/sync-seed-manifest.js`.

## 10) When To Update This Guide

Update this guide when:
- hook entrypoints are added, removed, or renamed
- stack detection behavior changes
- guarded post-tool commands change
- pre-push gate criteria change
- pack mirroring rules for hook files change
