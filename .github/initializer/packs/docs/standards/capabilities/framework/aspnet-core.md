# ASP.NET Core Capability Standards

## Purpose

Define enforceable standards for ASP.NET Core services and APIs so implementations are secure, maintainable, testable, and operationally supportable.

## Applies To

- ASP.NET Core APIs (controllers and minimal APIs)
- ASP.NET Core hosted services and worker processes
- Middleware, filters, authentication/authorization, and application startup configuration
- Service-to-service integrations and external boundary contracts

## Baseline References

- Microsoft ASP.NET Core security guidance
- Microsoft .NET and C# coding conventions and analyzer usage
- OWASP ASVS for verification-oriented security controls
- OWASP cheat sheets for authentication, authorization, input validation, and secure logging

## Required Standards

### 1) Architecture and Code Structure

- Keep transport layer thin: endpoint handlers only orchestrate request parsing, auth checks, and service invocation.
- Keep business logic in application/domain services, not in controllers/endpoints.
- Use explicit DTO contracts at boundaries. Do not expose ORM/domain entities directly.
- Keep side effects explicit and isolated behind interfaces where practical.
- Enforce dependency direction: presentation -> application -> domain, infrastructure at the edge.

### 2) Security Standards

- Authentication and authorization:
	- Require explicit auth policy on non-public endpoints.
	- Use policy-based authorization for sensitive operations.
	- Deny by default for endpoints lacking explicit access definition.
- Input and output protection:
	- Validate all external inputs at boundaries.
	- Reject invalid payloads with consistent validation response shape.
	- Avoid reflective exception output and stack traces in production responses.
- Secret and credential handling:
	- No secrets in source code, checked-in config, or logs.
	- Use managed identity and secure secret providers where available.
	- Separate dev/test/prod secret sources.
- Data and session protections:
	- Enforce TLS in all non-local environments.
	- Use secure cookie settings where cookies are used.
	- Prevent CSRF for cookie-based browser flows.

### 3) API and Contract Standards

- Use stable, documented endpoint contracts.
- Use explicit request and response schemas per endpoint.
- Use consistent HTTP semantics:
	- `2xx` for successful operation
	- `4xx` for caller-side issues
	- `5xx` for server-side failures
- Use a consistent error envelope across endpoints.
- Preserve backward compatibility unless a breaking change is approved and versioned.

### 4) Data Access Standards

- Use parameterized queries and safe ORM patterns.
- Prevent N+1 query patterns in hot paths.
- Use explicit transaction boundaries for multi-step writes.
- Do not leak provider-specific exceptions directly to clients.

### 5) Reliability and Resilience Standards

- Use timeout and retry policies for remote calls.
- Use idempotency for retryable write operations where applicable.
- Use cancellation tokens in async workflows where operations are cancellable.
- Apply graceful shutdown behavior for hosted services.

### 6) Logging and Observability Standards

- Use structured logs with consistent keys (correlation id, request id, operation id).
- Log enough context for diagnosis without logging sensitive data.
- Capture metrics for request rate, latency, error rate, and dependency failures.
- Emit trace spans for critical service boundaries.
- Ensure health endpoints reflect dependency readiness and liveness accurately.

### 7) Testing Standards

- Unit tests required for business logic and edge-case validation.
- Contract/integration tests required for endpoint behavior and serialization semantics.
- Security-focused tests required for authorization and boundary validation.
- Failure path tests required for key external dependency errors.

### 8) Deployment and DevOps Standards

- Build and deploy through CI/CD only; avoid manual production patching.
- Require static analysis and test gates before promotion.
- Use immutable artifacts across environments.
- Support rollback with versioned deployment units.

## Implementation Baseline

- Enable analyzers and enforce warnings appropriate for production workloads.
- Keep configuration externalized and environment-specific.
- Centralize exception handling and response shaping.
- Define startup registration clearly for DI, auth, middleware, and endpoints.
- Ensure every externally facing route is documented and test-covered.

## Minimum Quality Gates

- Security gates:
	- No high-severity unresolved security findings in modified scope.
	- Authz policy present for protected endpoints.
- Contract gates:
	- Endpoint contract changes documented and compatibility reviewed.
- Test gates:
	- All changed-path unit/integration tests pass.
	- Critical path regression checks pass.
- Observability gates:
	- New critical operations have structured logs and measurable signals.

## Avoid

- Business logic in controllers/endpoints
- Ad hoc error response shapes per endpoint
- Secrets in config files, code, or logs
- Unbounded retries and missing dependency timeouts
- Silent exception swallowing without diagnostic context

## Review Checklist

- Are endpoint, service, and domain responsibilities clearly separated?
- Are authn/authz requirements explicit and correctly enforced?
- Are input validation and error response patterns consistent?
- Are contracts backward-compatible or explicitly versioned?
- Are resilience patterns (timeout/retry/cancellation) correctly applied?
- Are logs/metrics/traces sufficient and safe for operations?
- Are tests covering success, validation, auth, and failure paths?
