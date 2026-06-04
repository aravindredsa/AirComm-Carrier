---
name: skill-feature-implementation
description: Shared implementation methodology for planning and building features across resolver-selected capabilities with reuse-first and consistency-first rules.
---

# Skill: Feature Implementation

## Purpose
Provide a consistent, reuse-first methodology for planning and implementing features so prompts can focus on inputs, constraints, and output format while this skill handles discovery, pattern matching, and sub-task decomposition across resolver-selected capabilities.

## Inputs
- **Implementation plan** or **user story + acceptance criteria**
- **Resolved workflow context**: domain and capabilities from policy, catalog, and active client profile (drives discovery and architecture patterns)
- **Resolution Sources**: `config/standards-resolution-policy.json`, `config/client-profiles.json`, and `config/standards-catalog.json`
- **Codebase context**: existing modules, services, data access, tests, utilities, and configuration relevant to resolved capabilities

## Resolver Baseline (Mandatory)
- Read `config/standards-resolution-policy.json`
- Read `config/client-profiles.json`
- Read `config/standards-catalog.json`
- Apply standards in resolver order: common, resolved domain, resolved capabilities, then client overlay

## Method

### 1. Read & Understand
- Read the plan or user story fully before writing any code
- Understand acceptance criteria, context, and any constraints

### 2. Domain-Specific Discovery

Inspect the codebase to identify reuse candidates aligned to resolved capabilities:
- Use the resolved workflow context to infer which file groups and extensions are relevant; do not hardcode stack-specific extension lists in the skill.
- existing UI/API/data modules and patterns
- reusable state/data handling abstractions
- service and repository/data-access patterns
- validation, mapping, utility, and constants patterns
- existing tests, fixtures, and quality gates

### 3. Map to Existing Patterns
Before creating anything new, map requested behavior to existing patterns:
- Reuse existing patterns in the resolved capability areas and client overlay conventions

### 4. Break into Sub-Tasks
Decompose work into concrete, verifiable sub-tasks:

Typical order:
1. Define/verify contracts and data structures
2. Reuse or extend existing module boundaries and data access patterns
3. Implement business logic in the appropriate layer
4. Add validation/mapping/utilities as needed
5. Add or update tests based on resolved testing capabilities
6. Verify acceptance criteria and non-functional constraints

### 5. Maintain Completion Tracking
- Maintain a running sub-task checklist
- Mark each item complete as it is done
- Do not move to next phase until current phase tasks complete

### 6. Validate Against Plan
- Run a completion pass: cross-check all plan items against sub-task checklist
- Ensure all acceptance criteria met
- Ensure all constraints satisfied

## Reuse and Architecture Rules (Cross-Domain)

- **Prefer Composition**: Always reuse suitable existing abstractions before creating new ones
- **No Duplication**: Refactor repeated logic into shared helpers, mappers, or utilities
- **Follow Patterns**: Use existing architectural patterns — never introduce divergent patterns
- **If it exists, reuse it**: Do not create a new utility/component/service if a suitable one already exists
- **Justify new abstractions**: Only create new abstractions when no suitable existing option exists; explain that decision
- **Code organization**: Maintain the project's file structure and naming conventions

## Architecture Rules

- Keep implementation aligned to resolver-selected capability standards and client overlays
- Preserve project layer boundaries and module responsibilities
- Keep business logic out of transport/adaptor layers
- Reuse established validation, mapping, and data-access conventions
- Follow project logging and observability conventions

## Constraints

- **Codebase Authority**: Do not add patterns absent from the project without justification
- **Schema Safety**: If database schema details needed and not provided, ask — do not invent
- **Monolithic Ban**: Do not implement in single pass; use small, verifiable sub-tasks
- **Prompt Authority**: Keep prompt contract as final authority when it specifies additional constraints or output format
- **No Skipping Discovery**: Always inspect existing code patterns before implementing
- **No Hardcoded Stack**: Do not hardcode language/framework/testing choices when resolver context provides them

## Output Rules

- **Summary**: Document what was reused, what was created new, assumptions made
- **Sub-Task Checklist**: Include completion checklist showing all sub-tasks marked complete
- **Evidence**: For each reuse decision, cite the existing component/service used
- **Acceptance Criteria**: Confirm all criteria met in summary
- **Prompt Contract**: Keep prompt-defined output format, constraints, and sections as final authority when more specific
