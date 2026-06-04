# Evaluate Output Quality Playbook

## Purpose
Guide users through reviewing generated artifacts against quality expectations and identifying gaps before sharing results.

## Use This Playbook When
- reviewing AI-generated documentation or analysis
- checking deliverables before sending to stakeholders
- scoring completeness, clarity, structure, and evidence quality

## Inputs
- target artifact to review
- relevant standards resolved through `config/standards-resolution-policy.json`, `config/client-profiles.json`, and `config/standards-catalog.json`
- acceptance criteria or expected output rubric

## Recommended Workflow
1. Run `/evaluate-output-quality`.
2. Review the artifact against the applicable standards and expected structure.
3. Confirm completeness, clarity, consistency, and actionability.
4. Record deficiencies, risks, and remediation recommendations.
5. Save the evaluation in the appropriate report location.

## Quality Checklist
- Findings are specific and evidence-based.
- Missing sections or weak areas are clearly called out.
- Recommendations are actionable rather than generic.
- The evaluation is understandable to both authors and reviewers.

## Expected Output
- One quality evaluation report in markdown

## Notes
- Use this after major AI-generated outputs and before formal review or handoff.
