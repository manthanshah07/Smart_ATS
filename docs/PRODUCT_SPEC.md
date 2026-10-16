# SmartATS Product Specification

## Product
SmartATS is an applicant tracking system for Candidates, Recruiters, and Admins. Its stated differentiator is explainable resume-to-job matching using text extraction, skill/entity extraction, semantic embeddings, and similarity scoring. These capabilities must be verified before claiming production readiness.

## Known capabilities from repository docs
- Candidate profiles, resume upload, job search, applications, interviews, notifications.
- Recruiter company and job management, applicant review, status updates, interviews, notifications.
- Admin user management, moderation, platform analytics.
- AI resume parsing, information extraction, semantic matching, matched/missing-skill explanations.

## Stack constraints
- Frontend: React 18, Vite, Tailwind CSS, React Router, TanStack Query, Axios.
- Backend: Python, Django, Django REST Framework, SimpleJWT.
- Database: PostgreSQL; never migrate a production database as part of agent work.
- NLP/AI: PyMuPDF/python-docx, spaCy, Sentence Transformers, scikit-learn.
- Documented deployment targets: Vercel frontend, Render backend, Neon PostgreSQL.

## Quality goals
1. End-to-end workflows enforce server-side role and ownership permissions.
2. API contracts match frontend services and behavior.
3. Parsing/matching handles malformed and empty inputs safely and explains scores.
4. Checks are reproducible with synthetic fixtures.
5. Docs describe verified behavior and limitations.
6. No secrets or real candidate data are committed or logged.

## Non-goals without explicit approval
Replacing the stack, adding paid/hosted AI APIs, production deploys/migrations, destructive operations, or unsupported fairness/accuracy claims.