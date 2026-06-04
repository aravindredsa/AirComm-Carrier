# Standards Resolution Policy Guide

## 1) Purpose

This guide explains how the client-plus-capability standards model resolves rules, templates, and overlays in the unified enabler.

Policy files:
- `config/standards-resolution-policy.json`
- `config/client-profiles.json`
- `config/standards-catalog.json`

Primary instruction binding:
- `.github/copilot-instructions.md` (Standards Resolution and Standards Application sections)

## 2) Where This Policy Is Used

The policy is consumed as decision data when standards-sensitive workflows need to choose:
- active client profile
- applicable domain standards
- applicable capability standards
- client overlay files
- output template mapping

It is intended for:
- full-codebase audits
- uncommitted-change audits
- BA, BPMN, QA, DB, frontend, backend, and implementation workflows that need standards resolution

## 3) Decision Architecture

Standards are resolved in this order:
1. explicit client direction
2. prompt naming/scope hints
3. prompt/source capability signals
4. files and precedence in `config/standards-resolution-policy.json`
5. applicable entries in `config/standards-catalog.json`

Then standards are applied in this order:
1. `docs/standards/common/`
2. `docs/standards/domains/<domain>/`
3. `docs/standards/capabilities/<group>/<capability>/`
4. `docs/standards/clients/<client>/overlays/`
5. prompt-level rules (if stricter)

## 4) Schema Walkthrough

### Top-Level Keys
- `schemaVersion`: policy schema version
- `mode`: client-plus-capability routing mode
- `defaultClientId`: default client profile when one is not explicitly provided
- `resolutionOrder`: precedence of standards layers
- `rules`: selection, conflict, traceability, and onboarding behavior

### rules.selection
- `promptIntent`: how workflow intent is used to choose the domain
- `capabilities`: how technology signals are mapped to capabilities
- `client`: how the active client profile is chosen
- `fallback`: behavior when a capability match does not exist

### rules.conflictHandling
- `commonSafetyRules`: non-downgradable shared security and evidence rules
- `specificity`: precedence for non-safety rules
- `narrowing`: how overlays may narrow requirements

### rules.traceability
- `required`: whether selection reasons are captured
- `includeSelectedFiles`: whether file list is included
- `includeReasoning`: whether rationale is included
- `includeConflictNotes`: whether conflicts are recorded

## 5) Per-Layer Behavior Summary

### common
- Applies to every client, workflow, and capability.
- Security, privacy, and evidence rules are always active.

### domain
- Applies to BA, BPMN, QA, and DB workflows.
- Describes workflow-specific quality expectations.

### capability
- Applies when language, framework, testing, data, platform, or architecture signals are present.
- Keeps technical rules reusable across clients.

### client overlay
- Applies only when the selected client needs a stricter or narrower rule.
- Must not duplicate universal rules unless needed for clarity.

## 6) Template Resolution Logic

Given a resolved client and standards set:
1. Read the resolved catalog entry for the prompt/workflow.
2. Apply any client-specific template mapping or output file naming rule.
3. If no dedicated template exists, follow the prompt's required output structure and call out the fallback.

## 7) Operational Examples

### Example A: Explicit Client Request
- User asks for a client-specific audit.
- Client profile is forced to that client regardless of signal overlaps.
- Apply common + resolved domain/capability standards and client overlays.

### Example B: Mixed Capability Signals, No Explicit Client Direction
- Changed files include `.tsx` and `.cs`.
- Apply capability signals to identify the primary business scope and relevant capability files.
- Explicitly note cross-capability risks in the output.

## 8) Change Management Rules

When editing the standards resolution files:
1. Keep descriptions, signals, and precedence aligned with actual repository conventions.
2. Ensure referenced files exist.
3. Ensure client profiles and capability mappings remain internally consistent.
4. Update this guide if keys or resolution behavior changes.

## 9) Validation Checklist

- JSON parses successfully.
- New client profile has overlay path and capability coverage.
- Template mapping points to real files or intentional fallback guidance.
- No conflict with `.github/copilot-instructions.md` standards resolution order.
