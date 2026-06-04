# Security Baseline Standards

## Purpose
Define the minimum security and privacy expectations that apply to every workflow, every client, and every capability.

## Applies To
- All generated documents, prompts, analysis artifacts, and implementation guidance
- All clients unless a stricter client overlay exists

## Required Rules
- Do not invent or expose secrets, credentials, tokens, or private keys.
- Do not recommend using production data unless explicitly approved.
- Do not weaken security, privacy, audit, or approval rules from stronger layers.
- Call out sensitive data handling, access control, and approval requirements.
- Prefer least-privilege, safe defaults, and explicit confirmation for risky actions.

## Recommended Rules
- Mask personal, financial, or account data in examples.
- Favor approved tools, environments, and documented controls.
- State security assumptions and unresolved risks when evidence is incomplete.

## Avoid
- Hard-coded secrets
- Unapproved environment changes
- Ambiguous data handling instructions
- Security recommendations based on hidden context

## Output Expectations
Deliverables should include relevant security constraints, data sensitivity notes, approval requirements, and risk assumptions.

## Review Checklist
- Are secrets and sensitive data protected?
- Are privacy and approval requirements explicit?
- Is any recommendation reducing security posture?
- Are assumptions and residual risks documented?
