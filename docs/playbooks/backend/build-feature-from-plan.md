# Build Feature From Plan

## Purpose
Guide users through implementing a backend feature from an approved plan artifact while enforcing reuse-first decisions.

## Inputs
- approved plan file path
- optional implementation constraints

## Recommended Workflow
1. Ensure the plan exists under `artifacts/feature-plans/` and is implementation-ready.
2. Run `/build-feature-from-plan`.
3. Verify that the prompt reads the plan before coding.
4. Confirm the implementation re-checks the repo for services, repositories, validators, helpers, mappers, and integration patterns named in the plan.
5. Reuse suitable existing utilities first.
6. Create new shared utilities only when no suitable reusable option exists.
7. Add or update tests for the main service and repository interaction paths.

## Quality Checklist
- Implementation follows the approved plan or documents justified deviations.
- Existing services, repositories, validators, helpers, and utilities are reused where suitable.
- Any new utility is explicitly justified.
- Large classes or methods are split or refactored when needed.
- Tests cover key happy path, boundary, and failure scenarios.

## Output
- Files created or updated
- Production-ready backend code changes
- Updated or added tests
- Reuse summary and any deviations from the plan

## Notes
- Use this prompt after planning when you want a controlled two-step delivery workflow.
- The original `/build-feature-from-story-and-figma` prompt remains available for one-step implementation.