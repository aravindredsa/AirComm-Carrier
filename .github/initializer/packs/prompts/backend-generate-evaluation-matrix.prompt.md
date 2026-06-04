---
agent: 'agent'
description: "Generate an evaluation matrix for the requested feature, module, or document"
---

## Skill Dependency (Mandatory)
- Apply `.github/skills/skill-backend-ba-analysis/SKILL.md` before executing this workflow.
- Keep this prompt's evaluation criteria and output rules as final authority when more specific.

---

# Generate Evaluation Matrix

## Purpose

Generate an evaluation matrix for the requested feature, module, or document.

## Task

- Use existing workspace standards.
- Use `templates/backend/evaluation-matrix-template.md` as the output structure.
- Produce a concise, practical output for this task.

## Output Rules

- Use existing workspace standards.
- Do not overwrite meaningful files unless explicitly asked.

## Prompt Usage Logging (Required)

After successful completion of this workflow, run:

```bash
node .github/initializer/tools/log-prompt-usage.js --prompt-path=.github/prompts/backend-generate-evaluation-matrix.prompt.md
```
