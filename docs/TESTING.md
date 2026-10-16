# SmartATS Testing Strategy

## General rules
- Use synthetic fixtures only; never use real resumes, candidate data, credentials, or production data.
- Record exact commands, environment, return codes, and failures.
- A skipped check is not a pass.
- Never run migrations/seeding/deletion against a configured production DB.

## Backend candidates (inspect settings before running)
From backend/: `python --version`, `python -m pip check`, and `python manage.py check` only after confirming safe local configuration. `showmigrations` may connect to the configured DB. Run focused app tests only after verifying test DB settings; AI tests may require model/dependency downloads.

## Frontend
From frontend/: `npm ls --depth=0`; `npm run build` only when dependencies are present. No frontend test script appeared in the inspected package.json; do not invent a test command.

## CI expectations
Use separate backend/frontend jobs, avoid secrets and production databases, and do not download large transformer models unless a job is explicitly designed for that cost. CI should not deploy automatically.