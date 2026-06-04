# Auto Finalizer Release Policy Reference

## Purpose
This guide explains how the auto finalizer chooses a release type (major, minor, or patch), and what the three explicit finalizer tasks do.

## Auto Finalizer
Task label:
- initializer: finalize distribution zip (auto)

Command:
- node .github/initializer/tools/finalize-distribution.js --release=auto

When auto mode runs, it compares managed source changes since the last distribution baseline and applies the highest required release type from the rules below.

## Policy Rules (Auto Determination)
Rules are applied in this order:

1. Major
- Trigger: a prompt is added or removed.
- Path match:
  - .github/initializer/packs/prompts/
  - .github/prompts/

2. Minor
- Trigger: any change in prompts/templates/agents/skills/hooks managed areas.
- Path match includes:
  - .github/initializer/packs/prompts/
  - .github/initializer/packs/templates/
  - .github/initializer/packs/agents/
  - .github/initializer/packs/skills/
  - .github/initializer/packs/root/.github/hooks/
  - .github/skills/
  - agents/

3. Patch
- Trigger: all detected changes are docs-reference-only.
- Path match is limited to:
  - .github/initializer/packs/docs/
  - docs/

4. Fallback
- If changes are managed but do not match docs-only patch scope, auto defaults to minor.

## Explicit Finalizers (Owner Override)
These three tasks allow the owner to force a specific bump and bypass release-type enforcement checks:

1. initializer: finalize distribution zip (patch)
- Command: node .github/initializer/tools/finalize-distribution.js --release=patch --no-release-check

2. initializer: finalize distribution zip (minor)
- Command: node .github/initializer/tools/finalize-distribution.js --release=minor --no-release-check

3. initializer: finalize distribution zip (major)
- Command: node .github/initializer/tools/finalize-distribution.js --release=major --no-release-check

Use these override tasks only when you intentionally want a fixed release type regardless of auto policy.

## Related Task
- initializer: finalize distribution zip (prune deleted)
- Command: node .github/initializer/tools/finalize-distribution.js --release=patch --prune-deleted
- Purpose: removes deleted managed files from pack sources while finalizing.
