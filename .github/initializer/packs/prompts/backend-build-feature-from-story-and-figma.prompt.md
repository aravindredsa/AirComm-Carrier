---
agent: 'agent'
description: 'Build a backend feature from a user story and requirements artifacts using existing project patterns'
---

## Skill Dependency (Mandatory)
- Apply `.github/skills/skill-feature-implementation/SKILL.md` before executing this workflow.
- Keep this prompt's implementation requirements and output format as final authority when more specific.

Build this backend feature based on the provided user story, acceptance criteria, and attached requirement artifacts (for example Figma, API examples, or process notes).
 
Context:
- Tech stack: resolver-selected backend language, framework, data, and testing capabilities from standards catalog
- Follow the existing project structure, coding style, naming conventions, and reusable patterns already used in this codebase
- Follow clean architecture boundaries and keep business logic in application services
- Reuse existing shared services, repositories, DTOs, validators, utilities, constants, and mapping patterns wherever possible
- Do not introduce a new pattern if an existing project pattern already solves it
- Keep the implementation production-ready, modular, clean, and maintainable
 
Inputs:
1. User story:
${input:userStory:Paste the user story}
 
2. Acceptance criteria:
${input:acceptanceCriteria:Paste acceptance criteria}
 
3. Target backend area:
${input:targetArea:Enter target service, module, API, or worker area}
 
4. Target endpoint/service name:
${input:componentName:Enter endpoint or service name if known}
 
Reference artifacts:
- Use attached artifacts (for example Figma, sequence diagrams, payload examples, or workflow notes) as behavior reference
- Convert UI/business intent into backend contracts, validations, workflows, and persistence rules
- If an artifact conflicts with existing backend standards, follow project standards and explicitly note assumptions
 
Instructions:
1. First inspect the codebase for similar endpoints, services, repositories, validators, mappers, and workflow patterns before writing code
2. Identify the best existing location for this feature
3. Reuse existing patterns and shared building blocks whenever possible
4. Before implementation, create a short plan that includes:
   - API contracts (request/response models)
   - validation requirements
   - business rules and edge cases
   - data access and integration points
   - files to create or update
 
Implementation requirements:
- Keep code properly modularized
- Use service + repository pattern consistent with the codebase
- Keep controllers thin and move business logic into application services
- Use Dapper with stored procedures for data access; avoid inline SQL
- Use primary constructors where applicable and follow dependency injection conventions
- Keep API response models consistent with project standards
- Extract reusable logic into helpers, utilities, mappers, validators, or constants where appropriate
- Avoid large monolithic classes or methods
- Prefer composition over duplication
- Refactor repeated logic instead of copying and pasting
- Use clear separation of concerns:
  - API/controller layer
  - application/service layer
  - repository/data access layer
  - transformation/mapping logic
- If an existing file is already too large, refactor safely while implementing the new feature
- Keep naming semantic and consistent with the project
- Keep DTOs/contracts and types clean and minimal
- Remove unnecessary duplication introduced during implementation
- Do not leave placeholder TODO logic or pseudo-code unless something is genuinely missing from the codebase
 
Behavior requirements:
- Implement all behavior required by the story and acceptance criteria
- Add input validation, authorization, and guard clauses where implied
- Add robust error handling and meaningful responses for success and failure paths
- Preserve existing behavior and avoid breaking current flows
 
Testing requirements:
- Add or update unit tests for main service and repository interaction paths
- Cover happy path, null/empty input, boundary, and exception scenarios
- Reuse existing testing patterns in the project
 
Output format:
1. Brief implementation plan
2. Similar existing files or patterns found in the codebase
3. Files to create or update
4. Code changes
5. Final summary including:
   - what was implemented
   - what was refactored or modularized
   - assumptions made
   - any follow-up needed
 
Important:
- Do not jump straight into a single large controller or service
- Refactor when needed so the final result is maintainable
- Prefer clean modular code over quick inline implementation
### Skill files
For each missing or empty skill file, write starter content adapted to the skill:

## Prompt Usage Logging (Required)

After successful completion of this workflow, run:

```bash
node .github/initializer/tools/log-prompt-usage.js --prompt-path=.github/prompts/backend-build-feature-from-story-and-figma.prompt.md
```
