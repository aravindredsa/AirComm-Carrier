---
name: skill-codebase-audit
description: Shared auditing methodology for full-codebase and uncommitted-change audits across resolver-selected stacks with consistent scoring and evidence-backed findings.
---

# Skill: Codebase Audit

## Purpose
Provide a consistent audit execution method so prompts can define scope, scoring rubric, and output format while this skill handles discovery, evidence collection, and scoring discipline across resolver-selected stacks.

## Inputs
- **Audit Scope**: Full repository or uncommitted changes only
- **Resolved Workflow Context**: Domain and capabilities resolved from policy, catalog, and active client profile (drives discovery patterns)
- **Resolution Sources**: `config/standards-resolution-policy.json`, `config/client-profiles.json`, and `config/standards-catalog.json`
- **Standards Documents**: Apply in resolver order: common, resolved domain, resolved capabilities, then client overlay
- **Prompt-Defined**:
  - Scoring rubric and dimensions
  - Output format and report path
  - Domain-specific quality gates or mandatory findings

## Method

### 1. Determine Audit Scope & Domain
- **Scope**: Full codebase or uncommitted changes only (driven by prompt mode)
- **Context Resolution**: Resolve workflow context using `config/standards-resolution-policy.json`, `config/client-profiles.json`, and `config/standards-catalog.json`
- **Discovery Signals**: Infer relevant file groups from resolved language/framework/testing/data capabilities and prompt scope

### 2. Domain-Specific Discovery & Catalog

Discover and catalog files according to resolved capabilities and prompt scope.
Use the resolved workflow context to infer which file groups and extensions matter for the audit; do not hardcode stack-specific extension lists in the skill.

Suggested discovery dimensions:
- application source files
- tests and test configuration
- runtime/application configuration
- data and migration artifacts
- pipeline/CI assets

Catalog by module boundaries and functional concerns relevant to the resolved context.

### 3. Apply Prompt-Defined Scoring Rubric
- Score each dimension specified by prompt, in 0.5 increments (0–10)
- Use prompt's rubric and quality gates as baseline

### 4. Collect Evidence
- File paths, code snippets, and line references — **never score without supporting evidence**
- Every finding must cite a concrete file and code location
- Do not raise findings without evidence in scoped files

### 5. Score Consistency
- Score each dimension in 0.5 increments (e.g., `7.5/10`, `8.5/10`)
- Apply standards in resolver order: common, resolved domain, resolved capabilities, then client overlay
- Flag violations against standards, not generic opinions
- Treat security findings as mandatory — never downgrade severity

### 6. Output
- Executive summary with all dimension scores and top priority actions FIRST
- Then detail sections per dimension
- Maintain heading-per-dimension structure for readability

## Quality Rules (Cross-Domain)

- **Evidence-Based Only**: Every finding must cite a concrete file and code location
- **In-Scope Only**: Do not audit files outside the defined scope
- **Standards Aligned**: Apply standards in resolver order: common, resolved domain, resolved capabilities, then client overlay
- **Security Critical**: Treat domain-specific security findings (hardcoded secrets, missing auth guards, SQL injection, CORS issues, unvalidated input, missing encryption) as mandatory — never downgrade
- **Distinction**: Distinguish findings (clear violations) from recommendations (improvements)
- **No Speculation**: Do not score based on hypothetical or missing code — only what is present

## Domain-Specific Mandatory Finding Categories

### Frontend Security (must check if domain = frontend)
- Hardcoded API keys, tokens, secrets in source or templates
- Azure AD B2C credentials in source (should be environment variables)
- XSS vulnerabilities: unsanitized HTML injection, dangerously rendered content
- CSRF protection gaps in state-changing operations
- Insecure dependency versions (vulnerable npm packages)

### Backend Security (must check if domain = backend)
- Hardcoded connection strings, passwords, API keys in `appsettings.json` or source
- Missing or weak `[Authorize]` guards on protected endpoints
- Unvalidated input: SQL injection, object injection, XXE vulnerabilities
- CORS misconfiguration (overly broad origins)
- Missing or weak encryption for sensitive data at rest/transit

### QA Security (must check if domain = qa)
- Hardcoded test data credentials or API keys in page objects/tests
- Unencrypted test environment credentials
- Insecure logging of sensitive data (passwords, tokens in logs)
- Lack of test data cleanup/isolation

### Database Security (must check if domain = db)
- Hardcoded credentials in connection strings or stored procedures
- Missing row-level security or column-level encryption where needed
- SQL injection vulnerabilities in dynamic SQL or stored procedures
- Missing audit trails for sensitive data modification

## Constraints

- Do not audit files outside the defined scope
- Do not score based on hypothetical or missing code — only evidence present in scope
- Preserve the prompt's output format, report location, and section structure as final authority
- When prompt rubric conflicts with this skill: **prompt rubric wins**

## Output Rules

- Store the report in the path defined by the prompt
- **Executive Summary First**: All dimension scores and top 3-5 priority actions before details
- Use heading-per-dimension structure for readability
- Include concrete file-level references and code snippets for each finding
- Keep the prompt's rubric, scoring rules, and required sections as final authority when more specific
