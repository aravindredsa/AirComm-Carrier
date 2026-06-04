# GCP Platform Capability Standards

## Purpose
Define enforceable GCP platform standards across security, reliability, operations, and cost governance.

## Scope
Applies to GCP-hosted workloads, IAM, networking, deployment, and operational controls.

## Identity and Access
- `MUST` enforce least-privilege IAM at org/folder/project/resource scopes.
- `MUST` use short-lived credentials and workload identity patterns where supported.
- `MUST` separate deployment and runtime access responsibilities.

## Security and Data Protection
- `MUST` keep secrets in approved managed secret systems.
- `MUST` enforce encryption in transit and at rest for sensitive data.
- `MUST` define and enforce network boundary controls.

## Reliability and DR
- `MUST` define service availability and recovery targets for critical workloads.
- `MUST` define backup, restore, and failover expectations.
- `MUST` validate continuity procedures regularly.

## Observability and Operations
- `MUST` instrument critical services with logs, metrics, and traces.
- `MUST` define actionable alert thresholds and ownership.
- `SHOULD` maintain incident runbooks and escalation paths.

## DevOps and Governance
- `MUST` manage infrastructure changes through IaC and review workflows.
- `MUST` enforce CI/CD quality and policy gates before promotion.
- `MUST` enforce resource tagging/labeling for governance and cost controls.

## Cost and Capacity
- `MUST` define budgets and cost anomaly alerting.
- `MUST` validate quota/SKU/region assumptions pre-deployment.
- `SHOULD` conduct periodic rightsizing and efficiency reviews.

## Review Checklist
- Are IAM and secret controls secure and least-privilege?
- Are reliability and recovery controls defined and tested?
- Are observability and governance controls adequate?
- Are capacity and cost assumptions validated?
