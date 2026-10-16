# SmartATS Decisions

## D-001 — Preserve current stack
Keep React/Vite + Django/DRF + PostgreSQL and current local NLP libraries to avoid architecture churn. Revisit only if a documented limitation requires change and a human approves.

## D-002 — Evidence before feature selection
First task is a read-only implementation and verification audit because roadmap metadata and file presence do not establish actual completion.

## D-003 — Approval-gated execution
Agents may execute only tasks explicitly marked APPROVED. Agents may not self-approve, commit, push, merge, deploy, or run production migrations.

## D-004 — Prefer free/local verification
No paid APIs. Avoid large model downloads during basic audit. Distinguish skipped checks from passing checks.