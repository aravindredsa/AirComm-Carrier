# Derive BPMN Flow From Analysis

## Purpose
Guide users through converting analysis JSON into BPMN design JSON aligned to Camunda 8 and defaultClientId orchestration boundaries.

## Inputs
- structured analysis JSON from BRD analysis step
- orchestration and ownership constraints

## Recommended Workflow
1. Validate analysis JSON completeness.
2. Run `/bpmn-derive-bpmn-flow-from-analysis`.
3. Confirm explicit process type, sequencing, gateways, and message-flow mapping.
4. Validate uncertain edges are marked conservatively.
5. Pass resulting design JSON to BPMN XML generation.

## Output
- BPMN design JSON object per skill schema

## Notes
- This playbook stage should not produce BPMN XML.
