---
name: skill-db-change-management
description: Shared method for DB gap analysis, schema change impact assessment, and review comment resolution across DB artifacts.
---

# Skill: DB Change Management

## Purpose
Provide a reusable change-analysis method so prompts can focus on diff scope, artifact regeneration, and consistency validation.

## Inputs
- Data Dictionary, schema script, ER diagram, stored procedures, and related artifacts
- Schema change description or customer review comments
- Prompt-defined output targets

## Method
1. Identify the impacted artifacts and the exact changed elements.
2. Compare data dictionary, schema, ER diagram, seed scripts, and SPs for mismatches.
3. Classify the impact and risk of each discrepancy.
4. Regenerate updated artifacts when required.
5. Verify cross-artifact consistency after changes.

## Quality Rules
- Never delete accepted rows from the Data Dictionary unless the prompt explicitly allows it.
- Preserve backward-compatible intent unless the change requires a breaking update.
- Flag missing relationships, orphan references, and undeclared dependencies.
- Keep every change traceable to a concrete source comment or change request.

## Constraints
- Do not infer unrelated schema changes.
- Do not silently drop removed columns or tables from the Data Dictionary unless instructed.
- If the change description is missing or ambiguous, request clarification.

## Output Rules
- Save impact and gap reports under `reports/evaluations/` or the prompt-defined artifact folder.
- Keep the prompt's regeneration and consistency rules as final authority.