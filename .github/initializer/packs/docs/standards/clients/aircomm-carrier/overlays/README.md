# AirComm Carrier Overlays

This folder contains client-specific standards that narrow or supplement the universal baseline.

## Rules
- Add only client-specific deltas here.
- Do not duplicate universal common, domain, or capability rules unless a narrower client rule is required.
- If a rule applies to more than one client, move it to a capability or domain file instead of keeping it in the overlay.

## Client Inputs Used
- Project: Sales Improvement
- Output format preference: Markdown
- Output detail preference: very detailed
- Approval requirements: product owner approval and QA approval
- Security and privacy requirements: mask personal identifiers; no production data in examples
- Avoid list: do not run destructive database operations without explicit approval

## Notes
- This distribution is prepared for a single client profile by design.
- Do not add other client folders in this package unless explicitly required.
