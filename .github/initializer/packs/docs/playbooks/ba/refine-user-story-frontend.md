# Refine User Story Frontend

## Purpose
Guide users through refining frontend user stories with explicit UI behavior, state coverage, validations, and dependencies.

## Inputs
- feature scope and navigation context
- UI references (Figma/screenshots)
- API dependencies and constraints

## Recommended Workflow
1. Collect feature context and UI evidence.
2. Run `/ba-refine-user-story-frontend`.
3. Validate full UI state matrix coverage: default, loading, empty, success, error, permission denied.
4. Confirm positive and negative scenarios are explicit and testable.
5. Save final artifacts to `artifacts/user-stories/`.

## Output
- `artifacts/user-stories/UserStoriesFrontend_<YYYY-MM-DD>.md`
- `artifacts/user-stories/UserStoriesFrontend_<YYYY-MM-DD>.docx`

## Notes
- Ensure backend/API and shared-component dependencies are explicit in each story.
