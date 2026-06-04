# Azure Platform Capability Standards

## Purpose

Define enforceable standards for Azure-based workloads across security, reliability, operational excellence, performance, and cost governance.

## Applies To

- Azure-hosted applications and services (App Service, AKS, Functions, data services)
- Azure networking, identity, key management, and monitoring integrations
- IaC-driven environment provisioning and release workflows

## Baseline References

- Azure Well-Architected Framework pillars
- Azure identity and managed identity guidance
- OWASP cloud and CI/CD security guidance
- Twelve-Factor principles for config, release separation, and operational parity

## Required Standards

### 1) Identity and Access Management

- Use managed identity for service-to-service Azure access when supported.
- Enforce least privilege for human and workload identities.
- Use role-based access control at minimal scope required.
- Separate deployment privileges from runtime privileges.
- Enforce privileged access workflow for production changes.

### 2) Secrets and Configuration Management

- Store production secrets in managed secret stores, not in source code or plain-text app settings.
- Keep non-secret config externalized and environment-scoped.
- Use secure rotation process for keys, certs, and credentials.
- Prevent production secret reuse in dev/test environments.

### 3) Network and Perimeter Security

- Use private networking and segmentation where feasible.
- Restrict ingress/egress paths to required services only.
- Enforce TLS for public and private service communication.
- Apply WAF/API gateway controls for internet-facing APIs as required by risk profile.

### 4) Data Protection and Compliance

- Classify data by sensitivity and define handling controls.
- Enforce encryption at rest and in transit for sensitive data stores.
- Apply retention and deletion policies according to business/legal requirements.
- Audit access to sensitive resources and keep tamper-evident logs.

### 5) Reliability and Disaster Recovery

- Define target availability and recovery objectives (SLO, RTO, RPO) per workload tier.
- Use multi-zone or equivalent redundancy for critical workloads.
- Test backup restore and failover procedures on a scheduled cadence.
- Ensure deployment pipelines support safe rollback for failed releases.

### 6) Observability and Operations

- Emit structured logs, metrics, and traces for critical paths.
- Standardize correlation identifiers across services.
- Define actionable alerts tied to service objectives and failure modes.
- Maintain runbooks for top operational incidents and recovery steps.

### 7) Deployment and DevOps Standards

- Provision infrastructure via IaC (Bicep/Terraform) with version control and review.
- Use build-once, deploy-many artifact strategy.
- Require CI quality gates (tests, security scan, policy checks) before promotion.
- Separate build, release, and run stages with traceable release metadata.

### 8) Performance and Capacity Standards

- Define capacity assumptions and scaling strategy (horizontal/vertical) per service.
- Load test critical flows before high-risk launches.
- Track and review latency, throughput, and dependency saturation trends.
- Validate quota and SKU constraints during planning and pre-release checks.

### 9) Cost Governance Standards

- Apply resource tagging for owner, environment, cost center, and criticality.
- Set budgets and cost anomaly alerts for production subscriptions/resource groups.
- Review underutilized resources and right-size on a scheduled cadence.

## Implementation Baseline

- Maintain environment parity for deployment topology and core configuration patterns.
- Keep workload architecture and dependency map documented.
- Keep operational ownership and on-call model explicit.
- Include release validation and rollback criteria in deployment workflows.

## Minimum Quality Gates

- Security gates:
	- No unresolved high-severity findings in changed scope.
	- Managed identity and RBAC model documented for production paths.
- Reliability gates:
	- SLO and recovery targets defined for critical services.
	- Rollback and restore procedures validated.
- Operational gates:
	- Required logs, metrics, traces, and alerts verified in non-prod before production rollout.
- Governance gates:
	- Required tags and budget alerts applied.

## Avoid

- Hard-coded secrets or embedded environment credentials
- Over-privileged service principals or broad subscription-level rights by default
- Infrastructure changes outside reviewed IaC workflows
- Production releases without observability and rollback readiness
- Unvalidated regional/quota assumptions

## Review Checklist

- Are identity and RBAC controls least-privilege and environment-appropriate?
- Are secrets, keys, and certificates managed and rotated safely?
- Are network boundaries and ingress/egress restrictions explicit?
- Are SLO, RTO, and RPO targets defined and validated?
- Are logging, metrics, tracing, and alerting sufficient for supportability?
- Are CI/CD and IaC controls preventing drift and unsafe changes?
- Are cost and quota controls in place and monitored?
