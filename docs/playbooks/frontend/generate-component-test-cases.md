# Generate Component Test Cases Playbook

## Purpose
Guide users through identifying UI component coverage gaps and generating missing component tests.

## Use This Playbook When
- a UI component is new or modified
- component behavior changed and rendering or interaction coverage is needed
- you want a structured review of missing component test scenarios

## Inputs
- target repository or component area
- existing component tests and resolver-selected test framework setup
- applicable standards resolved through `config/standards-resolution-policy.json`, `config/client-profiles.json`, and `config/standards-catalog.json`
- component behavior expectations

## Recommended Workflow
1. Run `/generate-component-test-cases`.
2. Review discovered components, existing tests, and missing coverage areas.
3. Allow the prompt to generate missing tests automatically.
4. Check important render, interaction, empty, error, loading, and accessibility states.
5. Confirm tests align with current component structure and mocks.

## Quality Checklist
- Tests cover visible UI behavior and user interactions.
- Conditional rendering and validation states are included.
- Component tests remain stable and avoid brittle implementation details.
- Existing test helpers and patterns are reused.

## Expected Output
- New or updated component test files
- Coverage-oriented summary of detected gaps and implemented tests

## Notes
- Use this playbook specifically for UI components rather than service or utility logic.
- Prefer behavioral assertions and screen-level outcomes.
