---
description: "Use when: convert BRD analysis JSON into BPMN design JSON aligned with Camunda 8 and {{defaultClientId}} orchestration boundaries. Trigger phrases: derive BPMN flow, transform analysis to workflow design."
---

> Resolver instruction: Before producing final output, resolve `{{defaultClientId}}` from `config/standards-resolution-policy.json` (`defaultClientId`). If missing, fall back to `config/client-profiles.json` (`defaultClientId`). Replace all `{{defaultClientId}}` tokens with the resolved value.

## Skill Dependency (Mandatory)
- Apply `.github/skills/skill-bpmn-flow-deriver/SKILL.md` before executing this workflow.
- Return BPMN design JSON only, matching the skill schema.

Derive a BPMN-ready flow design from structured analysis input.

Input handling:
- Primary input should be JSON from BRD analysis.
- If input is partial, preserve known facts and mark uncertain design edges conservatively.

Execution requirements:
1. Build workflow structure with explicit start/end and task sequencing.
2. Determine orchestration vs collaboration process type.
3. Map tasks, gateways, subprocesses, message flows, and Camunda mapping fields.
4. Keep bounded-context ownership and async integration boundaries explicit.
5. Do not output BPMN XML in this prompt.

Output format:
- Return only the BPMN design JSON object defined by the skill.
- No prose section unless the user explicitly requests explanation.

## Prompt Usage Logging (Required)

After successful completion of this workflow, run:

```bash
node .github/initializer/tools/log-prompt-usage.js --prompt-path=.github/prompts/bpmn-derive-bpmn-flow-from-analysis.prompt.md
```
