# Copilot Instructions - AI Universal Enabler

This file is auto-loaded by GitHub Copilot for this workspace.

## Workspace Role

This repository is a unifier enabler, not a single-stack project implementation.

- It supports frontend, backend, QA, DB, BA, and BPMN workflows.
- It contains prompts, skills, standards, templates, playbooks, artifacts, and initializer pack sources.

## Workflow Resolution

Use workflow intent first when deciding how to work:

1. determine the domain or role from the user request and prompt scope (for example: BA, BPMN, analysis, implementation, testing, or documentation)
2. load `config/standards-resolution-policy.json` and `config/client-profiles.json` to resolve the active client profile and standards layers
3. use `config/standards-catalog.json` to identify the required common, domain, capability, and client overlay files for the current task
4. if multiple capability areas are involved, prefer the primary business scope and explicitly note cross-capability risks

## Standards Resolution (Mandatory)

Before making standards-sensitive changes, resolve the active standards set using this order:

1. explicit client selection when provided
2. default client profile from `config/client-profiles.json` when no client is specified
3. prompt intent and domain scope
4. capability signals from the requested work and source files
5. required common, domain, capability, and client overlay standards in that order

BA and BPMN workflows are guided primarily by prompt/domain scope and their own standards/templates. They do not depend on stack-centric routing.

When multiple capabilities are affected, apply shared standards first, then each applicable capability set, then the client overlay.

## Standards Application Order

Always apply standards in this order:

1. `docs/standards/common/`
2. `docs/standards/domains/<selected-domain>/`
3. `docs/standards/capabilities/<capability-group>/<capability>/`
4. `docs/standards/clients/<client>/overlays/`
5. prompt-level rules (if a prompt states stronger constraints)

If constraints conflict, prompt-level requirements take precedence for that workflow.

## Domain and Capability Guidance

Use the relevant domain and capability files based on the current workflow and technology profile:

- BA: `docs/standards/domains/ba/`
- BPMN: `docs/standards/domains/bpmn/`
- Common capability examples: language, framework, testing, data, platform, and architecture files

Do not apply a capability rule outside its actual scope. For example, do not apply React-specific rules to a non-React workflow.

## Prompt Execution Policy (Mandatory)

Before executing any prompt, load `config/prompt-execution-policy.json` and apply it as runtime policy.

Policy rules:
- If `orchestration.enabled` is `false`, execute prompt workflow sequentially.
- If prompt file name appears in `orchestration.serialOnlyPrompts`, execute sequentially.
- If prompt has an entry in `orchestration.overrides`, the override takes precedence over global defaults.
- `mode: safe-parallel` means only independent/read-only analysis steps may run in parallel; final synthesis and report assembly must remain sequential.
- If orchestration is enabled, run final validation checks configured under `orchestration.validation` and prompt-level `overrides.*.validation`.
- If required validation fails, return `NEEDS_REVISION` or `FAIL` with remediation steps instead of returning a success outcome.

If the policy file is missing or invalid JSON, fall back to `orchestration.fallbackMode` when available; otherwise use sequential mode.

## Model Routing Policy (Recommended)

Load `config/model-routing-policy.json` to optimize token usage by routing tasks to appropriate models.

For automatic prompt execution, treat `config/model-routing-policy.json` as the source of truth for model selection. User-selected chat model always overrides it.

**Model selection hierarchy** (applies to automatic prompt execution):
1. **User manual selection in chat UI** — Highest priority, overrides all policies
2. **Task category match** — Check if prompt name contains triggers in `taskCategories` (e.g., "audit" → Opus, "search" → Haiku)
3. **Complexity detection** — If no category match, scan prompt content for complexity signals:
   - High: "full codebase", "all files", "architecture" → Use Opus
   - Medium: "single file", "specific method", "targeted" → Use Sonnet
   - Low: "search", "find", "pattern", "validate" → Use Haiku
4. **Default model** — Falls back to `defaultModel` (Opus) if no signal detected

**Token optimization strategy:**
- **Opus (claude-opus-4-1)**: Complex analysis, code generation, full-codebase audits (∼15x cost baseline)
- **Sonnet (claude-sonnet-4-20250514)**: Single-file refactoring, migration fixes, medium complexity (∼1x cost)
- **Haiku (claude-haiku-3-5)**: Search, validation, quick checks (∼0.1x cost baseline)

**Note:** These policies are advisory for manual Copilot chat interactions, but they are authoritative for automated prompt execution flows that load them. Token budgets are recommended baselines, not hard limits.

## Prompt/Skill/Template Consistency Rules

- Keep prompt, skill, template, playbook, and standards references synchronized.
- If a prompt/workflow is added for a stack, ensure corresponding playbook/template/skill wiring is present when required.
- For docs-only operational guidance, keep playbooks human-focused and not runtime dependencies.

## Initializer and Pack Rules

- Mirror managed content changes into `.github/initializer/packs/` equivalents.
- Re-sync manifest metadata after managed-source changes:
	- `node .github/initializer/tools/sync-seed-manifest.js`
- Keep workspace and pack parity for managed areas (prompts, skills, docs, templates, config as applicable).

## Release Notes Rules

- When `.github/prompts/initialize-ai-workspace.prompt.md` or `.github/prompts/reset-ai-workspace.prompt.md` changes in a significant user-facing way, append one consolidated entry to root `initializer-release-notes.md` in the same change set.
- Significance includes path adds/removes/renames, meaningful seeding-content changes, workflow/order changes, new required user actions, and compatibility-impacting behavior.
- Do not record micro-iterations.
- Honor explicit user instruction to include or omit release-note items.
- Release-note issues are non-blocking for initialization/reset workflows.

## Authoring Rules for Missing Prompt Files

For each missing or empty prompt file other than `initialize-ai-workspace.prompt.md` and `BA_reverse-engineer-application.prompt.md`:

- if file exists with meaningful content, skip
- if missing or empty, add starter content adapted to filename

Starter structure:

- frontmatter
	- `agent: 'agent'`
	- `description: short description`
- body
	- title
	- purpose
	- task
	- output rules
		- use existing workspace standards
		- do not overwrite meaningful files unless explicitly asked
