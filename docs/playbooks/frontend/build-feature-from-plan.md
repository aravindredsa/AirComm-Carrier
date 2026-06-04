# Build Feature From Plan

## Purpose
Guide users through implementing a frontend feature from an approved plan artifact while enforcing reuse-first decisions.

## Use This Playbook When
- you already have an approved feature plan artifact
- you want implementation to follow an explicit reviewed scope
- you want the workflow to verify reuse before creating new utilities or abstractions

## Inputs
- approved plan file path
- optional implementation constraints
- applicable standards resolved through `config/standards-resolution-policy.json`, `config/client-profiles.json`, and `config/standards-catalog.json`

## Recommended Workflow
1. Ensure the plan exists under `artifacts/feature-plans/` and is implementation-ready.
2. Run `/build-feature-from-plan`.
3. Verify that the prompt reads the plan before coding.
4. Confirm the implementation re-checks the repo for utilities, hooks, components, and services named in the plan.
5. Reuse suitable existing utilities first.
6. Create new shared utilities only when no suitable reusable option exists.
7. Add or update tests for the main rendering and interaction paths.

## Quality Checklist
- Implementation follows the approved plan or documents justified deviations.
- Existing components, hooks, helpers, and utilities are reused where suitable.
- Any new utility is explicitly justified.
- Large UI is split into maintainable subcomponents when needed.
- Tests cover key states and user actions.

## Expected Output
- Files created or updated
- Production-ready code changes
- Updated or added tests
- Reuse summary and any deviations from the plan

## Notes
- Use this prompt after planning when you want a controlled two-step delivery workflow.
- The original `/build-feature-from-story-and-figma` prompt remains available for one-step implementation.