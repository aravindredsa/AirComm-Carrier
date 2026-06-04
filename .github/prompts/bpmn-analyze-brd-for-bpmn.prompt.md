---
description: "Use when: extract structured workflow intent from BRD/requirements to prepare BPMN modeling inputs. Trigger phrases: analyze BRD for BPMN, extract workflow entities, identify business rules and integrations."
---

## Skill Dependency (Mandatory)
- Apply `.github/skills/skill-bpmn-brd-analyzer/SKILL.md` before executing this workflow.
- Return structured JSON only, matching the skill schema.

Analyze requirement input and produce BPMN-ready structured extraction.

Input handling:
- Accept BRD, requirement docs, FRD/LLD excerpts, or user story text.
- Prefer explicit evidence from provided documents over assumptions.
- If critical data is missing, include it under `errors_and_exceptions` or `business_rules` as gaps.

Execution requirements:
1. Identify process scope, actors, systems, triggers, business events, and commands.
2. Extract business rules and integration points with concise evidence.
3. Separate sync operations vs async operations.
4. Provide BPMN hints (start/end events, gateways, user/service task candidates).
5. Do not output BPMN XML in this prompt.

Output format:
- Return only the JSON object defined by the skill.
- No markdown wrappers unless explicitly requested by the user.

## Prompt Usage Logging (Required)

After successful completion of this workflow, run:

```bash
node .github/initializer/tools/log-prompt-usage.js --prompt-path=.github/prompts/bpmn-analyze-brd-for-bpmn.prompt.md
```
