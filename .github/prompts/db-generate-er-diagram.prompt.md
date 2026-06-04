---
agent: 'agent'
description: Generate a draw.io ER diagram XML file showing all table relationships for a given module from the approved Data Dictionary or schema script.
---

## Skill Dependency (Mandatory)
- Apply `.github/skills/skill-db-schema-design/SKILL.md` before executing this workflow.
- Keep this prompt's diagram rules and output location as final authority when more specific.

# DB: Generate ER Diagram

## Purpose

Produce a draw.io-compatible ER diagram (`.drawio` XML format) showing all entities, attributes, and relationships for the given module. The diagram is shared with the customer alongside the Data Dictionary and schema script for review.

## Input

- Approved Data Dictionary: `artifacts/data-dictionary/DataDictionary_<ModuleName>_<Version>.md`
- Or schema script: `artifacts/schemas/Schema_<ModuleName>_<Version>.sql`
- Module name for diagram title

## Diagram Rules

### Entities
- Each table = one entity rectangle
- Show table name (UPPER_SNAKE_CASE) as entity header
- Show column list inside entity box:
  - PK columns first, prefixed with 🔑 or `PK`
  - FK columns labeled with `FK`
  - Other columns listed below

### Relationships
- Show a line for each FK relationship
- Line style: crow's foot notation
  - One-to-many: solid line, crow's foot on the "many" end
  - One-to-one: solid line, single tick on each end
  - Optional: open circle on optional end
- Label the relationship line with the FK column name

### Layout
- Group logically related tables close together
- Parent tables (no FK dependency) toward the top-left
- Child/junction tables below or to the right of their parent
- Lookup tables grouped in a separate region with a dotted boundary

### draw.io XML Format
Produce valid draw.io XML using `<mxGraph>` and `<mxCell>` elements.

Template for entity:
```xml
<mxCell id="table_BIDDER_INFO" value="BIDDER_INFO" style="shape=table;..." vertex="1" parent="1">
  <mxGeometry x="..." y="..." width="200" height="..." as="geometry"/>
</mxCell>
```

Template for relationship edge:
```xml
<mxCell id="fk_BIDDER_TRACKING_BidderId" style="edgeStyle=entityRelationEdgeStyle;..." edge="1" source="table_BIDDER_TRACKING" target="table_BIDDER_INFO" parent="1">
  <mxGeometry relative="1" as="geometry"/>
</mxCell>
```

## Output Location

- Save as `artifacts/er-diagrams/ER_<ModuleName>_<Version>.drawio`
- Also produce a brief markdown summary: `artifacts/er-diagrams/ER_<ModuleName>_<Version>_summary.md`
  - List all entities, their column counts, and their relationships

## Quality Rules

- Every FK in the Data Dictionary must produce a relationship line.
- No orphan entities (every non-root table must have at least one relationship line).
- Diagram XML must be parseable by diagram editor tools supported by the project standards.
- Lookup tables must be visually distinct (different fill color or grouped area).

## Do Not

- Do not omit tables present in the Data Dictionary.
- Do not add tables not in the Data Dictionary.

## Prompt Usage Logging (Required)

After successful completion of this workflow, run:

```bash
node .github/initializer/tools/log-prompt-usage.js --prompt-path=.github/prompts/db-generate-er-diagram.prompt.md
```
