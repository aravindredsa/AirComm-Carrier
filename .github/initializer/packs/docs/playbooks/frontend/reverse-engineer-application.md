# Reverse Engineer Application Playbook

## Purpose
Guide humans on how to run reverse-engineering analysis consistently and review output quality before sharing results.

## Use This Playbook When
- onboarding a team to a legacy module
- preparing migration discovery
- documenting current behavior before redesign

## Inputs
- target scope (application, module, or feature folder)
- source code and related configuration
- applicable standards resolved through `config/standards-resolution-policy.json`, `config/client-profiles.json`, and `config/standards-catalog.json`
- template in `templates/reverse-engineering-design-template.md`

## Recommended Workflow
1. Define scope and boundaries.
2. Run `/reverse-engineer-application`.
3. Verify output covers current behavior, not proposed design.
4. Validate key sections: context, components, business rules, process flow, risks.
5. Confirm unknowns and assumptions are explicitly listed.
6. Save approved output in `artifacts/reverse-engineer-analysis/`.

## Quality Checklist
- Analysis is neutral and evidence-based.
- Rules include defaults, visibility logic, and mandatory/optional conditions.
- Contradictions and undocumented behavior are clearly called out.
- Risks are grouped by impact and likelihood.
- No domain-specific labels are introduced when generic wording is required.

## Expected Output
- One reverse-engineering analysis document in markdown.
- Filename pattern: `DesignDoc_<Scope>_<YYYY-MM-DD>.md`.

## Notes
- This file is a human operating guide.
- Keep execution instructions in the prompt file and task method details in the skill file.

## Quality Checklist
- Analysis is neutral and evidence-based.
- Rules include defaults, visibility logic, and mandatory/optional conditions.
- Contradictions and undocumented behavior are clearly called out.
- Risks are grouped by impact and likelihood.
- No domain-specific labels are introduced when generic wording is required.

## Expected Output
- One reverse-engineering analysis document in markdown.
- Filename pattern: `DesignDoc_<Scope>_<YYYY-MM-DD>.md`.

## Notes
- This file is a human operating guide.
- Keep execution instructions in the prompt file and task method details in the skill file.
