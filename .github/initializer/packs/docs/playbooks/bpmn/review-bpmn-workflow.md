# Review BPMN Workflow

## Purpose
Guide users through reviewing and correcting existing Camunda 8 BPMN XML for structural validity, BRD grounding, and defaultClientId compliance.

## Inputs
- existing BPMN XML
- requirement context (BRD/FRD/LLD)

## Recommended Workflow
1. Gather BPMN XML and source requirement evidence.
2. Run `/bpmn-review-bpmn-workflow`.
3. Validate schema integrity, graph correctness, IDs, and message references.
4. Apply fixes for grounding gaps and modeler compatibility issues.
5. Save corrected BPMN and review notes.

## Output
- corrected BPMN XML
- fixes-applied section
- grounding notes section

## Notes
- Flag and correct hallucinated elements that lack requirement evidence.