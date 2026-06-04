# Event-Driven Architecture Capability Standards

## Purpose
Define enforceable standards for event-driven design, messaging contracts, and asynchronous workflow reliability.

## Scope
Applies to domain events, integration events, message brokers, and event-processing workflows.

## Event Contract Standards
- `MUST` define explicit event schemas and ownership per event type.
- `MUST` include stable identifiers, timestamp, and producer metadata.
- `MUST` preserve compatibility for consumers or use versioned event evolution.
- `SHOULD` include contract registry or equivalent schema governance.

## Delivery and Processing Semantics
- `MUST` define at-least-once/at-most-once/exactly-once expectations explicitly.
- `MUST` implement idempotent consumers for retry-prone flows.
- `MUST` define dead-letter handling and replay strategy.
- `SHOULD` separate transient retry from poison-message handling.

## Ordering, Partitioning, and Throughput
- `MUST` define ordering guarantees where business logic depends on sequence.
- `MUST` define partition key strategy for scalability and affinity.
- `SHOULD` document expected throughput and backlog thresholds.

## Security and Compliance
- `MUST` protect event channels with authenticated producer/consumer access.
- `MUST` avoid sensitive data exposure in event payloads unless required and approved.
- `MUST` define retention and deletion policies aligned to compliance needs.

## Observability and Operations
- `MUST` emit metrics for lag, retries, failures, and dead-letter volume.
- `MUST` include correlation identifiers across event chains.
- `SHOULD` define runbooks for replay, reprocessing, and incident mitigation.

## Testing and Quality Gates
- `MUST` include producer and consumer contract tests.
- `MUST` include failure/retry/dead-letter path tests for critical event flows.
- `MUST` block release for unresolved critical contract incompatibilities.

## Review Checklist
- Are event contracts stable and owned?
- Are processing semantics and idempotency explicit?
- Are failure, replay, and DLQ paths operationally ready?
- Are observability and compliance controls sufficient?
