# Refine User Story QA

## Purpose
Guide users through refining QA-focused user stories with risk-based test design and clear quality gates.

## Inputs
- feature scope and acceptance criteria
- API/UI references and integration dependencies
- environment and test-data constraints

## Recommended Workflow
1. Confirm risk profile and validation scope.
2. Run `/ba-refine-user-story-qa`.
3. Validate positive, negative, boundary, and integration coverage.
4. Confirm test design matrix and automation candidacy are complete.
5. Save final artifacts to `artifacts/user-stories/`.

## Output
- `artifacts/user-stories/UserStoriesQA_<YYYY-MM-DD>.md`
- `artifacts/user-stories/UserStoriesQA_<YYYY-MM-DD>.docx`

## Notes
- Ensure traceability from story requirements to test scenarios.
