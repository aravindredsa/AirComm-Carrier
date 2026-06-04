# Generate Functional Requirements

## Purpose
Guide users through creating a complete Functional Requirements Document (FRD) from validated source inputs.

## Inputs
- source requirement documents and supporting notes
- modernization UI evidence and screenshots
- template `templates/ba/functional-reqs-doc-template.md`

## Recommended Workflow
1. Confirm required inputs are attached and in scope.
2. Run `/ba-generate-functional-requirements`.
3. Validate every template section is fully populated with no placeholders.
4. Confirm wording is business-readable and non-technical where required.
5. Save final artifacts to `artifacts/functional-requirements/`.

## Output
- `artifacts/functional-requirements/FunctionalRequirements_<YYYY-MM-DD>.md`
- `artifacts/functional-requirements/FunctionalRequirements_<YYYY-MM-DD>.docx`

## Notes
- Use one runtime-resolved date for filename and document date fields.
- Keep this as user guidance; prompt and skill remain the execution source.
