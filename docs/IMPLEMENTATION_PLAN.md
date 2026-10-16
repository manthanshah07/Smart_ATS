# SmartATS Implementation Plan

## Operating rule
Do not guess what to build next. Establish what works, what is tested, and which gap matters most. Tasks require a human to mark them APPROVED before execution.

## Phase A — Baseline audit (completed)
- [x] Review repository overview, architecture, requirements, roadmap, and existence of historical audit/release reports.
- [x] Confirm working tree and dependencies in the user's local checkout.
- [x] Run safe backend checks with local/test settings and synthetic data (62/62 unit tests passing).
- [x] Run frontend production build when dependencies are already present (`npm run build` passing).
- [x] Reconcile historical reports against current code and tests.
- [x] Inspect public tracked files for sensitive candidate data/secrets; report risk without reproducing or removing data.
- [x] Map FR-1–FR-24 to implementation and test evidence (`docs/SMARTATS_BASELINE_AUDIT.md`).
- [x] Record test gaps, blockers, and recommended next task (`tasks/TASK-003-admin-analytics-and-endpoints.md` - DRAFT).

## Phase B — Close highest-value verified gap
Create one narrow task from Phase A evidence, with acceptance criteria, tests, exclusions, risk level, and dependencies. Leave DRAFT until a human approves it.

## Phase C — Functional completion
Deliver approved feature slices across backend, API, frontend, permissions, and tests. Keep tasks small and resumable.

## Phase D — Hardening
Verify auth/object permissions, upload validation, application state transitions, notifications, AI edge cases, frontend loading/error/empty states, accessibility, and regression coverage.

## Phase E — Release readiness
Verify clean install, environment docs, reproducible tests, production settings, and deployment steps. Deployment is a separate approval gate.

## Never infer
A roadmap phase, passing build, or unit-test suite alone does not prove workflow completeness or production readiness. An AI score is not proof of hiring quality or fairness.