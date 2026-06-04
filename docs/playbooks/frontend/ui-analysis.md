# UI Analysis Playbook

## Purpose
Guide users through generating a complete UI analysis document from source materials without inventing behavior.

## Use This Playbook When
- documenting UI behavior from legacy requirements or screenshots
- preparing implementation or QA from existing source documents
- extracting field rules, validations, and workflow behavior into a structured analysis

## Inputs
- attached source documents
- applicable standards resolved through `config/standards-resolution-policy.json`, `config/client-profiles.json`, and `config/standards-catalog.json`
- template in `templates/ui-analysis-template.md`

## Recommended Workflow
1. Confirm the attached source documents are the only approved source of truth.
2. Run `/ui-analysis-prompt`.
3. Verify the output includes every field, validation, trigger, workflow rule, and state transition present in the source materials.
4. Confirm no placeholders or invented rules remain in the final document.
5. Save the final markdown and Word outputs in `artifacts/ui-analysis/` using date-stamped filenames.

## Quality Checklist
- Every UI field appears in the Inputs & Field Rules table.
- Conditional visibility, prepopulation, and validation logic are explicit.
- Use cases are written step-by-step rather than summarized.
- Acceptance criteria map to concrete functional behavior.
- Output remains faithful to the source documents only.

## Expected Output
- One UI analysis document in markdown
- One UI analysis document in Word format
- Filename pattern: `UI_Analysis_<YYYY-MM-DD>.md` and `.docx`

## Notes
- This playbook is for human execution guidance; the prompt contains the extraction rules.
- Use this when implementation or QA needs a normalized UI behavior reference.
