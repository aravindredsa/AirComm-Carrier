# Update TC/TS From Figma

## Purpose
Guide users through updating an existing QA package after story, Figma, or code changes.

## Inputs
- Existing baseline from `docs/test-cases/`
- Updated story, Figma, and source code evidence

## Recommended Workflow
1. Run `/update-tc-ts-figma`.
2. Detect and map deltas against baseline artifacts.
3. Apply targeted updates using `templates/update-tc-ts-figma-template.md`.
4. Refresh both test-case and scenario-plan outputs.

## Output
- Updated QA test-case package and scenario-plan package with preserved stable IDs.
