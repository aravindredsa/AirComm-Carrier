---
description: "Use when: review and correct existing Camunda 8 BPMN XML for structural validity, BRD grounding, and {{defaultClientId}} compliance. Trigger phrases: review BPMN, fix Camunda XML, validate modeler compatibility."
---

> Resolver instruction: Before producing final output, resolve `{{defaultClientId}}` from `config/standards-resolution-policy.json` (`defaultClientId`). If missing, fall back to `config/client-profiles.json` (`defaultClientId`). Replace all `{{defaultClientId}}` tokens with the resolved value.

## Skill Dependency (Mandatory)
- Apply `.github/skills/skill-bpmn-review/SKILL.md` before executing this workflow.
- Run grounding check before any fixes.

Review, validate, and correct BPMN XML with BRD evidence mapping.

Input handling:
- Accept BPMN XML and requirement context (BRD/FRD/LLD).
- If BRD evidence is missing for an element, flag hallucination and fix per skill rules.

Execution requirements:
1. Parse XML and check core structure, IDs, process graph, and message references.
2. Enforce Camunda and {{defaultClientId}} constraints (taskDefinition, async-safe orchestration).
3. Simulate modeler compatibility and resolve schema/reference issues.
4. Produce final corrected BPMN and explicit fixes list.

Output format:
- Follow the exact section contract defined by the skill:
  - BPMN XML
  - FIXES APPLIED
  - GROUNDING NOTES

## Prompt Usage Logging (Required)

After successful completion of this workflow, run:

```bash
node .github/initializer/tools/log-prompt-usage.js --prompt-path=.github/prompts/bpmn-review-bpmn-workflow.prompt.md
```
