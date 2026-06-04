---
name: skill-test-case-update
description: Shared method for incrementally updating existing QA test-case packages from new evidence.
---

# Skill: Test Case Update

## Purpose
Provide a reusable update method so prompts can focus on deltas, baseline preservation, and output format while this skill handles targeted coverage maintenance.

## Inputs
- Baseline test-case package
- Updated story, UI evidence, and source evidence
- Prompt-defined update target paths

## Method
1. Read and index the baseline package.
2. Detect story, UI, and source-code deltas.
3. Map impacted scenarios, test cases, and traceability rows.
4. Apply targeted add, modify, or retire updates.
5. Recompute summaries and coverage totals.
6. Update scenario planning and automation handoff metadata.

## Quality Rules
- Prefer targeted updates over full regeneration.
- Preserve valid unchanged coverage.
- Do not silently delete prior coverage.
- Tie every change to exact evidence.

## Constraints
- If baseline or required update artifacts are missing, stop and request them.
- Do not introduce invented or inferred behavior.
- Keep updates precise and traceable.

## Output Rules
- Update the baseline in `artifacts/test-cases/` and `artifacts/test-scenarios/`.
- Preserve the prompt's template structure and naming convention.
- Report the changed coverage accurately.