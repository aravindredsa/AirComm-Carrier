# Standards Resolution User Guide

## 1. Purpose

This guide explains the standards architecture used by this enabler, how standards are selected for any workflow, and how to onboard and package for a client safely.

Who this guide is for:
- Maintainers who evolve standards, prompts, and skills.
- Delivery owners who onboard a new client profile.
- Engineers who need to troubleshoot why a specific standard was or was not applied.
- Release owners preparing a clean single-client distribution.

What you should be able to do after reading:
- Understand how layered standards resolution works end to end.
- Know where a rule should live before you add or edit it.
- Safely onboard or replace a client profile without breaking baseline behavior.
- Validate parity between workspace files and pack mirrors.

Use this guide when you need to:
- understand how common, domain, capability, and client-overlay layers work together
- find where to add or change standards
- onboard a new client
- prepare a clean single-client distribution

## 2. Strategy Overview

The standards model is built on four layers:

1. Common
2. Domain
3. Capability
4. Client Overlay

The resolver applies these in order so outputs remain both reusable and client-aware.

Core intent of this architecture:
- Keep universal rules reusable across clients.
- Keep workflow rules separated from technology rules.
- Keep client-specific deltas isolated in overlays.
- Keep safety constraints (security/privacy/evidence) non-downgradable.

Primary resolver policy:
- config/standards-resolution-policy.json

How to think about the strategy in practice:
- Common gives consistency.
- Domain gives workflow correctness.
- Capability gives technical correctness.
- Overlay gives client fit.

If a rule is placed in the wrong layer, one of two failures usually appears:
- A reusable rule gets trapped in a client overlay and cannot be reused cleanly.
- A client-specific preference leaks into baseline and affects all clients unintentionally.

Success criteria for this model:
- The same workflow behaves consistently across clients unless an explicit overlay delta exists.
- Security and privacy constraints remain stable even when overlays are applied.
- A new client can be onboarded by configuration and overlay updates, without restructuring baseline standards.

### 2.1 Why Client Overlay Is Last

Question:
- Should client standards have first preference instead of being last in resolution order?

Short answer:
- In this architecture, client-specific rules do get effective precedence for client-specific behavior, but they are applied after baseline layers so they cannot accidentally replace universal safety and quality guardrails.

Current design intent:
- Base layers (common, domain, capability) establish reusable, cross-client correctness.
- Client overlay applies approved client deltas on top of that baseline.
- Conflict handling keeps common safety constraints non-downgradable.

Why this is safer for a universal enabler:
- Prevents client-specific wording or process choices from leaking into universal standards.
- Keeps security/privacy/evidence baselines stable across all clients.
- Preserves portability: new clients can be onboarded by adding overlays, not by rewriting baseline standards.

How client precedence works in practice:
- For non-safety rules, more specific applicable layers can override broader rules according to resolver policy.
- Client overlays should be additive or narrowing, not duplicative.
- If a client rule becomes broadly reusable, promote it into common/domain/capability and remove it from overlay.

When client-first can be appropriate:
- The workspace is intentionally single-client and not expected to stay universal.
- Client terminology and operating model should dominate by default.
- Even then, keep common safety constraints protected from downgrade.

## 3. Architecture At A Glance

### 3.1 Runtime Flow (text fallback)

This is the plain-language resolution flow used at runtime:

1. Identify the workflow domain from request intent.
2. Load common standards.
3. Load matching domain standards.
4. Load matching capability standards (from detected signals).
5. Apply client overlay for the selected client profile.
6. Resolve conflicts with safety-first rules.
7. Produce output with traceability of selected standards.

What each runtime stage is responsible for:
- Domain identification sets the scope of workflow behavior (for example BA vs QA).
- Common and domain loading establish minimum quality and process correctness.
- Capability loading aligns implementation behavior with the active technical stack.
- Overlay application introduces approved client deltas only.
- Conflict resolution prevents lower-priority layers from weakening protected constraints.
- Traceability records what was selected so outcomes are auditable and reproducible.

### 3.2 Runtime Flow (diagram)

Resolver sequence:
1. Receive workflow request.
2. Identify domain from request intent.
3. Apply common standards.
4. Apply domain standards.
5. Apply capability standards.
6. Evaluate client selection.
7. Apply conflict handling.
8. Produce final effective standards set.
9. Generate output with traceability.

Client selection branch:

| Condition | Action |
|---|---|
| Client explicitly selected | Apply that client overlay. |
| No explicit client selected | Use policy defaults and fallback behavior. |

End state:
- Final effective standards set = common + domain + capability + applicable client overlay, after conflict rules.
- Output includes traceability for selected files, reasons, and conflicts.

How to use section 3 during reviews:
- When behavior looks wrong, verify where in the flow the drift started (domain, capability, or overlay).
- If expected standards are missing, inspect catalog mapping first before editing content files.
- If outputs vary unexpectedly between runs, validate client selection inputs and defaults.

Example runtime interpretation:
- Request: "Create QA test cases for a React checkout flow."
- Domain selected: qa.
- Capability groups typically selected: framework (React), testing, language (TypeScript/JavaScript), and possibly platform if CI/runtime constraints are in scope.
- Overlay selected: active client overlay from defaultClientId or explicit client input.

## 4. Folder Structure And Responsibilities

### 4.1 Canonical Standards Root

- docs/standards/common/
- docs/standards/domains/
- docs/standards/capabilities/
- docs/standards/clients/<client-id>/overlays/

How to read this structure:
- Start with common for universal rules.
- Add domain standards for workflow-specific quality expectations.
- Add capability standards for technology-specific implementation and verification rules.
- Apply client overlays last to introduce only client-specific deltas.

### 4.2 Common Layer

Path:
- docs/standards/common/

Why this layer exists:
- These are universal baseline rules that should apply to every workflow and client.

What belongs here:
- Cross-cutting output quality requirements (format, clarity, traceability).
- Security and privacy expectations that are mandatory across all workflows.
- Authoring behaviors that should not vary by technology or client.

What should not go here:
- Domain-specific process rules (those belong in domain).
- Framework/language implementation rules (those belong in capability).
- Client preferences (those belong in overlays).

Current files:
- markdown-output-standards.md
- prompt-writing-standards.md
- security-baseline.md

### 4.3 Domain Layer

Path:
- docs/standards/domains/

Why this layer exists:
- BA/BPMN/DB/QA quality expectations are workflow-specific and should not be mixed with language/framework implementation rules.

How to use this layer:
- Choose the domain by workflow intent first (for example, BA artifact generation vs QA test design).
- Apply only the domain set required by the request.
- If multiple domains are touched, apply the primary domain first and treat additional domains as cross-domain constraints.

Current domains:
- ba: requirements analysis, gap analysis, user stories, and document quality expectations.
- bpmn: workflow modeling quality, process semantics, and BPMN artifact correctness.
- db: schema/change-management/data-quality rules for database artifacts.
- qa: test design, execution evidence, and defect reporting quality constraints.

### 4.4 Capability Layer

Path:
- docs/standards/capabilities/

Why this layer exists:
- Technical rules must be reusable across domains and clients.

How to use this layer:
- Select capability sets using technology signals from the request and source files.
- Keep these rules implementation-focused (how to build, verify, and integrate correctly).
- Reuse the same capability files across BA/backend/frontend/QA workflows where relevant.

Groups:
- language: coding conventions and language-specific safety/quality rules (for example TypeScript, Java, SQL, Python).
- framework: framework-level patterns and constraints (for example React, Spring, .NET, or workflow runtimes) including structure and lifecycle expectations.
- testing: unit/integration/e2e strategy rules, evidence expectations, and reliability practices.
- data: data modeling, validation, migration, and contract-consistency rules across services and persistence layers.
- platform: environment and deployment expectations (runtime, cloud, container, configuration, observability integration points).
- architecture: cross-module design constraints such as boundaries, dependency direction, extensibility, and maintainability guardrails.

### 4.5 Client Overlay Layer

Path:
- docs/standards/clients/<client-id>/overlays/

Why this layer exists:
- Client-specific deltas (terminology, approval rules, formatting preferences, narrower constraints) belong here.

How to use this layer safely:
- Keep overlays minimal and delta-only.
- Do not duplicate baseline standards from common/domain/capability unless there is a true client-specific override.
- Never use overlays to weaken baseline security/privacy requirements.
- When a client rule becomes broadly reusable, promote it into common/domain/capability and remove it from overlay.

Current active client structure (<client-id>):
- docs/standards/clients/<client-id>/overlays/backend/
- docs/standards/clients/<client-id>/overlays/frontend/
- docs/standards/clients/<client-id>/overlays/db/
- docs/standards/clients/<client-id>/overlays/qa/
- docs/standards/clients/<client-id>/overlays/bpmn/

Rule of thumb:
- If a rule is reusable across clients, move it into common/domain/capability instead of leaving it in overlay.

## 5. Config Control Plane (Most Important Section)

These files collectively define how standards are selected.

Why this section matters operationally:
- Most standards issues are not caused by writing quality, but by routing and mapping mistakes.
- A valid standards file can still be ignored if control-plane mapping is incomplete.
- Keeping these three files aligned is required for predictable runtime behavior.

### 5.1 config/standards-resolution-policy.json

Why it exists:
- It defines resolver behavior and conflict policy.

What it controls:
- resolution order
- client selection behavior
- fallback behavior
- conflict handling
- traceability requirements
- onboarding required metadata

How to read it quickly:
- Read resolution order first to confirm precedence.
- Read selection and fallback rules next to confirm how client/domain are inferred when inputs are partial.
- Read conflict and traceability blocks last to verify governance and auditability expectations.

Common mistakes to avoid:
- Changing fallback behavior without aligning client defaults in other config files.
- Loosening conflict rules in ways that allow baseline security/privacy constraints to be bypassed.
- Adding onboarding metadata requirements that are not reflected in onboarding templates.

Example change scenario:
- Goal: Require explicit client selection for external distribution workflows.
- Correct action: update selection/fallback behavior in this file and align onboarding metadata requirements.
- Follow-up action: verify defaultClientId alignment in client-profiles and standards-catalog to prevent unexpected fallback drift.

When to edit:
- changing precedence or fallback behavior
- changing traceability policy
- changing onboarding requirements

When not to edit:
- Do not change this file to solve a client-specific preference; use overlays.
- Do not encode capability-specific mappings here; use standards-catalog.

### 5.2 config/client-profiles.json

Why it exists:
- It defines client profile metadata and overlay binding.

What it controls:
- defaultClientId
- clients.<id>
- enabled capabilities for each client
- overlayPath for each client
- baseline expectations and guardrails

How to read it quickly:
- Confirm defaultClientId first.
- Verify the target client entry contains the correct overlay path and capability toggles.
- Check profile metadata completeness before onboarding automation is executed.

Common mistakes to avoid:
- Keeping multiple legacy client entries when packaging a single-client distribution.
- Using inconsistent client IDs across config files and folder paths.
- Pointing overlayPath to a folder that exists but does not contain the intended overlay scope files.

Example client profile entry (conceptual):
- client id: <client-id>
- overlayPath: docs/standards/clients/<client-id>/overlays/
- enabledCapabilities: <capability-id-1>, <capability-id-2>, <capability-id-3>
- Result: resolver can consistently bind client-specific deltas while retaining baseline standards.

When to edit:
- onboarding/replacing a client profile
- changing client capability activation
- changing client-specific guardrails

### 5.3 config/standards-catalog.json

Why it exists:
- It is the canonical map from conceptual layers to concrete file paths.

What it controls:
- common layer file list
- domain entries and appliesTo mapping
- capability groups, IDs, signals, and file mapping
- client entries and overlay roots
- sourceStrategy defaults

How to read it quickly:
- Start from layer blocks (common/domain/capability/client) to confirm coverage.
- Inspect capability signals to ensure runtime detection can discover the right files.
- Confirm client entries and sourceStrategy are aligned with active client packaging intent.

Why this file is critical:
- This is the single mapping source that ties resolver intent to actual standards files.
- If a standards file exists but is not mapped correctly here, it may not be applied reliably.

Common mistakes to avoid:
- Adding new standards files without catalog entries.
- Retaining stale paths after folder refactors.
- Defining capability IDs without matching detection signals.

Example mapping flow:
- You add a new capability file under docs/standards/capabilities/testing/playwright-quality.md.
- Required catalog update: add file path under the testing capability entry and ensure detection signals can trigger it.
- If catalog is not updated, the file exists but is not reliably applied during resolution.

When to edit:
- adding/removing standards files
- adding capability IDs/signals
- changing client overlay roots or client entries

## 6. Resolution Logic (Detailed)

Given any request/workflow:

1. Domain detection
- Determine BA/BPMN/DB/QA/implementation/testing intent.

Input signals commonly used:
- Request language, prompt scope, and task objective.
- Artifact type requested (for example FRD, BPMN, test package).
- Source file context where available.

Example:
- Request says "Generate BPMN flow for order exception handling".
- Domain detection should choose bpmn even if code snippets are also provided.

2. Common selection
- Include common baseline standards.

Expected output:
- Universal safety/quality baseline is active before any specialized rules are applied.

Example:
- Markdown output and security baseline rules are loaded before BPMN or QA-specific rules.

3. Domain selection
- Include matching domain standards.

Expected output:
- Workflow-specific quality constraints are now active for the selected domain.

Example:
- For a QA test-plan request, QA domain quality rules apply; BA story-writing conventions do not become primary.

4. Capability selection
- Match language/framework/testing/data/platform/architecture signals.
- Include mapped capability files.

Expected output:
- Technical implementation constraints are attached to the active workflow context.

Example:
- For a React + TypeScript request, framework and language capability files are selected alongside testing rules if tests are requested.

5. Client overlay selection
- Apply selected client overlay path.
- If no explicit client is provided, follow resolver default behavior.

Expected output:
- Client-specific deltas are layered without replacing baseline protections.

Example:
- If client overlay requires a specific terminology style, that vocabulary is applied while baseline security wording rules remain enforced.

6. Conflict resolution
- Common safety constraints cannot be weakened.
- More specific layers override broader layers for non-safety rules.

Expected output:
- Final effective ruleset is deterministic and policy-compliant.

Example:
- Overlay requests less strict evidence than baseline QA safety expectations.
- Resolver outcome: baseline safety expectation wins; overlay is applied only for non-conflicting formatting preferences.

7. Traceability
- Record selected files and rationale where required.

Expected output:
- Resolution evidence can be reviewed during audits, QA checks, and release validation.

Example:
- A generated artifact references selected common/domain/capability/overlay sources so reviewers can verify why specific output behavior occurred.

End-to-end example (compact):
- Request: "Create backend defect report template updates for the selected client using .NET service context."
- Selected layers:
  - Common: markdown-output-standards, security-baseline.
  - Domain: qa (defect reporting quality).
  - Capability: backend framework/language/testing as detected from context and catalog signals.
  - Overlay: docs/standards/clients/<client-id>/overlays/backend/ and/or qa overlay scope as mapped.
- Result: output is technically aligned, domain-correct, and client-specific without weakening baseline constraints.

## 7. New Client Onboarding

There are two supported paths.

Recommended onboarding sequence:
1. Collect client intent and constraints with the questionnaire.
2. Run automation in dry-run mode and review planned changes.
3. Apply changes and sync manifest metadata.
4. Validate config JSON and mirror parity.
5. Run a representative workflow to confirm expected standards selection.

Example onboarding timeline:
- Day 1: Complete questionnaire and prepare client id.
- Day 1: Run dry-run to inspect planned file changes.
- Day 1: Apply changes with sync-manifest.
- Day 1: Validate JSON, mirror parity, and one sample workflow from each critical domain.

### 7.1 Automated Onboarding (recommended)

Inputs:
- .github/initializer/client-inputs/client-onboarding-questionnaire.md
- .github/initializer/client-inputs/client-onboarding-response-template.md

Tool:
- .github/initializer/tools/onboard-new-client.js

Dry run:

```bash
node .github/initializer/tools/onboard-new-client.js \
  --input .github/initializer/client-inputs/client-onboarding-response-template.md \
  --client-id your-client-id \
  --dry-run
```

Apply and sync manifest:

```bash
node .github/initializer/tools/onboard-new-client.js \
  --input <completed-questionnaire-file> \
  --client-id your-client-id \
  --sync-manifest
```

What the script updates:

Workspace config:
- config/client-profiles.json
- config/standards-resolution-policy.json
- config/standards-catalog.json

Pack config mirror:
- .github/initializer/packs/root/config/client-profiles.json
- .github/initializer/packs/root/config/standards-resolution-policy.json
- .github/initializer/packs/root/config/standards-catalog.json

Client folders:
- docs/standards/clients/<client-id>/profile.yaml
- docs/standards/clients/<client-id>/overlays/README.md
- .github/initializer/packs/docs/standards/clients/<client-id>/...

Packaging behavior:
- Non-target client folders are removed from client roots (single-client distribution mode).

Why automated onboarding is preferred:
- Reduces manual drift across multiple control-plane files.
- Updates workspace and pack mirrors together.
- Produces predictable single-client packaging behavior with less cleanup risk.

Example automated outcome:
- Input: completed questionnaire for client acme.
- Script updates: control-plane configs, client folders, and pack mirrors.
- Packaging state: non-target client folders pruned for a clean acme-only distribution.

### 7.2 Manual Onboarding (fallback)

1. Update/add client in config/client-profiles.json.
2. Align default client in:
   - config/client-profiles.json
   - config/standards-resolution-policy.json
   - config/standards-catalog.json (sourceStrategy.clientDefault)
3. Update layers.clients.entries in config/standards-catalog.json.
4. Create docs/standards/clients/<client-id>/overlays/.
5. Mirror equivalent changes under .github/initializer/packs/.
6. Run manifest sync.

Manual path risk notes:
- Manual edits are error-prone when IDs, overlay paths, and catalog entries are not updated consistently.
- Always run JSON validation and mirror parity checks after manual onboarding.

Example manual pitfall:
- You add client entry in client-profiles but forget standards-catalog client mapping.
- Symptom: overlay folder exists, but resolver cannot consistently apply it.
- Fix: add missing catalog entry, revalidate JSON, then run parity and sample workflow checks.

## 8. Single-Client Distribution Checklist

Before external handoff:

1. Only target client remains in client profiles.
2. Only target client remains in catalog client entries.
3. default client values are aligned across control-plane files.
4. Only target client folder exists under docs/standards/clients/.
5. Pack mirrors reflect the same state.

Why each check matters:
- Mismatched client entries can cause unresolved overlays or wrong defaults at runtime.
- Misaligned defaults create non-deterministic behavior when client input is missing.
- Mirror drift causes packaged output to differ from workspace behavior.

Practical validation order:
1. Validate all control-plane JSON.
2. Confirm target client folder structure.
3. Confirm mirror parity for changed files.
4. Sync manifest metadata.
5. Build distribution artifact.

## 9. Operations Runbook

Run these steps in order during release preparation and after major config changes.

### 9.1 Validate Config JSON

```bash
node -e "['config/client-profiles.json','config/standards-catalog.json','config/standards-resolution-policy.json','.github/initializer/packs/root/config/client-profiles.json','.github/initializer/packs/root/config/standards-catalog.json','.github/initializer/packs/root/config/standards-resolution-policy.json'].forEach(f=>JSON.parse(require('fs').readFileSync(f,'utf8'))); console.log('OK')"
```

Expected result:
- Prints OK with no parse errors.

If this fails:
- Fix JSON syntax first, then re-run before any additional operation.

### 9.2 Sync manifest metadata

```bash
node .github/initializer/tools/sync-seed-manifest.js
```

Expected result:
- Manifest targets are refreshed to match current seeded files.

If this fails:
- Resolve missing/moved file references, then re-run sync.

### 9.3 Build distribution

```bash
node .github/initializer/tools/finalize-distribution.js --release=auto
```

Expected result:
- Distribution artifact is generated using the synchronized manifest state.

If this fails:
- Re-validate manifest sync status and client folder consistency before retry.

## 10. Troubleshooting

### 10.1 Diagram section appears empty

Use section 3.1 text flow. Mermaid support varies by renderer and settings.

Additional checks:
- Confirm markdown preview supports Mermaid rendering.
- Confirm code fence language tag is mermaid and not modified.

### 10.2 Wrong client overlay is applied

Verify:
- config/client-profiles.json defaultClientId
- config/standards-resolution-policy.json defaultClientId
- config/standards-catalog.json sourceStrategy.clientDefault

Then check:
- Target client exists in client profiles and catalog entries.
- overlayPath points to the expected folder.
- Pack mirror files are synchronized if issue appears only in packaged output.

### 10.3 Capability mapping from questionnaire is missing

Extend mapping logic in:
- .github/initializer/tools/onboard-new-client.js

Then verify:
- standards-catalog includes the capability ID and mapped files.
- capability signals are detectable from target workflow context.

## 11. Governance Rules

1. Universal rules belong to common/domain/capability.
2. Client overlays must remain delta-only.
3. Common safety constraints cannot be weakened.
4. Workspace and pack mirrors must stay synchronized.
5. standards-catalog.json is the canonical mapping file.

Governance intent behind these rules:
- Keep the baseline reusable and maintainable over time.
- Prevent client customizations from introducing cross-client regressions.
- Preserve safety and compliance posture across all workflows.
- Ensure packaged behavior is faithful to workspace behavior.

## 12. Key File Index

Control plane:
- config/standards-resolution-policy.json: resolver precedence, conflict policy, traceability, onboarding rules.
- config/client-profiles.json: active client profiles, defaults, capability toggles, overlay binding.
- config/standards-catalog.json: canonical mapping of layers, capability signals, and standards file paths.

Standards content:
- docs/standards/common/*: universal baseline guidance.
- docs/standards/domains/*: workflow/domain-specific quality rules.
- docs/standards/capabilities/*: technology and implementation constraints.
- docs/standards/clients/<client-id>/*: client profile metadata and overlay deltas.

Onboarding:
- .github/initializer/client-inputs/client-onboarding-questionnaire.md: intake questions for client constraints and expectations.
- .github/initializer/client-inputs/client-onboarding-response-template.md: structured response format consumed during onboarding.
- .github/initializer/tools/onboard-new-client.js: automation for applying onboarding responses across control-plane and mirror files.

Distribution:
- .github/initializer/manifest/seed-manifest.json: seeded file manifest used for packaging.
- .github/initializer/tools/sync-seed-manifest.js: manifest synchronization tool.
- .github/initializer/tools/finalize-distribution.js: distribution build tool.

Pack mirrors:
- .github/initializer/packs/root/config/*: mirrored control-plane config for packaged output.
- .github/initializer/packs/docs/standards/*: mirrored standards content for distribution parity.
