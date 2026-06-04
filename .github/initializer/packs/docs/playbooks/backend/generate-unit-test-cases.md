# Generate Unit Test Cases

## Purpose
Guide users through generating unit-level test cases for isolated business logic coverage.

## Inputs
- Feature name
- Relevant classes and methods
- Applicable testing standards

## Recommended Workflow
1. Identify the services, handlers, controllers, or entities in scope.
2. Run `/generate-unit-test-cases`.
3. Review the generated cases for happy path, boundary, null or empty, and exception scenarios.
4. Convert approved cases into executable tests in the matching test project.

## Output
- Unit test cases saved to `artifacts/test-cases/unit/`
