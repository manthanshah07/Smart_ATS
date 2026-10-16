# SmartATS Implementation Plan

## Operating rule
Do not guess what to build next. Establish what works, what is tested, and which gap matters most. Tasks require a human to mark them APPROVED before execution.

## Phase A — Baseline audit (active)
- [x] Review repository overview, architecture, requirements, and roadmap docs.
- [ ] Confirm working tree and dependencies in the user's local checkout.
- [ ] Run safe backend checks with local/test settings and synthetic data.
- [ ] Run frontend production build when dependencies are already present.
- [ ] Map FR-1–FR-24 to implementation and test evidence.
- [ ] Record test gaps, blockers, and recommended next task.

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