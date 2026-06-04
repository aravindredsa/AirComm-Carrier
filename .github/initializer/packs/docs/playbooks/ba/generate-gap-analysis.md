# Generate Gap Analysis

## Purpose
Guide users through producing a structured gap analysis between legacy behavior and target requirements.

## Inputs
- reverse-engineering analysis artifacts
- functional requirements artifacts
- modernization constraints and assumptions
- template `templates/ba/gap-analysis-template.md`

## Recommended Workflow
1. Gather baseline and target artifacts for the same scope.
2. Run `/ba-generate-gap-analysis`.
3. Validate each gap includes current state, target state, impact, and recommendation.
4. Confirm all high-risk or blocking gaps are prioritized.
5. Save final artifacts to `artifacts/gap-analysis/`.

## Output
- `artifacts/gap-analysis/GapAnalysis_<YYYY-MM-DD>.md`
- `artifacts/gap-analysis/GapAnalysis_<YYYY-MM-DD>.docx`

## Notes
- Do not invent gaps; each item should be grounded in provided evidence.
