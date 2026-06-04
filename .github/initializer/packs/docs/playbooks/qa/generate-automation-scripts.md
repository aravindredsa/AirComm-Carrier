# Generate Automation Scripts

## Purpose
Guide users through generating resolver-selected automation stack automation assets from approved test cases and scenario plans.

## Inputs
- Feature name
- Test-case artifacts in `docs/test-cases/`
- Scenario-plan artifacts in `docs/test-scenarios/`
- DOM/HTML evidence for locator extraction

## Recommended Workflow
1. Run `/generate-automation-scripts`.
2. Execute phase pipeline in order (locators, enums, page objects, tests, validation, review).
3. Confirm outputs against `templates/generate-automation-scripts-template.md`.
4. Validate generated artifacts before handoff.

## Output
- Enums, page objects, test classes, and validation/review notes for the feature.
