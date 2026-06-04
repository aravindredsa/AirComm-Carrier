# Capability Governance Baseline

## Purpose
Define cross-capability governance rules that apply to all technology-specific standards.

This baseline is shared across stacks and is loaded as part of the common standards layer.

## Normative Language
- `MUST`: mandatory requirement
- `SHOULD`: strongly recommended unless an approved exception exists
- `MAY`: optional with rationale

## Exception Policy
- Exceptions to `MUST` rules require documented approval, mitigation, and expiry.
- Exception approvals `MUST` identify owner, scope, risk, and planned remediation date.
- Temporary exceptions `SHOULD` include compensating controls and monitoring.

## Evidence and Traceability Baseline
- Standards-sensitive changes `SHOULD` include:
  - rules applied
  - exception references (if any)
  - verification evidence (tests, analysis, or operational checks)
- Reviews `SHOULD` maintain traceability from requirement to validation outcome.

## Quality Gate Baseline
- Critical-path changes `MUST` pass required quality gates before promotion.
- Security, reliability, and contract-impacting changes `MUST` include explicit verification evidence.
- Release decisions `SHOULD` be auditable with clear approval records.

## Review Baseline
Use this cross-capability baseline during reviews:
- Are normative requirements interpreted consistently?
- Are exceptions approved, bounded, and time-limited?
- Is validation evidence sufficient for risk level?
- Is operational ownership and follow-up clear?
