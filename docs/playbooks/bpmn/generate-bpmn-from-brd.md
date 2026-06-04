# Generate BPMN From BRD

## Purpose
Guide users through generating grounded Camunda 8 BPMN XML from requirement sources using strict staged derivation.

## Inputs
- BRD as primary source, FRD/LLD as secondary refinements
- optional output filename preference

## Recommended Workflow
1. Validate requirement clarity and resolve blocking ambiguity.
2. Run `/bpmn-generate-bpmn-from-brd`.
3. Confirm extraction and deterministic flow derivation occur before XML transformation.
4. Validate allowed-element constraints and messagePublisher conventions.
5. Save output to `artifacts/bpmn/<name>.bpmn` when file output is requested.

## Output
- Camunda 8 BPMN XML (inline or file, based on user request)

## Notes
- Preserve a zero-hallucination policy: only model behavior grounded in source evidence.
