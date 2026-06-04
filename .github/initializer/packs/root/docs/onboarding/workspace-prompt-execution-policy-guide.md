# Prompt Execution Policy Guide

Hi Team,

This guide explains how prompt parallelization is controlled in this workspace, where policy is defined, and how it is enforced through Copilot instructions.

## Purpose

The policy lets users control how prompts are executed:
- whether orchestration is enabled
- when execution must remain sequential
- when safe parallel analysis is allowed
- which validation checks are required before returning a result

Important:
- Prompts are still user-invoked.
- This policy does not auto-run unrelated prompts by itself.
- It controls execution behavior of the prompt the user runs.

## Policy File Location

Policy file:
- `config/prompt-execution-policy.json`

## Enforcement Path

Enforcement is instruction-driven (not script-driven):
- `.github/copilot-instructions.md`
- `.github/initializer/packs/root/copilot-instructions.md`

These instruction files contain a mandatory section that tells the agent to:
1. load `config/prompt-execution-policy.json` before executing any prompt
2. apply policy precedence and mode rules
3. run required validation checks configured by policy

So the JSON is the source of truth, and Copilot instructions are the enforcement contract.

## Current Policy Structure

Top-level path:
- `orchestration`

Main fields:
- `enabled`
  - `true`: policy applies
  - `false`: execute prompt sequentially without orchestration behavior
- `defaultMode`
  - default behavior when no override exists
  - current value: `safe-parallel`
- `fallbackMode`
  - used if policy file is missing/invalid
  - current value: `sequential`
- `serialOnlyPrompts`
  - prompts that must run sequentially even if default is `safe-parallel`
- `validation`
  - generic validation requirements (completeness, coherence, correctness)
- `overrides`
  - per-prompt behavior that overrides global defaults

## Precedence Rules

Applied in this order:
1. Global defaults under `orchestration`
2. `serialOnlyPrompts` rule
3. Prompt-specific entry under `overrides` (highest precedence)

If a prompt is in `overrides`, that entry wins.

## What Safe-Parallel Means

`safe-parallel` means:
- independent/read-only analysis steps may run in parallel
- shared-output synthesis and final report assembly stay sequential

This avoids racing writes and keeps final output coherent.

## No Auto-Chaining Guarantee

This policy does not imply automatic execution of other prompts.
It does not force prompt chaining unless explicit instruction logic says so.



## Example: Running One Prompt

If a user runs:
- `/backend-build-feature-from-plan.prompt.md`

Then:
1. policy is read
2. mode is resolved by defaults/overrides
3. internal steps may be parallelized if safe
4. final synthesis remains sequential
5. only that prompt workflow is executed

## Overrides Explained

Use `overrides` when one prompt needs behavior different from global defaults.

Example patterns:
- Force sequential for one prompt while global mode is `safe-parallel`
- Disable orchestration for one prompt with `enabled: false`
- Keep a prompt in orchestration but with a prompt-specific mode

## Serial-Only vs Override Disabled

- `serialOnlyPrompts`
  - orchestration still applies, but sequentially
- `overrides.<prompt>.enabled: false`
  - orchestration is disabled for that prompt

Choose based on whether you want policy governance to remain active for that prompt.

## How To Update Safely

When changing policy:
1. Edit `config/prompt-execution-policy.json`

## Quick Checklist

- Want global safe parallelization? Set `orchestration.enabled: true` and `defaultMode: safe-parallel`
- Want some prompts always sequential? Add to `serialOnlyPrompts`
- Want one prompt excluded from orchestration? Use `overrides.<prompt>.enabled: false`
- Want manual prompt invocation only? Do not add policy fields that imply prompt chaining

---

If you follow this guide, you can tune prompt execution behavior without editing every prompt file.
