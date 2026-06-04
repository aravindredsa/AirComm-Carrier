# Plan Feature From Story and Figma

## Purpose
Guide users through producing an implementation-ready backend plan from a user story, acceptance criteria, and supporting requirement artifacts before writing code.

## Inputs
- user story
- acceptance criteria
- target backend area
- target endpoint or service name if known
- reference artifacts such as Figma screenshots, payload examples, or workflow notes
- output file path under `artifacts/feature-plans/`

## Output Location
- Save plans under `artifacts/feature-plans/`
- Recommended naming: `FeatureImplementationPlan_<feature-or-area>_<YYYY-MM-DD>.md`

## Recommended Workflow
1. Gather the story, acceptance criteria, and all supporting artifacts.
2. Run `/plan-feature-from-story-and-figma`.
3. Review similar endpoints, services, repositories, validators, DTOs, mappers, and workflow patterns identified by the prompt.
4. Confirm the plan covers contracts, validations, business rules, data access, integration points, files to update, and tests.
5. Validate the reuse section before approving implementation.
6. Use the resulting plan artifact as the input for `/build-feature-from-plan`.

## Quality Checklist
- The plan names concrete existing files, services, validators, helpers, repositories, or mappers to reuse.
- The plan clearly separates update targets from new files.
- Any new shared utility is justified only after reuse options are checked.
- Contracts, rules, integrations, and tests are covered with enough detail for implementation.
- Assumptions and open questions are explicit.

## Output
- A saved markdown plan artifact in `artifacts/feature-plans/`
- A summary of existing patterns found
- A file-level implementation outline
- Clear reuse and gap analysis

## Notes
- This workflow creates a plan only and does not modify application code.
- Use `templates/feature-implementation-plan-template.md` as the structure for the saved artifact.