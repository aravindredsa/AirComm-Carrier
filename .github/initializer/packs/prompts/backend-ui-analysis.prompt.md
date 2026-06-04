## Skill Dependency (Mandatory)
- Apply `.github/skills/skill-backend-ba-analysis/SKILL.md` before executing this workflow.
- Keep this prompt's exhaustive extraction requirements and output structure as final authority when more specific.

You are required to generate a complete, exhaustive, fully detailed UI Analysis

Use ONLY the information contained in the attached documents

Output: generate an md and docx file in `artifacts/ui-analysis/`.
Filename must include today's date in `YYYY-MM-DD` format (example: `UI_Analysis_2026-04-09.md` and `UI_Analysis_2026-04-09.docx`).
verify that the document is complete across all sections and respective details for each section

Your output must:
- Fully extract, consolidate, normalize, and rewrite ALL relevant content
- Include EVERY requirement, rule, validation, workflow, field, and behavior mentioned
- Include NO invented logic and NO placeholders
- Include NO missing sections
- Represent the information in a clean, structured, fully expanded UI Analysis format
- Avoid jargon unless already present in the documents
- Maintain consistency across all sections

You MUST:
- Preserve ALL details from both documents, including:
  * All UI fields and their rules (mandatory/optional, values, constraints, formats)
  * All validations (field-level, form-level, workflow-level)
  * All SP names, purposes, data transformations, inputs/outputs
  * All workflow triggers, task transitions, and routing rules
  * All roles, permissions, and authorization behavior
  * All prepopulation logic
  * All dynamic visibility logic
  * All error handling rules
  * All system behaviors, state logic, and conditions
  * All risk, dependency, and contextual information relevant to requirements
  * All business purpose and context notes
  * All technical context relevant to requirements

You MUST expand each section thoroughly. DO NOT summarize if details exist in the uploaded file—expand them.

Use `templates/backend/ui-analysis-template.md` as the required output structure for the final document.

UI Analysis Structure (populate FULLY using extracted content):
1. Introduction
   - Purpose
   - Scope
   - Business Objectives
2. Process Overview
3. Roles & Permissions
4. Preconditions & Task Triggers
5. Functional Requirements
   - Detailed UI behavior
   - Conditional logic
   - Validation rules
   - Add/Delete logic
   - Save/Submit logic
   - Workflow integration
6. Prepopulating Data
7. Inputs & Field Rules (FULL detailed table with every field)
- Attribute name
- Section name - If the attribute is displayed under a section in the task
- Category
- Input type (Text box, drop down, Date picker etc.) - Applicable if an attribute is editable
- Allowed values - Applicable if an attribute is editable
- Mandatory/optional
- Validation rules/messages
- Prepopulated?
- Dynamic visibility?
- Calculated fields - if this field requires calculation
- Read-only or editable
- Data source
- Any constraints
- Logic for displaying - If any seller specific or state specific conditions exist for displaying the attribute
8. Use Cases / User Stories (each scenario in step-by-step detail)
9. Non-Functional Requirements
10. Acceptance Criteria (per functional rule)
11. Post-Action Workflow Behavior
12. Asset Status
13. Task Configuration (warning days, due days, adhoc, skip, postpone)
14. Notifications
15. Task History

Additional Required Output Rules:
- No placeholders (e.g., "TBD", "insert here")
- No omissions
- No invented rules not present in the documents
- Entire output must be complete and ready for Dev/QA/Product consumption
- Output must be formatted as a full Word-document-style text body
- Store output files in `artifacts/ui-analysis/`
- Include today's date in both output filenames using `YYYY-MM-DD`

Generate the full, final UI Analysis now.

## Prompt Usage Logging (Required)

After successful completion of this workflow, run:

```bash
node .github/initializer/tools/log-prompt-usage.js --prompt-path=.github/prompts/backend-ui-analysis.prompt.md
```
