# TASK-003 — Admin Endpoints and Analytics Schema Alignment

**Status:** DRAFT  
**Priority:** P1  
**Dependencies:** TASK-001 (Verified)  
**Risk:** MEDIUM (Backend endpoints, serializer updates, frontend service alignment)  
**Human approval:** Awaiting human review and explicit approval before execution.

## Problem
The Admin Portal cannot function in live API mode (`VITE_DEMO_MODE=false`) because:
1. `GET /api/v1/admin/companies/` and `GET /api/v1/admin/applications/` endpoints do not exist in the backend.
2. `AdminAnalyticsView` returns a flat dictionary, while `AdminDashboard.jsx` and `AdminAnalyticsPage.jsx` destructure nested objects (`platform_overview`, `applications_by_status`, `hiring_funnel`), causing an immediate `TypeError` runtime crash.
3. `adminService.js` is entirely bound to in-memory mock datasets.

## Desired outcome
Enable administrators to view live company listings, application queues, and platform analytics without runtime crashes or mock fallbacks.

## Scope
- Create `AdminCompanyListView` (`GET /api/v1/admin/companies/`) in `apps.companies.views` with `IsAdmin` permission.
- Create `AdminApplicationListView` (`GET /api/v1/admin/applications/`) in `apps.applications.views` with `IsAdmin` permission.
- Restructure `AdminAnalyticsView` (`GET /api/v1/admin/analytics/`) in `apps.analytics.views` to compute and return live aggregate structures: `platform_overview`, `applications_by_status`, and `hiring_funnel`.
- Add test suites for admin endpoints in `apps.companies` and `apps.analytics`.
- Wire `frontend/src/services/adminService.js` to call the live API when `!isDemoMode`.

## Out of scope
Modifying database schemas/migrations, altering core authentication, modifying non-admin candidate or recruiter workflows.

## Acceptance criteria
- [ ] `GET /api/v1/admin/companies/` returns paginated company records for Admin; returns 403 for Candidate/Recruiter.
- [ ] `GET /api/v1/admin/applications/` returns paginated application records for Admin; returns 403 for non-Admin.
- [ ] `GET /api/v1/admin/analytics/` returns `{ platform_overview, applications_by_status, hiring_funnel }` calculated from live DB data.
- [ ] Admin pages render without runtime crashes in live mode.
- [ ] All new backend endpoints have automated unit tests passing in test suite.
