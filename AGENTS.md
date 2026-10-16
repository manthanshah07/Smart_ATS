# SmartATS Agent Rules

## Mission
Complete SmartATS incrementally from its existing implementation. Preserve React/Vite + Django/DRF + PostgreSQL and current local NLP libraries unless a human approves changes.

## Source of truth
- Inspect current code/tests/API contracts; roadmap labels may be stale.
- Keep plan, task status, and verification evidence in this repo.
- Never infer completion from filenames alone.

## Safety
- Work only on the active feature branch.
- Do not commit, push, merge, deploy, run production migrations, alter production data, or add secrets without explicit per-action human approval.
- Do not modify app behavior during audit-only tasks.
- Do not silently install dependencies or download large NLP models.
- Never expose .env contents, credentials, tokens, or real candidate/resume data.
- Use synthetic data and safe local/test settings.
- Pause before destructive commands, schema changes, architecture changes, or external services.

## Task workflow
1. Read docs/STATUS.md, docs/IMPLEMENTATION_PLAN.md, docs/DECISIONS.md, and the task.
2. Inspect git status; preserve all pre-existing changes.
3. Execute only tasks explicitly marked APPROVED with satisfied dependencies. Never approve tasks yourself.
4. Stay within scope and run task verification.
5. Inspect diff for unrelated changes, secrets, and privacy risks.
6. Record commands/results; mark VERIFIED only when acceptance criteria pass. Otherwise use IN_PROGRESS or BLOCKED.
7. Continue only to other already-approved tasks without asking merely to continue.
8. Stop for ambiguity, failed checks, human gates, or context/tool limits.

## SmartATS guardrails
Authentication, role/ownership permissions, uploads, application transitions, and AI matching are high-risk. Inspect contracts and tests before modifying. Avoid migrations unless explicitly scoped and approved. Reconcile stale docs using evidence, not assumptions.

## Final report
Report task statuses, files changed, exact checks/results, blockers/risks, and next human action.