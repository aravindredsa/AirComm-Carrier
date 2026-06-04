---
agent: 'agent'
description: 'Build a backend feature from an implementation plan using existing project patterns and reuse-first decisions'
---

## Skill Dependency (Mandatory)
- Apply `.github/skills/skill-feature-implementation/SKILL.md` before executing this workflow.
- Keep this prompt's implementation requirements and output format as final authority when more specific.

Build this backend feature from an approved implementation plan.

Context:
- Tech stack: resolver-selected backend language, framework, data, and testing capabilities from standards catalog
- Follow the existing project structure, coding style, naming conventions, and reusable patterns already used in this codebase
- Follow clean architecture boundaries and keep business logic in application services
- Reuse existing shared services, repositories, DTOs, validators, utilities, constants, and mapping patterns wherever possible
- Do not introduce a new pattern if an existing project pattern already solves it
- Keep the implementation production-ready, modular, clean, and maintainable

Inputs:
1. Plan file path:
${input:planFilePath:Enter the markdown plan path, for example artifacts/feature-plans/FeatureImplementationPlan_backend-feature_YYYY-MM-DD.md}

2. Additional implementation constraints:
${input:implementationConstraints:Enter optional additional constraints if needed}

3. Database schema (required when implementation depends on schema details):
${input:dbSchema:Paste relevant DB schema details (tables, columns, keys, constraints, and related stored procedures) or N/A if not required}

Instructions:
1. Read the implementation plan from the provided `planFilePath` before making changes
2. If the plan file is missing, unreadable, or incomplete, stop and ask for a valid plan instead of guessing
3. Break down implementation into concrete sub tasks before coding (for example: contracts, service logic, repository/data access, validation, mapping, tests)
4. Create and maintain a running sub-task checklist during implementation; mark each sub task as completed as soon as it is done
5. Inspect the codebase for the reuse candidates and target files identified in the plan before writing code
6. Follow the approved plan unless codebase discovery reveals a safer or more accurate implementation path
7. If the feature requires any shared utility or building block such as a validator, mapper, repository helper, workflow helper, response formatter, or integration helper, search the repository first for an existing option
8. Reuse an existing utility or shared building block when it is suitable
9. Create a new utility only when no suitable existing option exists, and explain that decision in the final output
10. If the implementation requires database schema information and it is missing or incomplete, explicitly request DB schema details from the user before proceeding
11. Do not invent or design a new DB schema in this implementation workflow; use only provided schema inputs and existing repository/database patterns
12. Before finalizing, run a completion pass that cross-checks all plan items against the sub-task checklist and ensure no sub task is left incomplete

Implementation requirements:
- Keep code properly modularized
- Execute code generation in small, verifiable sub tasks rather than one large monolithic pass
- Use service + repository pattern consistent with the codebase
- Keep controllers thin and move business logic into application services
- Use Dapper with stored procedures for data access; avoid inline SQL
- If schema details are required to implement repository/data access behavior and are not provided, stop and request schema input rather than inferring table or column design
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
- Implement all behavior required by the approved plan
- Add input validation, authorization, and guard clauses where implied
- Add robust error handling and meaningful responses for success and failure paths
- Preserve existing behavior and avoid breaking current flows

Testing requirements:
- Add or update unit tests for main service and repository interaction paths
- Cover happy path, null/empty input, boundary, and exception scenarios
- Reuse existing testing patterns in the project

Output format:
1. Plan file used
2. Existing reuse candidates validated and used
3. Sub-task checklist with status (completed/in-progress/not-started)
4. Files created or updated
5. Code changes
6. Final summary including:
   - what was implemented
   - what was reused
   - any new utility created and why reuse was not sufficient
   - assumptions made
   - any follow-up needed

Important:
- Do not skip the repository reuse check before creating new shared utilities or abstractions
- Prefer reusing existing project patterns over creating parallel implementations
- Keep the final result maintainable and aligned to the approved plan

## Prompt Usage Logging (Required)

After successful completion of this workflow, run:

```bash
node .github/initializer/tools/log-prompt-usage.js --prompt-path=.github/prompts/backend-build-feature-from-plan.prompt.md
```
