# BPMN Domain Standards

## Purpose
Define production-grade rules for BPMN derivation, generation, and review.

## Applies To
- BPMN analysis and flow derivation
- BPMN XML generation and validation
- Workflow review and correction

## Required Rules
- Model only behavior grounded in source requirements.
- Keep start/end conditions explicit and deterministic.
- Capture decision logic with clear gateway semantics.
- Represent integration boundaries and error paths explicitly.
- Preserve traceability from BPMN elements to requirement evidence.

## Modeling Expectations
- Use stable naming for tasks and events.
- Ensure all paths converge or terminate intentionally.
- Include timeout/retry/escalation behavior where applicable.
- Separate business flow from technical implementation details.

## Avoid
- Orphan nodes or unreachable paths
- Implicit business rules not represented in the model
- Overloaded tasks with mixed responsibilities

## Review Checklist
- Is the process valid and executable?
- Are gateways and conditions unambiguous?
- Are exception and compensation paths modeled where needed?
- Is requirement traceability preserved?
