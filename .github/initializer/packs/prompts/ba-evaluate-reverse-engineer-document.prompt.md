---
agent: ask
description: Evaluate reverse engineering document quality and generate a structured assessment report
---

## Skill Dependency (Mandatory)
- Apply `.github/skills/skill-ba-reverse-engineer-application/SKILL.md` before executing this workflow.
- Keep this prompt's evaluation criteria and output rules as final authority when more specific.

---

# Evaluate Reverse Engineering Document

## Purpose
Evaluate a reverse-engineering document for completeness, clarity, technical accuracy, and actionability.

## Inputs
- Reverse-engineering output document(s) to review from `artifacts/reverse-engineer-analysis/` (single file or folder scope)
- Standards resolved through `config/standards-resolution-policy.json`, `config/client-profiles.json`, and `config/standards-catalog.json`
- Reverse-engineering template from `templates/ba/reverse-engineering-design-template.md` (used as rubric, not as the primary evaluation target)

## Evaluation Criteria
Score each dimension from 0 to 10 and provide evidence.

1. Structure Compliance
- Follows expected sections from the template
- Uses clear headings and consistent formatting

2. Technical Completeness
- Covers architecture, modules, dependencies, and data flow
- Includes integrations, external systems, and configuration behavior

3. Behavioral Accuracy
- Describes actual current behavior (not desired-state assumptions)
- Includes both happy path and important alternate/error paths

4. Business Rule Capture
- Identifies explicit and inferred business rules
- Includes confidence level and source references where possible

5. Risks and Gaps
- Identifies unknowns, assumptions, and blockers
- Flags security/performance/operational risks

6. Actionability
- Output can be used by development, QA, and architecture teams
- Recommendations are concrete and prioritized

## Process
1. Review the provided reverse-engineering output document(s) from `artifacts/reverse-engineer-analysis/`.
2. Compare content against standards and template expectations.
3. Score each evaluation dimension with evidence-backed notes.
4. Record critical findings and prioritized improvements.
5. Save a report in `reports/evaluations/`.

## Output
Create `ReverseEngineeringEvaluation_<YYYY-MM-DD>.md` under `reports/evaluations/` with:

### Date Stamp Rules (mandatory)
- Resolve `<YYYY-MM-DD>` from the current local run date at execution time (not from examples, memory, or prior runs).
- Optional command guidance: on macOS/Linux use `date +%F`; on Windows PowerShell use `Get-Date -Format yyyy-MM-dd`.
- Use one resolved `RUN_DATE` value consistently for filename and any report date fields.
- Do not hardcode year/month/day values.
- Before finalizing, validate the output filename date equals the current local date.
- If the filename date is incorrect, correct it immediately (rename/regenerate) before completing.

- Document scope reviewed
- Dimension-wise scores table
- Key findings (critical, major, minor)
- Missing sections or weak evidence areas
- Priority improvements (P1, P2, P3)
- Final readiness verdict (`Ready`, `Needs Revision`, `Not Ready`)

## Guardrails
- Do not invent facts not present in the reviewed document or source.
- Keep findings evidence-based and file-specific.
- Prefer concise, scan-friendly markdown tables and bullets.

## Prompt Usage Logging (Required)

After successful completion of this workflow, run:

```bash
node .github/initializer/tools/log-prompt-usage.js --prompt-path=.github/prompts/ba-evaluate-reverse-engineer-document.prompt.md
```
