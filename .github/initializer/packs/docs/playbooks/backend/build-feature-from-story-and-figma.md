# Build Feature From Story and Figma

## Purpose
Guide users through implementing a backend feature from a user story, acceptance criteria, and supporting artifacts.

## Inputs
- User story
- Acceptance criteria
- Target backend area
- Target endpoint or service name
- Reference artifacts such as Figma screenshots, payload examples, or workflow notes

## Recommended Workflow
1. Gather the story, acceptance criteria, and all supporting artifacts.
2. Run `/build-feature-from-story-and-figma`.
3. Review the proposed implementation plan, reused patterns, and files to update.
4. Validate the generated code against project service, repository, and API patterns.
5. Run or update unit tests for changed backend behavior.

## Output
- Backend code changes in the repository
- Updated unit tests
- Summary of assumptions, refactoring, and follow-up items
