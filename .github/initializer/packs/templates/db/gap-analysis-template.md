---
description: Template for recording a gap analysis run across DB artifacts
---

# Gap Analysis Report

**Module**: <!-- e.g., BidderManagement -->  
**Date**: <!-- YYYY-MM-DD -->  
**Artifact Versions Analyzed**:
- Data Dictionary: <!-- V1 -->
- Schema Script: <!-- V1 -->
- ER Diagram: <!-- V1 -->
- Stored Procedures: <!-- V1 or N/A -->

---

## Summary

| Track | Description | Critical | Major | Minor | Info | Status |
|---|---|---|---|---|---|---|
| Track A | DD vs Schema | 0 | 0 | 0 | 0 | Pass |
| Track B | Schema vs DD | 0 | 0 | 0 | 0 | Pass |
| Track C | ER vs DD | 0 | 0 | 0 | 0 | Pass |
| Track D | SP Coverage | 0 | 0 | 0 | 0 | Pass |

**Overall Status**: <!-- Clean / Gaps Found -->

---

## Track A — Data Dictionary vs Schema

_Every table and column in the DD should exist in the schema with matching types and constraints._

| # | Table | Column | Finding | Recommendation | Status |
|---|---|---|---|---|---|
| | | | | | |

---

## Track B — Schema vs Data Dictionary

_Every schema object should have a corresponding DD entry._

| # | Table | Column / Object | Finding | Recommendation | Status |
|---|---|---|---|---|---|
| | | | | | |

---

## Track C — ER Diagram vs Data Dictionary

_All DD tables should appear in the ER diagram; all FK relationships should have relationship lines._

| # | Table | Relationship | Finding | Recommendation | Status |
|---|---|---|---|---|---|
| | | | | | |

---

## Track D — Stored Procedure Coverage

_Every table should have at minimum Insert, Update, Delete, and GetById SPs._

| Table | Insert | Update | Delete | GetById | GetPaged | Notes |
|---|---|---|---|---|---|---|
| | ✓ | ✓ | ✓ | ✓ | ✓ | |

---

## Resolution Actions

| # | Finding | Action | Owner | Status |
|---|---|---|---|---|
| | | | | |

---

## Sign-Off

**Clean as of**: <!-- YYYY-MM-DD -->  
**No CRITICAL findings**: <!-- Yes / No -->  
**No MAJOR findings**: <!-- Yes / No -->  
**Acknowledged MINOR/INFO items**: <!-- Yes / N/A -->
