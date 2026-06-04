# Generate Unit Test Cases Playbook

## Purpose
Guide users through scanning the codebase for unit-test gaps and generating missing tests using the unit-test prompt workflow.

## Use This Playbook When
- new non-trivial code has been added
- existing logic changed and tests need coverage updates
- you want a structured unit-test gap analysis before coding tests manually

## Inputs
- target repository or feature area
- existing test suite and resolver-selected test framework configuration
- applicable standards resolved through `config/standards-resolution-policy.json`, `config/client-profiles.json`, and `config/standards-catalog.json`
- template in `templates/test-case-unit-template.md` when relevant

## Recommended Workflow
1. Run `/generate-unit-test-cases`.
2. Let the prompt scan source files, test files, and test configuration.
3. Review identified gaps and priority areas.
4. Allow the prompt to generate tests automatically in Phase 3.
5. Review coverage for important states, edge cases, and failure paths.

## Quality Checklist
- Tests cover main logic branches and important edge cases.
- Mocks follow existing project patterns.
- Assertions are behavior-focused rather than snapshot-heavy.
- Generated tests align with existing naming and setup conventions.

## Expected Output
- New or updated unit test files in the project test locations
- Coverage-oriented summary of missing and added tests

## Notes
- Use this for units such as services, hooks, utilities, stores, and component logic.
- Pair with component-test generation when UI rendering behavior also changed.
