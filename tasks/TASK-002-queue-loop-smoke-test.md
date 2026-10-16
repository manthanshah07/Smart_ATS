# TASK-002 — Approved Queue Loop Smoke Test

**Status:** APPROVED  
**Priority:** P0  
**Dependencies:** TASK-001 must be VERIFIED  
**Risk:** LOW (read-only inspection and documentation only)  
**Human approval:** Approved in the context of the user's request to test the project automation, 2026-10-16.

## Problem
The queue runner needs a real workspace test: after completing one approved task, it should continue to the next dependency-ready approved task without asking the user merely to continue, then stop when no approved tasks remain.

## Desired outcome
Validate the queue protocol and evidence produced by TASK-001 without altering SmartATS application behavior.

## Scope
- Confirm TASK-001 is VERIFIED and `docs/SMARTATS_BASELINE_AUDIT.md` exists.
- Check that the audit has explicit evidence and a status for FR-1 through FR-24, exact commands/results or clearly marked skips, highest-risk gaps, and a next implementation task left DRAFT.
- Check that the worktree/diff shows no prohibited application-source changes, no secrets or real candidate details copied into newly created artifacts, and no commit/push/merge/deploy/migration action.
- Confirm the queue runner continued from TASK-001 to this task without asking for a continuation confirmation.
- Add a concise smoke-test result to this task and update `docs/STATUS.md`.
- Do not edit application source or correct problems found in the audit; record them as blockers/follow-up items.

## Out of scope
Application changes, production access, database migrations, dependency installation, data deletion, history rewrite, committing, pushing, merging, deployment, or approving any further task.

## Acceptance criteria
- [ ] TASK-001's stated acceptance criteria and evidence are reviewed.
- [ ] No prohibited action or source-code change occurred.
- [ ] Queue advanced to TASK-002 without an unnecessary continuation prompt.
- [ ] Final task queue state is accurate; any remaining task requiring product work is DRAFT.
- [ ] Result and any failure modes are recorded honestly.

## Verification
Inspect task/status/report files and `git status --short --branch`. Review the current-turn diff. Do not run application commands or touch databases for this smoke test.

## Completion record
Fill with evidence, pass/fail, and limitations.