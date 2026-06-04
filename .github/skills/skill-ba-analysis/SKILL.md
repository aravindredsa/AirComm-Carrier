---
name: skill-ba-analysis
description: Shared business-analysis document generation method for functional requirements, gap analysis, and UI analysis workflows.
---

# Skill: BA Analysis

## Purpose
Provide a consistent analysis framework for BA document workflows while preserving each prompt's specific template and output requirements.

## Inputs
- Source requirement documents and supporting artifacts
- Prompt-specific template path and artifact destination
- Applicable standards and constraints from workspace guidance

## Method
1. Extract all explicit requirements, rules, fields, validations, workflows, and dependencies from source inputs.
2. Normalize and reconcile overlapping or conflicting statements.
3. Organize output using the exact prompt-required template/structure.
4. Validate section completeness and internal consistency before final output.

## Quality Rules
- No invented behavior beyond source evidence.
- No placeholders or missing required sections.
- Keep language precise and usable by Product, Engineering, and QA stakeholders.

## Constraints
- Treat prompt-specific output schema as mandatory.
- Preserve required filenames, date conventions, and artifact folder rules.
- Keep detail exhaustive when source artifacts provide detail.

## Output Rules
- Produce complete, review-ready analysis artifacts.
- Include assumptions only when unavoidable, and label them clearly.
- Respect prompt-specific formatting and section ordering as final authority.
