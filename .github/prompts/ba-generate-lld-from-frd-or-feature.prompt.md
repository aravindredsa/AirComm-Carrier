---
agent: 'agent'
description: 'Generate implementation-ready LLD from FRD and/or Feature Document using stack-aware routing configuration when available'
---

## Skill Dependency (Mandatory)
- Apply `.github/skills/skill-ba-analysis/SKILL.md` before executing this workflow.

# Generate LLD from FRD and/or Feature Document

## Purpose
Generate an implementation-ready Low Level Design (LLD) from the provided Functional Requirements Document (FRD) and/or Feature Document.

## Inputs
1. FRD content (optional)

2. Feature Document content (optional)

3. Standards routing configuration (optional but preferred):
`config/standards-resolution-policy.json`

4. Explicit user stack override (optional)

5. LLD output path:
${input:lldFilePath:artifacts/lld/LLD_feature-name_YYYY-MM-DD.md}

At least one functional source is required: FRD or Feature Document.

## Source Priority and Grounding (Mandatory)
Use this priority order when both documents are available:
1. FRD (authoritative business source)
2. Feature Document (supplementary functional and implementation context)
3. Explicit user constraints

When only one document is available, use that document as the primary source and clearly state this in assumptions.

If FRD and Feature Document conflict:
- Keep FRD as authoritative for business intent.
- Record the conflict under `Open Questions` and `Risks`.
- Do not invent reconciliations.

## Standards Resolution (Mandatory)
Resolve active standards in this order:
1. Explicit user direction (`client=<client-id>`)
2. Prompt/domain scope (`ba-` context)
3. Signals and policies from `config/standards-resolution-policy.json` and `config/client-profiles.json`

If multiple capability areas match, select the primary business scope and explicitly document cross-capability risks.

## Task
1. Validate that at least one source document is provided (FRD or Feature Document).
2. Read and interpret available source requirements with strict traceability to requirement IDs or section references.
3. If both FRD and Feature Document are provided, use the Feature Document to enrich technical decomposition, integration notes, and delivery constraints.
4. Produce module-level and component-level technical design from grounded behavior.
5. Apply stack-aware detail depth using resolved stack context.
6. Document assumptions and open questions instead of inventing missing business rules.
7. Save the final LLD document to the provided LLD output path.

## Output Template (Required)
Use this template as the required output structure:
`templates/ba/lld-from-frd-or-feature-template.md`

## Quality and Guardrails
- Do not invent business features not present in provided source documents.
- Mark technical inference as `Inferred from FRD` or `Inferred from Feature Document`.
- Be explicit and implementation-focused.
- Avoid placeholders such as `TBD` unless unavoidable.
- Apply standards resolved through `config/standards-resolution-policy.json`, `config/client-profiles.json`, and `config/standards-catalog.json` in the standard order: shared first, then resolved domain, capability, and client overlay standards.
- If no output path is provided, use `artifacts/lld/LLD_feature-name_YYYY-MM-DD.md`.

## Prompt Usage Logging (Required)

After successful completion of this workflow, run:

```bash
node .github/initializer/tools/log-prompt-usage.js --prompt-path=.github/prompts/ba-generate-lld-from-frd-or-feature.prompt.md
```