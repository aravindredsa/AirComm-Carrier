---
name: skill-db-seed-and-deployment
description: Shared method for lookup seed generation and post-deployment promotion scripts for DB artifacts.
---

# Skill: DB Seed and Deployment

## Purpose
Provide a reusable method for lookup seed generation and promotion-safe deployment packaging so prompts can focus on environment targets and artifact output.

## Inputs
- Approved data dictionary or schema script
- Lookup values or inferable business context
- Source and target environment names when promoting artifacts
- Prompt-defined output targets

## Method
1. Identify lookup/reference tables and seed-worthy values.
2. Generate idempotent row-level seed scripts with existence guards.
3. Build promotion scripts with guards for DDL, SPs, and seed data.
4. Validate that seed and deployment scripts are safe to rerun.

## Quality Rules
- Use `IF NOT EXISTS` guards for seed rows and promotion DDL.
- Use named column lists in all inserts.
- Use `GETUTCDATE()` and `SEED_SCRIPT` where required.
- Keep deployment scripts batch-safe and repeatable.

## Constraints
- Do not insert empty or null lookup codes.
- Do not add destructive operations to promotion scripts.
- If lookup values or environments are missing, request them.

## Output Rules
- Save seed files under `artifacts/seed-scripts/` and deployment scripts under `artifacts/migration-scripts/`.
- Use the prompt's naming and idempotency rules as final authority.