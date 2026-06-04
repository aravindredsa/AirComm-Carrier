# Skill: DB Schema Design

## Skill ID
`skill-db-schema-design`

## Purpose
This skill guides the AI through the full DB schema design workflow for the defaultClientId/defaultClientId project — from raw JSONB source data analysis through customer-approved schema artifacts.

---

## Trigger Conditions

Activate this skill when the user:
- Asks to design or generate a schema for a new module
- Provides JSONB source data and asks for a Data Dictionary
- Asks to apply customer review comments to existing artifacts
- Asks to generate ER diagrams or T-SQL scripts

---

## Skill Steps

1. **Normalize source data** (if JSONB): Use `/DB_normalize-json-source` to identify entities, attributes, and relationships
2. **Generate Data Dictionary**: Use `/DB_generate-data-dictionary` to produce the full DD with all metadata
3. **Generate Schema Script**: Use `/DB_generate-schema-script` from the DD
4. **Generate ER Diagram**: Use `/DB_generate-er-diagram` from the DD
5. **Validate consistency**: Use `/DB_generate-gap-analysis` to confirm all three artifacts are aligned

---

## Standards Applied

- Resolve standards through `config/standards-resolution-policy.json`, `config/client-profiles.json`, and `config/standards-catalog.json`.
- Apply shared markdown and security baselines first, then the resolved DB domain standards, then the resolved database and SQL capability standards, then any active client overlay requirements.

---

## Output Artifacts

| Artifact | Location |
|---|---|
| Data Dictionary | `artifacts/data-dictionary/DataDictionary_<Module>_V<N>.md` |
| Schema Script | `artifacts/schemas/Schema_<Module>_V<N>.sql` |
| ER Diagram | `artifacts/er-diagrams/ER_<Module>_V<N>.drawio` |
| Gap Analysis | `artifacts/gap-analysis/GapAnalysis_<Module>_<YYYY-MM-DD>.md` |
