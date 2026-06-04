---
name: skill-user-story-writing
description: Shared framework for generating implementation-ready user stories across frontend, backend, QA, and cross-functional story packages.
---

# Skill: User Story Writing

## Purpose
Provide a reusable user-story method so prompts can focus on story scope while maintaining consistent completeness, quality, and testability standards.

## Inputs
- Source artifacts (FRD, reverse-engineering notes, UI designs, API docs, constraints)
- Requested focus mode (`full`, `frontend`, `backend`, `qa`)
- Prompt-specific format and output requirements

## Method
1. Extract actors, permissions, workflows, business rules, validations, and integrations.
2. Build a coverage map across UI, API, validations, errors, async behavior, security, and operational needs.
3. Resolve conflicts and ambiguities with explicit assumptions.
4. Produce INVEST-aligned, independently testable stories with clear acceptance criteria.
5. Add positive and negative scenarios for each story.
6. Document dependencies (external and internal) required for delivery.

## Quality Bar
- No placeholders and no vague wording.
- Deterministic behavior rules and measurable acceptance criteria.
- Explicit state handling where applicable (default/loading/empty/success/error/permission denied).
- API stories include method, endpoint, auth, request/response schema, and error mapping when relevant.

## Mode Guidance
- `full`: cross-functional package spanning frontend, backend, integration, security, and QA.
- `frontend`: UI behavior, states, UX rules, accessibility, and API dependencies.
- `backend`: contracts, validation, authorization, transactions, and side effects.
- `qa`: risk-based coverage, traceability, environment/data dependencies, and automation guidance.

## Output Rules
- Keep prompt-specific structure and headings as final authority.
- Make output sprint-ready without requiring separate gap analysis.
