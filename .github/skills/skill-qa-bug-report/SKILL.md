---
name: skill-bug-report
description: Shared method for writing ADO-ready QA bug reports from defect evidence.
---

# Skill: Bug Report

## Purpose
Provide a reusable defect-reporting method so prompts can focus on evidence and output format while this skill handles severity, priority, and reproduction discipline.

## Inputs
- Environment context supplied by the user
- Defect description, screenshots, logs, or other evidence
- Prompt-defined report path and naming convention

## Method
1. Collect the exact environment and failure description.
2. Extract visible evidence from screenshots or written details.
3. Classify severity and priority using only the provided evidence.
4. Write reproduction steps that are specific and sequential.
5. State expected versus actual results precisely.
6. Add possible causes only when supported by evidence.

## Quality Rules
- Do not invent missing context or infer scope beyond the evidence.
- Use exact labels, messages, and visible outcomes when available.
- Keep severity and priority independent and justified.
- Make the report reproducible without follow-up questions.

## Constraints
- If the environment or description is missing, stop and request it.
- If a screenshot is provided, use it as evidence, not as a design source.
- Do not fabricate root cause details.

## Output Rules
- Save the report under `reports/bug-reports/`.
- Use the prompt's filename and template requirements exactly.
- Verify the final report before output.