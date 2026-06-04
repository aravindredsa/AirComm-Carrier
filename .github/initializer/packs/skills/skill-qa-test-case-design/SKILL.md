---
name: skill-test-case-design
description: Shared method for generating QA test cases and scenario plans from story and UI evidence.
---

# Skill: Test Case Design

## Purpose
Provide a reusable QA test-design method so prompts can focus on evidence, coverage expectations, and output format while this skill handles extraction and coverage discipline.

## Inputs
- User story and acceptance criteria
- Business rules and UI evidence
- Source-code evidence when available
- Prompt-defined output targets

## Method
1. Map every acceptance criterion and business rule to test coverage.
2. Extract all visible UI controls and relevant behaviors from evidence.
3. Identify gaps, mismatches, and open questions that affect coverage.
4. Generate positive, negative, edge, and failure scenarios where applicable.
5. Ensure every rule has explicit coverage before saving.

## Quality Rules
- Use exact labels, values, and messages from evidence.
- Do not invent field rules, validation outcomes, or backend behavior.
- Keep the output precise and execution-ready.
- Flag story, design, and code mismatches explicitly.

## Constraints
- If a core flow cannot be covered reliably, stop and ask for clarification.
- Do not generate automation code in this workflow.
- Do not omit any acceptance criterion or business rule with coverage.

## Output Rules
- Save the package under `artifacts/test-cases/` and `artifacts/test-scenarios/`.
- Use the prompt's template structure and naming convention exactly.
- Update coverage totals if any case is added.