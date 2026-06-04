# Generate Integration Test Cases

## Purpose
Guide users through generating integration test cases across service, repository, and data boundaries.

## Inputs
- Feature name
- API, service, or repository boundaries
- Data dependencies and workflow context

## Recommended Workflow
1. Identify the cross-layer behaviors that need validation.
2. Run `/generate-integration-test-cases`.
3. Review the generated cases for persistence effects, workflow coverage, and explicit assertions.
4. Save or refine the cases before implementation or QA handoff.

## Output
- Integration test cases saved to `test-assets/manual/integration/`
