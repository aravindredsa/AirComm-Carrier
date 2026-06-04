# Evaluate Reverse Engineer Document

## Purpose
Guide users through evaluating reverse-engineering documents for completeness, evidence quality, and implementation readiness.

## Inputs
- reverse-engineer analysis document under review
- evaluation criteria from the prompt rubric
- template `templates/ba/evaluation-matrix-template.md`

## Recommended Workflow
1. Identify the target reverse-engineering artifact to assess.
2. Run `/ba-evaluate-reverse-engineer-document`.
3. Score each required dimension with evidence-backed comments.
4. Capture prioritized defects, risks, and correction actions.
5. Save the evaluation output under `reports/evaluations/`.

## Output
- Evaluation report in markdown format under `reports/evaluations/`

## Notes
- Keep scoring evidence-based and aligned to the prompt's final authority.
