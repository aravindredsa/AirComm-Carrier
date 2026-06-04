# Evaluate Reverse Engineer Document Playbook

## Purpose
Guide users through reviewing a reverse-engineered analysis document for completeness, quality, and fidelity to the source implementation.

## Use This Playbook When
- validating a generated reverse-engineering document before distribution
- checking whether analysis is complete enough for architecture or migration planning
- comparing document quality against the expected reverse-engineering rubric

## Inputs
- reverse-engineered analysis document
- reverse-engineering standards or expected section requirements
- template in `templates/reverse-engineering-design-template.md` as a rubric

## Recommended Workflow
1. Run `/BA_evaluate-reverse-engineer-document`.
2. Check section completeness against the required structure.
3. Verify the document captures behavior, risks, and unknowns without drifting into proposed design.
4. Confirm business rules, dependencies, process flow, and migration-impact analysis are covered.
5. Save the evaluation output with the related review artifacts.

## Quality Checklist
- The document reflects current-state behavior, not solutioning.
- Risks, inconsistencies, and undocumented behaviors are explicit.
- Major required sections are present and sufficiently detailed.
- Unknowns and assumptions are clearly separated from confirmed findings.

## Expected Output
- One evaluation report for the reverse-engineering document

## Notes
- Use this as a quality gate before circulating reverse-engineering analysis broadly.
