# Generate BPMN Workflow From Story

## Purpose
Guide users through generating Camunda 8 BPMN workflow files from requirement documents and story context, with attachment-first input handling.

## Inputs
- attached requirement files (BRD/Requirement first, then FRD, then LLD)
- optional user-story supplements
- workspace references in `samples/requirements`, `samples/bpmn`, and `templates/bpmn/`

## Recommended Workflow
1. Identify primary attachment source by precedence.
2. Run `/bpmn-generate-bpmn-workflow-from-story`.
3. Validate extraction priority for Post Action and Tasks Triggered sections.
4. Confirm naming, gateway usage, and messagePublisher conventions match prompt rules.
5. Write BPMN XML to `artifacts/bpmn/<normalized-filename>.bpmn` and confirm path.

## Output
- BPMN workflow file in `artifacts/bpmn/`
- assumptions and validation checklist summary

## Notes
- Do not deliver XML in chat when file-write output is required.
