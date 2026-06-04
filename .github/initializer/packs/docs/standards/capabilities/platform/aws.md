# AWS Platform Capability Standards

## Purpose
Define enforceable AWS platform standards across security, reliability, operations, and cost governance.

## Scope
Applies to AWS-hosted workloads, networking, identity, deployment, and observability controls.

## Identity and Access
- `MUST` enforce least-privilege IAM for users, roles, and workloads.
- `MUST` prefer short-lived credentials and role-based access over long-lived keys.
- `MUST` separate deployment permissions from runtime permissions.

## Security and Data Protection
- `MUST` protect secrets in approved secret stores; no secrets in source artifacts.
- `MUST` encrypt data in transit and at rest.
- `MUST` define security group/network boundary intent explicitly.

## Reliability and DR
- `MUST` define availability targets and recovery objectives for critical services.
- `MUST` define backup/restore and failover procedures.
- `MUST` test recovery workflows on a scheduled cadence.

## Observability and Operations
- `MUST` emit logs, metrics, and traces for critical flows.
- `MUST` define alerting thresholds and incident ownership.
- `SHOULD` maintain runbooks for common high-severity incidents.

## DevOps and Governance
- `MUST` provision/update infrastructure via IaC.
- `MUST` enforce CI/CD quality gates before production promotion.
- `MUST` apply tagging standards for ownership, environment, and cost tracking.

## Cost and Capacity
- `MUST` define budget ownership and anomaly alerts.
- `MUST` validate quota and scaling assumptions pre-release.
- `SHOULD` perform recurring rightsizing reviews.

## Review Checklist
- Are IAM and secret controls least-privilege and safe?
- Are reliability and DR controls explicit and tested?
- Are observability and release governance controls operationally adequate?
- Are cost and capacity controls in place?
