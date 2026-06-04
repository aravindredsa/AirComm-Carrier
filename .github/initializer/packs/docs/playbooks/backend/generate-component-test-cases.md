# Generate Component Test Cases

## Purpose
Guide users through generating component-level frontend test cases for render behavior and user interaction paths.

## Inputs
- Feature name
- Relevant components, props, and state behavior
- Standards resolved through `config/standards-resolution-policy.json`, `config/client-profiles.json`, and `config/standards-catalog.json`, applying shared standards first and then the resolved testing-related capability and client overlay standards

## Recommended Workflow
1. Identify the feature and the components in scope.
2. Run `/generate-component-test-cases`.
3. Review coverage for render states, user interactions, accessibility, and edge cases.
4. Save or refine the generated cases before QA review.

## Output
- Component test cases saved to `test-assets/manual/component/`
