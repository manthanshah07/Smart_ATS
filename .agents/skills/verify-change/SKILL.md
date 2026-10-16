---
name: verify-change
description: Run safe relevant SmartATS verification and report evidence and limitations.
---

# Verify Change
- Read the active task and test strategy first.
- Inspect repo status; preserve existing changes.
- Never access production DBs, apply migrations, seed data, download large NLP models, or use real candidate files for routine checks.
- Inspect settings before backend checks; use static checks when dependencies or safe DB settings are unavailable. Run Django tests only against an isolated test DB and after reviewing side effects.
- Run `npm run build` only when frontend dependencies are present or installation was explicitly approved.
- Record exact commands and outcomes; skipped is not passed.
- Inspect diffs for unrelated changes and secrets. Report failures without silently changing scope.