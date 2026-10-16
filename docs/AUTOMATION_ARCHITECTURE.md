# SmartATS Architecture Baseline

This baseline is reconstructed from README and repository paths; validate runtime behavior during the audit.

## Client
React 18 + Vite, Tailwind CSS, React Router, TanStack Query, Axios. UI paths are organized under `frontend/src/pages` for public, candidate, recruiter, admin, and auth areas.

## API/service
Django and Django REST Framework under `backend/`, with apps for accounts, companies, jobs, applications, interviews, notifications, analytics, and AI engine. SimpleJWT is documented for auth.

## Persistence
PostgreSQL is the documented target. Models and migrations live in Django apps. Production database access and migrations are prohibited for routine agent tasks.

## AI engine
The repo includes parser, extractor, embeddings, matcher, constants, and tests under `backend/apps/ai_engine`. Documented libraries include PyMuPDF, python-docx, spaCy, Sentence Transformers, and scikit-learn. Dependency availability, model downloads, and latency must be checked before claiming execution success.

## Verification risks
- Roadmap phase/status appears inconsistent with the presence of later-module code, tests, and audit reports.
- The inspected frontend package manifest exposed dev/build/preview scripts but no test script.
- A package manifest does not prove dependencies install or workflows work end-to-end.
- Identify safe reproducible commands and database requirements before app changes.