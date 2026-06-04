# Refine User Story Backend

## Purpose
Guide users through refining backend user stories for service contracts, validation behavior, error handling, and system interactions.

## Inputs
- feature scope and business rules
- API contracts and integration constraints
- persistence and authorization context

## Recommended Workflow
1. Confirm backend scope and impacted components.
2. Run `/ba-refine-user-story-backend`.
3. Validate coverage for contracts, auth, data behavior, and side effects.
4. Confirm positive and negative scenarios are implementation-ready.
5. Save final artifacts to `artifacts/user-stories/`.

## Output
- `artifacts/user-stories/UserStoriesBackend_<YYYY-MM-DD>.md`
- `artifacts/user-stories/UserStoriesBackend_<YYYY-MM-DD>.docx`

## Notes
- Keep backend acceptance outcomes deterministic and observable.
