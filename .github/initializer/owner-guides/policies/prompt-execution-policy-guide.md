# Prompt Execution Policy Guide

## 1) Purpose

This guide explains orchestration behavior defined in `config/prompt-execution-policy.json` and how it controls sequential vs safe-parallel prompt execution and validation gates.

Policy file:
- `config/prompt-execution-policy.json`

Primary instruction binding:
- `.github/copilot-instructions.md` (Prompt Execution Policy section)

## 2) Control Surface

Main policy object:
- `orchestration`

It controls:
- global enablement
- default execution mode
- fallback behavior
- prompt-specific overrides
- required validation gates

## 3) Execution Modes

### sequential
All steps run one-by-one.

### safe-parallel
Only independent/read-only analysis steps may run in parallel.
Final synthesis/report assembly remains sequential.

## 4) Schema Walkthrough

### Top-Level Keys
- `schemaVersion`: policy schema version
- `orchestration`: runtime orchestration rules

### orchestration keys
- `enabled`: global orchestration switch
- `defaultMode`: baseline mode (`safe-parallel`)
- `fallbackMode`: mode when policy cannot be loaded/parsed
- `serialOnlyPrompts`: prompts forced to sequential execution
- `validation`: required quality checks
- `overrides`: per-prompt behavior overrides

### validation keys
- `enabled`
- `requireCompletenessCheck`
- `requireCoherenceCheck`
- `requireCorrectnessCheck`

## 5) Current Prompt Overrides

### serialOnlyPrompts
- `initialize-ai-workspace.prompt.md`
- `reset-ai-workspace.prompt.md`

These are always sequential.

### overrides entries
- `audit-fullcodebase.prompt.md`: enabled true, mode safe-parallel
- `audit-uncommitted-changes.prompt.md`: enabled true, mode safe-parallel
- `evaluate-output-quality.prompt.md`: enabled false, mode sequential

Override values take precedence over global defaults for that prompt.

## 6) Runtime Decision Order

For each prompt execution:
1. Load policy JSON.
2. If missing/invalid, use `fallbackMode` if available, else sequential.
3. If prompt is in `serialOnlyPrompts`, run sequential.
4. If prompt has an override, apply override settings.
5. Otherwise apply global defaults (`enabled`, `defaultMode`).
6. If validation enabled, run required checks.
7. If required checks fail, return revision/failure outcome with remediation.

## 7) Validation Outcome Semantics

When required validation is enabled:
- success requires completeness + coherence + correctness checks (as configured)
- failed required checks should produce `NEEDS_REVISION` or `FAIL`
- do not report successful completion if required validation failed

## 8) Operational Examples

### Example A: initialize-ai-workspace
- Matched in `serialOnlyPrompts`.
- Forced sequential execution.

### Example B: audit-fullcodebase
- Override exists with safe-parallel mode.
- Run analysis safely in parallel where independent, then synthesize sequentially.

### Example C: policy file missing or malformed
- Use `fallbackMode` (`sequential`).

## 9) Change Management Rules

When editing `config/prompt-execution-policy.json`:
1. Keep `serialOnlyPrompts` limited to workflows requiring strict sequencing.
2. Use prompt overrides only when behavior must differ from global defaults.
3. Keep validation requirements aligned with quality expectations.
4. Update this guide whenever execution semantics change.

## 10) Validation Checklist

- JSON parses successfully.
- Serial-only prompt names match actual prompt filenames.
- Override keys match actual prompt filenames.
- Fallback mode is defined and sensible.
- `.github/copilot-instructions.md` policy narrative matches JSON behavior.
