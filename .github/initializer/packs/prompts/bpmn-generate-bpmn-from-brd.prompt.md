---
description: "Use when: generate grounded Camunda 8 BPMN XML directly from BRD/requirements using strict staged derivation. Trigger phrases: generate BPMN from BRD, create Camunda workflow from requirements."
---

> Resolver instruction: Before producing final output, resolve `{{defaultClientId}}` from `config/standards-resolution-policy.json` (`defaultClientId`). If missing, fall back to `config/client-profiles.json` (`defaultClientId`). Replace all `{{defaultClientId}}` tokens with the resolved value.

## Skill Dependency (Mandatory)
- Apply `.github/skills/skill-bpmn-generate/SKILL.md` before executing this workflow.
- Follow strict grounding, stop conditions, and staged transformation rules.

Generate Camunda 8 BPMN XML from requirement documents with zero-hallucination policy.

Input handling:
- Prefer BRD as source of truth.
- Use FRD/LLD only to refine explicitly stated behavior.
- If critical ambiguity exists, stop and ask concise clarification questions.

Execution requirements:
1. Perform structured extraction and unknowns gate before modeling.
2. Derive deterministic flow representation first.
3. Transform to BPMN elements under strict allowed-element policy.
4. Enforce {{defaultClientId}} fan-out idiom and messagePublisher rules from the skill.
5. Produce valid Camunda 8 BPMN XML.

Output expectations:
- If user asks for a file, write XML to `artifacts/bpmn/<name>.bpmn` and confirm path.
- If user asks inline output, return XML plus assumptions and validation notes.

## Prompt Usage Logging (Required)

After successful completion of this workflow, run:

```bash
node .github/initializer/tools/log-prompt-usage.js --prompt-path=.github/prompts/bpmn-generate-bpmn-from-brd.prompt.md
```
