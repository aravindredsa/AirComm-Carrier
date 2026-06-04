# Analyze BRD For BPMN

## Purpose
Guide users through extracting BPMN-ready structured analysis from BRD and related requirement documents.

## Inputs
- BRD, FRD, LLD, or user-story text
- workflow context, actors, trigger events, integration references

## Recommended Workflow
1. Gather requirement sources with BRD preferred.
2. Run `/bpmn-analyze-brd-for-bpmn`.
3. Validate extraction includes scope, actors, events, rules, and integrations.
4. Confirm sync vs async operations are separated.
5. Use output JSON as input for flow derivation.

## Output
- Structured analysis JSON per skill schema (no BPMN XML at this step)

## Notes
- Record uncertainty as explicit gaps rather than assumptions.
