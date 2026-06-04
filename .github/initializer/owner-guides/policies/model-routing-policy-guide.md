# Model Routing Policy Guide

## 1) Purpose

This guide explains how `config/model-routing-policy.json` defines model selection strategy for automatic prompt execution in the unified enabler.

Policy file:
- `config/model-routing-policy.json`

Primary instruction binding:
- `.github/copilot-instructions.md` (Model Routing Policy section)

## 2) Core Principle

User-selected model in chat UI always has highest priority.

Policy-based routing is advisory and applies to automatic prompt execution paths.

## 3) Routing Hierarchy

Model selection order:
1. user manual model selection
2. task category trigger match
3. complexity signal match
4. default model fallback

Default model in policy:
- `claude-opus-4-1`

## 4) Schema Walkthrough

### Top-Level Keys
- `routingVersion`: schema version
- `description`: policy intent
- `defaultModel`: final fallback model
- `autoRouting`: execution boundaries and detection mode
- `taskCategories`: trigger-to-model mappings
- `complexitySignals`: keyword-based complexity heuristics
- `tokenBudgets`: advisory budget guidance by category

### autoRouting
- `enabled`: global switch
- `appliesTo`: scope for policy-driven routing
- `doesNotApplyTo`: exclusions (manual selection)
- `complexityDetection`: detection method used (`keyword-based`)

## 5) Task Category Mapping

### analysis
- Model: `claude-opus-4-1`
- Use for audits, assessments, reverse engineering, full-codebase analysis.

### synthesis
- Model: `claude-opus-4-1`
- Use for generation/design/build style tasks.

### refactoring
- Model: `claude-sonnet-4-20250514`
- Use for single-file edits, migration fixes, targeted updates.

### search-discovery
- Model: `claude-haiku-3-5`
- Use for quick exploration and retrieval.

### validation
- Model: `claude-haiku-3-5`
- Use for checks/lint/verification tasks.

## 6) Complexity Signal Routing

If no category trigger match occurs:
- high complexity keywords route to Opus
- medium complexity keywords route to Sonnet
- low complexity keywords route to Haiku

## 7) Token Budget Guidance

Budgets are advisory metadata for planning and optimization, not hard limits.

Current policy budgets:
- analysis: 150000
- synthesis: 120000
- refactoring: 80000
- search-discovery: 30000
- validation: 20000

## 8) Operational Examples

### Example A: Prompt Name Includes "audit"
- Category trigger matches `analysis`.
- Route to Opus unless user explicitly selected another model.

### Example B: Prompt Has No Category Trigger but Mentions "single file"
- Complexity detection marks medium complexity.
- Route to Sonnet.

### Example C: User Selected Model Manually
- Policy is bypassed for model choice.
- Use user-selected model.

## 9) Change Management Rules

When editing `config/model-routing-policy.json`:
1. Keep trigger lists mutually sensible to reduce accidental overlap.
2. Update complexity keywords only with measurable behavior intent.
3. Keep default model aligned with expected quality baseline.
4. Update this guide when category definitions or priorities change.

## 10) Validation Checklist

- JSON parses successfully.
- Every category has model, description, and triggers.
- Complexity buckets reflect intended routing behavior.
- `.github/copilot-instructions.md` narrative matches policy semantics.
