# Prompt Writing Standards

## Purpose
Define baseline quality rules for prompt authoring across domains and clients.

## Applies To
- All prompt files and prompt-driven workflow definitions
- Orchestrated and standalone prompt workflows

## Required Rules
- State purpose, inputs, constraints, and expected outputs explicitly.
- Encode deterministic execution steps where possible.
- Prefer verifiable instructions over stylistic preferences.
- Require traceability when decisions or transformations are made.
- Include failure behavior when prerequisites are missing.

## Prompt Construction
- Start with intent and scope boundaries.
- Define required artifacts and output paths.
- Separate mandatory rules from optional guidance.
- Keep tool usage rules explicit for safety and reproducibility.

## Quality Gates
- Validate completeness, consistency, and policy compliance before success.
- Return remediation guidance when output fails validation.
- Avoid silent partial success.

## Avoid
- Ambiguous scope or overlapping responsibilities
- Hidden dependencies on unstated files or tools
- Client-specific assumptions in universal prompts

## Review Checklist
- Are inputs and outputs unambiguous?
- Are execution steps deterministic?
- Are validation and error paths defined?
- Is the prompt reusable across clients without overlay dependency?
