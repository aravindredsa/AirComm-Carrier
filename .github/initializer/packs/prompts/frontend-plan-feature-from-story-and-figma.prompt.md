---
agent: 'agent'
description: 'Create a frontend implementation plan from a user story and Figma screenshot using existing project patterns'
---

## Skill Dependency (Mandatory)
- Apply `.github/skills/skill-feature-implementation/SKILL.md` before executing this workflow.
- Keep this prompt's planning constraints and output rules as final authority when more specific.

---

Create a frontend implementation plan based on the provided user story, acceptance criteria, and attached Figma screenshot.

Context:
- Tech stack: resolver-selected framework and language capabilities from standards catalog
- Follow the existing project structure, coding style, naming conventions, and reusable patterns already used in this codebase
- Reuse existing shared components, hooks, services, utilities, types, constants, and styles wherever possible
- Do not introduce a new pattern if an existing project pattern already solves it
- This prompt creates a plan only and does not implement the feature

Inputs:
1. User story:
${input:userStory:Paste the user story}

2. Acceptance criteria:
${input:acceptanceCriteria:Paste acceptance criteria}

3. Target feature or area:
${input:targetArea:Enter target folder, module, page, or component area}

4. Target component name:
${input:componentName:Enter component name if known}

5. Plan output path:
${input:planFilePath:artifacts/feature-plans/FeatureImplementationPlan_feature-name_YYYY-MM-DD.md}

Design reference:
- Use the attached Figma screenshot as the visual reference
- Match layout intent, section order, labels, states, and interactions as closely as possible
- Use existing design system/components/tokens in the project instead of inventing new patterns unless required

Instructions:
1. Inspect the codebase for similar screens, dialogs, forms, cards, tables, sections, utilities, hooks, and interaction patterns before writing the plan
2. Identify the best existing location for this feature
3. Identify concrete reuse candidates across components, hooks, services, utilities, types, constants, and styles
4. Identify only the true gaps that require new files, utilities, or abstractions
5. Use `templates/frontend/feature-implementation-plan-template.md` as the output structure
6. Save the completed plan to the provided `planFilePath`

Planning requirements:
- Make the plan specific enough that implementation can proceed from the plan without reinterpreting the story from scratch
- Include file-level recommendations for create vs update decisions
- Include a reuse-first assessment for any shared UI element or utility that may be needed
- If a reusable option is not suitable, explain why it should not be reused
- Record assumptions and open questions explicitly instead of hiding them in prose
- Do not implement code changes in this workflow

Output format:
1. Short planning summary
2. Similar existing files or patterns found in the codebase
3. Plan file path saved
4. Key assumptions or open questions

Important:
- Produce a plan artifact, not code changes
- Prefer reusing existing project patterns over proposing new abstractions
- Keep the plan concrete, modular, and implementation-ready

## Prompt Usage Logging (Required)

After successful completion of this workflow, run:

```bash
node .github/initializer/tools/log-prompt-usage.js --prompt-path=.github/prompts/frontend-plan-feature-from-story-and-figma.prompt.md
```
