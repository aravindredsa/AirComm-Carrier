---
description: Template for tracking a DB deployment to Dev, QA, or Prod
---

# Deployment Checklist

**Module**: <!-- e.g., BidderManagement -->  
**Target Environment**: <!-- Dev / QA / Prod -->  
**Deployment Date**: <!-- YYYY-MM-DD -->  
**Deployed By**: <!-- Name -->

---

## Artifact Versions Being Deployed

| Artifact | File | Version |
|---|---|---|
| Schema Script | `Schema_<Module>_V<N>.sql` | V — |
| Seed Scripts | `Seeds_<Module>_V<N>.sql` | V — |
| Stored Procedures | `SPs_<Module>_V<N>.sql` | V — |
| Migration Script | `Migration_<Module>_<Change>_V<N>.sql` | V — |

---

## Pre-Deployment Checks

- [ ] Gap analysis run and clean (no CRITICAL or MAJOR findings)
- [ ] SP review completed (no CRITICAL or MAJOR findings)
- [ ] All scripts reviewed by a second team member
- [ ] Deployment script is idempotent
- [ ] Rollback procedure documented
- [ ] Customer approval received (if applicable)
- [ ] Team notified of upcoming deployment

---

## Deployment Steps

| Step | Action | Expected Result | Completed |
|---|---|---|---|
| 1 | Backup current state of target DB (or confirm snapshot exists) | Snapshot available | ☐ |
| 2 | Execute Schema Script | No errors | ☐ |
| 3 | Execute Seed Scripts (if applicable) | No errors | ☐ |
| 4 | Execute Migration Script (if applicable) | No errors; row counts verified | ☐ |
| 5 | Execute SP script | No errors | ☐ |
| 6 | Run post-deployment validation queries | Results match expected state | ☐ |
| 7 | Notify team of successful deployment | Slack / Teams message sent | ☐ |

---

## Post-Deployment Validation

| Check | Query / Method | Result | Pass/Fail |
|---|---|---|---|
| Table row counts match expected | `SELECT COUNT(*) FROM <Table>` | | |
| FK constraints intact | `SELECT * FROM sys.foreign_keys WHERE ...` | | |
| SPs deployable | `EXEC usp_<TableAlias>_GetById @Id = 1` | | |

---

## Rollback Procedure

<!-- Describe how to roll back this deployment if validation fails. -->

1. Restore from the pre-deployment snapshot OR
2. Execute the rollback script: `Migration_<Module>_<Change>_V<N>_Rollback.sql`

---

## Sign-Off

| Role | Name | Date |
|---|---|---|
| Deployer | | |
| Reviewer | | |
| Customer (Prod only) | | |
