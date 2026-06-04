---
name: skill-db-audit-and-quality
description: Shared method for DB artifact audits and output-quality evaluation across schema, data dictionary, ER, and SQL deliverables.
---

# Skill: DB Audit and Quality

## Purpose
Provide a reusable method for auditing DB artifacts and evaluating generated output quality so prompts can focus on report format and scoring rules.

## Inputs
- DB artifacts in scope, such as data dictionaries, schema scripts, ER diagrams, and stored procedures
- Prompt-defined scoring rubric, report path, and artifact focus
- Standards resolved through `config/standards-resolution-policy.json`, `config/client-profiles.json`, and `config/standards-catalog.json`, applying shared standards first and then the resolved domain, capability, and client overlay standards

## Method
1. Determine the audit or evaluation scope.
2. Collect evidence from the relevant DB artifacts.
3. Compare artifacts for consistency, naming, and completeness.
4. Score or classify findings using the prompt's rubric.
5. Produce a concise report with concrete remediation guidance.

## Quality Rules
- Every finding must cite a concrete artifact and location.
- Do not score hypothetical issues.
- Keep the report evidence-based and reproducible.
- Prioritize correctness, consistency, and naming compliance.

## Constraints
- Do not audit or evaluate artifacts outside the defined scope.
- Do not invent missing schema, SP, or lookup details.
- Preserve the prompt's output format and severity rules as final authority.

## Output Rules
- Store reports in the prompt-defined output folder.
- Use the prompt's headings, scoring model, and naming rules exactly.