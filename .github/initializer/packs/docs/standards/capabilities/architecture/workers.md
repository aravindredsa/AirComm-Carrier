# Worker Architecture Capability Standards

## Purpose
Define enforceable standards for background processing, scheduled jobs, and long-running worker services.

## Scope
Applies to queues, schedulers, cron-style jobs, hosted workers, and batch processing services.

## Workload Design
- `MUST` define input contract, output effect, and ownership for each worker flow.
- `MUST` define idempotency strategy for retryable tasks.
- `MUST` separate orchestration concerns from task business logic.
- `SHOULD` keep job units small and retry-friendly.

## Reliability and Failure Handling
- `MUST` define timeout, retry, and backoff policies.
- `MUST` define poison-message/dead-letter behavior for unrecoverable failures.
- `MUST` support safe restart and graceful shutdown behavior.
- `SHOULD` define checkpointing/resume strategy for long-running tasks.

## Concurrency and Capacity
- `MUST` define concurrency limits and resource protection safeguards.
- `MUST` prevent duplicate side effects under at-least-once execution.
- `SHOULD` document throughput targets and backlog alert thresholds.

## Security and Data Handling
- `MUST` use least-privilege credentials for worker dependencies.
- `MUST` avoid logging sensitive payload content.
- `MUST` validate untrusted input before processing.

## Observability and Operations
- `MUST` emit metrics for queue depth, lag, retries, and failure rates.
- `MUST` include correlation identifiers for traceability.
- `SHOULD` maintain runbooks for replay and failure recovery.

## Testing and Quality Gates
- `MUST` include tests for success, retry, timeout, and dead-letter behavior.
- `MUST` include idempotency verification for critical workflows.
- `MUST` block release when worker critical-path tests fail.

## Review Checklist
- Are worker contracts, ownership, and idempotency explicit?
- Are failure, retry, and shutdown behaviors safe?
- Are concurrency and capacity controls defined?
- Are observability and recovery runbooks sufficient?
