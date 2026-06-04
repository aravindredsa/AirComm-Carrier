# Generate TC/TS From Figma

## Purpose
Guide users through generating first-time QA test cases and scenario plans from story, Figma, and source code.

## Inputs
- User story with acceptance criteria and business rules
- Figma evidence (link, exports, or screenshots)
- Source code evidence for the feature

## Recommended Workflow
1. Run `/generate-tc-ts-from-figma`.
2. Validate required inputs and resolve any missing-inputs block.
3. Generate the QA package using `templates/generate-tc-ts-from-figma-template.md`.
4. Save test cases under `docs/test-cases/` and scenario plans under `docs/test-scenarios/`.

## Output
- Feature-specific QA test-case package and scenario-plan package.
