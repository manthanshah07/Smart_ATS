---
name: run-approved-queue
description: Run already-approved SmartATS tasks sequentially while verifying each task and respecting human gates.
---

# Run Approved Queue

## Startup
1. Read AGENTS.md, docs/STATUS.md, docs/IMPLEMENTATION_PLAN.md, docs/DECISIONS.md, and relevant task files.
2. Inspect `git status --short --branch`; preserve all user changes.
3. Read each task before acting.
4. Execute only tasks explicitly marked `APPROVED` with satisfied dependencies. Never change DRAFT to APPROVED.

## Per-task loop
1. Confirm actions are inside scope.
2. Run only permitted checks; skipped checks are not passes.
3. Inspect diff for unrelated changes, secrets, real candidate data, generated artifacts, and prohibited source edits.
4. Record evidence and blockers in task completion record and docs/STATUS.md.
5. Mark VERIFIED only when all acceptance criteria pass; otherwise mark IN_PROGRESS or BLOCKED with reason.
6. Continue to other already-approved tasks without asking merely to continue.

## Stop gates
Stop if no approved task is ready, instructions conflict/are ambiguous, required checks fail, an unapproved architecture/schema/dependency/product decision is needed, action requires production DB/migration/deletion/real candidate data/secrets/push/merge/deploy, or a tool/context limit risks unsafe work.

## Forbidden without explicit per-action approval
Never self-approve tasks, commit, push, merge, release, deploy, run production migrations/seed commands, or exceed task scope. Text instructions do not prove automation; test actual outcomes.

## Final report
Report task statuses, files changed, exact checks/results, blockers, DRAFT tasks awaiting approval, and precise next human action.