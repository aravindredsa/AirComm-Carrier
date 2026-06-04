# Plan Feature From Story and Figma

## Purpose
Guide users through producing an implementation-ready frontend plan from a user story, acceptance criteria, and Figma reference before writing code.

## Use This Playbook When
- you want a reviewed plan before implementation starts
- the feature is large enough to benefit from an explicit handoff artifact
- you want reuse decisions documented before code is written

## Inputs
- user story
- acceptance criteria
- target area in the codebase
- target component name if known
- attached Figma screenshot or design reference
- output file path under `artifacts/feature-plans/`
- applicable standards resolved through `config/standards-resolution-policy.json`, `config/client-profiles.json`, and `config/standards-catalog.json`

## Output Location
- Save plans under `artifacts/feature-plans/`
- Recommended naming: `FeatureImplementationPlan_<feature-or-area>_<YYYY-MM-DD>.md`

## Recommended Workflow
1. Define the target feature boundary and owning area in the codebase.
2. Run `/plan-feature-from-story-and-figma`.
3. Review similar existing screens, components, hooks, utilities, and services identified by the prompt.
4. Confirm the plan covers UI sections, state, validations, interactions, API/service touchpoints, files to update, and tests.
5. Validate the reuse section before approving implementation.
6. Use the resulting plan artifact as the input for `/build-feature-from-plan`.

## Quality Checklist
- The plan names concrete existing files, utilities, hooks, or components to reuse.
- The plan clearly separates update targets from new files.
- Any new shared utility is justified only after reuse options are checked.
- UI, state, validation, interactions, and testing are covered with enough detail for implementation.
- Assumptions and open questions are explicit.

## Expected Output
- A saved markdown plan artifact in `artifacts/feature-plans/`
- A summary of existing patterns found
- A file-level implementation outline
- Clear reuse and gap analysis

## Notes
- This workflow creates a plan only and does not modify application code.
- Use `templates/feature-implementation-plan-template.md` as the structure for the saved artifact.