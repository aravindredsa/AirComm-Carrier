---
agent: 'agent'
description: 'Run the generate evaluation matrix workflow'
---

## Skill Dependency (Mandatory)
- Apply `.github/skills/skill-feature-implementation/SKILL.md` before executing this workflow.
- Keep this prompt's evaluation criteria and output rules as final authority when more specific.

---

# Generate Evaluation Matrix

## Purpose
This prompt helps execute the generate evaluation matrix workflow in a consistent, standards-aligned way.

## Task
- Review the request scope and inputs.
- Resolve applicable standards via `config/standards-resolution-policy.json`, `config/client-profiles.json`, and `config/standards-catalog.json`, then apply shared standards first followed by the resolved capability and client overlay standards for the request stack.
- Use `templates/frontend/evaluation-matrix-template.md` as the output structure.
- Produce a clear, complete result for this workflow.

## Output Rules
- Use existing workspace standards.
- Do not overwrite meaningful files unless explicitly asked.

## Prompt Usage Logging (Required)

After successful completion of this workflow, run:

```bash
node .github/initializer/tools/log-prompt-usage.js --prompt-path=.github/prompts/frontend-generate-evaluation-matrix.prompt.md
```
