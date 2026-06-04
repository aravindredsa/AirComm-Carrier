---
name: skill-bpmn-workflow-generation
description: Shared method for generating Camunda 8 BPMN workflows from requirement artifacts with deterministic layout and artifact-safe output rules.
---

# Skill: BPMN Workflow Generation

## Purpose
Provide a reusable BPMN workflow generation method so prompts can focus on input precedence, output contract, and domain-specific constraints.

## Inputs
- Requirement artifacts (BRD, FRD, LLD, user story text)
- Sample BPMN files under `samples/bpmn`
- Prompt-defined output template and artifact path

## Method
1. Resolve primary input source using attachment-first precedence.
2. Extract workflow triggers, conditions, and task transitions.
3. Build a deterministic process model with one primary user task and downstream triggers.
4. Apply Camunda 8 XML and Zeebe extension requirements.
5. Apply diagram layout and label routing constraints.
6. Validate sample parity and output-file naming before writing.

## Quality Rules
- Keep routing expressions deterministic and requirement-derived.
- Keep workflow variables minimal and routing-focused.
- Use orthogonal sequence-flow routing and avoid label collisions.
- Keep IDs deterministic and unique.

## Constraints
- Do not invent missing requirement logic.
- Do not output BPMN XML in chat when prompt requires file-write delivery.
- Do not deviate from prompt-specified namespace and extension requirements.

## Output Rules
- Write BPMN XML to `artifacts/bpmn/<filename>.bpmn`.
- Follow dropped-file-derived naming and collision rules from the prompt.
- Preserve prompt-defined validation checklist as final authority.