# On-Prem Platform Capability Standards

## Purpose
Define enforceable standards for on-premises platform operations across security, reliability, and governance.

## Scope
Applies to datacenter-hosted applications, infrastructure dependencies, and operational procedures.

## Infrastructure and Environment Controls
- `MUST` document network, compute, storage, and identity assumptions explicitly.
- `MUST` define environment parity expectations across non-prod and prod tiers.
- `MUST` enforce controlled change windows and approval workflows for critical infrastructure changes.

## Security and Access Controls
- `MUST` enforce least-privilege access for platform and application operations.
- `MUST` secure secrets and certificates outside application source artifacts.
- `MUST` enforce patching and vulnerability management policy for hosts and dependencies.

## Reliability and Continuity
- `MUST` define backup, restore, and failover procedures for critical services.
- `MUST` define capacity thresholds and saturation handling.
- `MUST` test continuity and recovery procedures on a scheduled cadence.

## Observability and Operations
- `MUST` centralize logs/metrics and preserve auditability.
- `MUST` define alerting thresholds, ownership, and escalation flows.
- `SHOULD` maintain runbooks for top failure scenarios.

## Deployment and Governance
- `MUST` use controlled deployment pipelines or equivalent governed release process.
- `MUST` require pre-deployment validation and post-deployment checks.
- `MUST` maintain asset ownership and lifecycle inventory.

## Review Checklist
- Are environment and dependency assumptions explicit?
- Are security and patching controls enforceable?
- Are backup/recovery and capacity controls validated?
- Are observability and governance practices supportable?
