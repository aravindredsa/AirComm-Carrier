---
agent: 'agent'
description: 'Create a backend implementation plan from a user story and requirements artifacts using existing project patterns'
---

## Skill Dependency (Mandatory)
- Apply `.github/skills/skill-feature-implementation/SKILL.md` before executing this workflow.
- Keep this prompt's planning requirements and output format as final authority when more specific.

Create a backend implementation plan based on the provided user story, acceptance criteria, and attached requirement artifacts (for example Figma, API examples, sequence diagrams, or workflow notes).

Context:
- Tech stack: resolver-selected backend language, framework, data, and testing capabilities from standards catalog
- Follow the existing project structure, coding style, naming conventions, and reusable patterns already used in this codebase
- Follow clean architecture boundaries and keep business logic in application services
- Reuse existing shared services, repositories, DTOs, validators, utilities, constants, and mapping patterns wherever possible
- Do not introduce a new pattern if an existing project pattern already solves it
- This prompt creates a plan only and does not implement the feature

Inputs:
1. User story:
${input:userStory:Paste the user story}

2. Acceptance criteria:
${input:acceptanceCriteria:Paste acceptance criteria}

3. Target backend area:
${input:targetArea:Enter target service, module, API, or worker area}

4. Target endpoint/service name:
${input:componentName:Enter endpoint or service name if known}

5. Plan output path:
${input:planFilePath:artifacts/feature-plans/FeatureImplementationPlan_backend-feature_YYYY-MM-DD.md}

6. Database schema (required when story/API behavior depends on schema details):
${input:dbSchema:Paste relevant DB schema details (tables, columns, keys, constraints, and related stored procedures) or N/A if not required}

Reference artifacts:
- Use attached artifacts (for example Figma, sequence diagrams, payload examples, or workflow notes) as behavior reference
- Convert UI/business intent into backend contracts, validations, workflows, and persistence rules
- If an artifact conflicts with existing backend standards, follow project standards and explicitly note assumptions

Instructions:
1. Inspect the codebase for similar endpoints, services, repositories, validators, DTOs, mappers, and workflow patterns before writing the plan
2. Identify the best existing location for this feature
3. Identify concrete reuse candidates across services, repositories, DTOs, validators, utilities, constants, and mapping logic
4. Identify only the true gaps that require new files, utilities, or abstractions
5. Use `templates/backend/feature-implementation-plan-template.md` as the output structure
6. Save the completed plan to the provided `planFilePath`
7. If the story/API planning requires database schema information and it is missing or incomplete, explicitly request DB schema details from the user before finalizing the plan
8. Do not invent or design a new DB schema in this planning workflow; use only provided schema inputs and existing repository/database patterns

Planning requirements:
- Make the plan specific enough that implementation can proceed from the plan without reinterpreting the story from scratch
- Include API contracts, validation rules, business rules, edge cases, data access, integration points, and files to create or update
- Include a reuse-first assessment for any shared service, validator, helper, repository, mapper, or workflow utility that may be needed
- If a reusable option is not suitable, explain why it should not be reused
- If DB schema details are required for accurate API/data planning, treat missing schema as a blocker and add an explicit "Schema input required from user" item in assumptions/open questions
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
node .github/initializer/tools/log-prompt-usage.js --prompt-path=.github/prompts/backend-plan-feature-from-story-and-figma.prompt.md
```
