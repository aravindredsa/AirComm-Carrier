# LLD Template (From FRD and/or Feature Document)

Use this structure for implementation-ready LLD generation.

## 1. Document Header
- Title
- Version
- Date
- Source FRD reference (`provided` or `not provided`)
- Feature Document reference (`provided` or `not provided`)
- Resolved stack and rationale

## 2. Scope
- In scope
- Out of scope

## 3. Assumptions, Dependencies, and Risks
- Assumptions
- External dependencies
- Risks from missing source details
- Risks from FRD/Feature Document conflicts (if any)
- Cross-stack risks (if applicable)

## 4. FRD/Feature to LLD Traceability Matrix
Columns:
- Source (`FRD` or `Feature Document`)
- Source ID or section
- Requirement summary
- LLD module/component
- Interface/data artifact
- Status (`Designed` or `Needs Clarification`)

## 5. Architecture Decomposition
- Module breakdown
- Responsibilities
- Boundaries and interactions

## 6. Detailed Design by Module
For each module:
- Purpose
- Inputs/outputs
- Processing logic
- Business rules mapping
- Validation logic
- Error and exception handling
- Edge cases
- Idempotency/retry behavior (where relevant)

## 7. Interface Design
When interfaces are present:
- Endpoint or operation
- Method
- Request/response contract
- Validation rules
- Error codes/messages
- Security/auth controls

## 8. Data Design
When persistence is present:
- Entities/tables
- Field constraints
- Keys and relationships
- Index recommendations
- Data retention/lifecycle notes

## 9. Non-Functional Design
- Performance
- Security
- Scalability
- Availability
- Observability and auditability

## 10. Testing Guidance
- Unit test focus
- Integration test scenarios
- Negative and edge-case tests
- Coverage notes mapped to source requirements

## 11. Open Questions
- Numbered unresolved items requiring clarification

## 12. Implementation Readiness Checklist
- Modules complete
- Contracts complete
- Error paths complete
- Data design complete
- Blockers listed

## 13. Output Metadata
- LLD file path saved
- Source coverage summary (`FRD only`, `Feature only`, or `FRD + Feature`)
