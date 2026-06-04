# Build Feature From Story and Figma

## Purpose
Guide users through implementing a frontend feature from a user story, acceptance criteria, and a Figma reference while staying aligned with existing project patterns.

## Use This Playbook When
- implementing a new frontend feature from a defined story
- translating a Figma design into production-ready UI
- extending an existing screen without introducing a new architecture pattern

## Inputs
- user story
- acceptance criteria
- target area in the codebase
- target component name if known
- attached Figma screenshot or design reference
- applicable standards resolved through `config/standards-resolution-policy.json`, `config/client-profiles.json`, and `config/standards-catalog.json`

## Recommended Workflow
1. Define the target feature boundary and owning area in the codebase.
2. Run `/build-feature-from-story-and-figma`.
3. Review similar existing screens, components, forms, and interaction patterns first.
4. Confirm the implementation plan covers UI sections, state, validations, interactions, and API/service touchpoints.
5. Prefer modifying existing components and shared utilities before creating new ones.
6. Validate loading, error, empty, disabled, and success states where relevant.
7. Add or update tests for critical rendering and interaction paths.

## Quality Checklist
- New UI follows existing structure, naming, and composition patterns.
- Shared components, hooks, types, constants, and utilities are reused where appropriate.
- Business logic is not embedded deeply in JSX.
- Large UI is split into maintainable subcomponents when needed.
- Story requirements and acceptance criteria are fully implemented.

## Expected Output
- Implementation plan
- File change summary
- Production-ready frontend code updates
- Updated or added tests

## Notes
- Use the Figma screenshot as a visual reference, not as a reason to bypass project patterns.
- Prefer refactoring duplication over creating parallel implementations.
