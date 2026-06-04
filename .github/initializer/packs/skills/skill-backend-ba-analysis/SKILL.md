---
name: skill-ba-analysis
description: Shared business-analysis document generation method for UI analysis and reverse-engineer evaluation workflows.
---

# Skill: BA Analysis

## Purpose
Provide a consistent document-extraction and analysis method for BA deliverables so prompts can define scope, inputs, and output format.

## Inputs
- Attached requirement documents, Figma files, process notes, or existing system code
- Prompt-defined output format, section structure, and artifact path
- Template file path if referenced by the prompt

## Method
1. Gather all input documents (attachments, linked files, pasted content).
2. Extract all relevant information exhaustively: requirements, rules, validations, fields, workflows, roles, permissions, behaviors.
3. Consolidate and normalize content: resolve contradictions, merge duplicates, clarify ambiguous terms.
4. Structure content to match the required output template or section order.
5. Verify completeness: all sections must have meaningful content; no placeholders remain.
6. Generate the final document in both `.md` and `.docx` format when specified.

## Quality Rules
- Include NO invented logic — every statement must trace to a source input.
- Include NO placeholders — every section must be populated.
- Preserve ALL field rules, validations, SP names, workflow triggers, and role-based behaviors.
- Maintain consistency across sections: same term used for same concept throughout.
- Use structured tables for field rules, validation rules, and role permissions.

## Constraints
- Do not generate design decisions unless the prompt explicitly asks for it.
- Do not omit details from input documents — exhaustive extraction is mandatory.
- Do not redefine section structure unless the prompt explicitly requests it.

## Output Rules
- Follow prompt-defined artifact path and filename convention.
- Generate both `.md` and `.docx` when the prompt specifies it.
- Verify document completeness before writing output.
- Do not overwrite meaningful existing files unless explicitly asked.
