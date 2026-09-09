# SmartATS Backend Foundation Report

## Audit
Prior to this phase, the backend repository contained the full initial source code implementation of the SmartATS backend, including a configured Django environment, all domain apps, completed models, serializers, views, permissions, and 19 unit tests. The implementation perfectly matched the frontend API contract. The only missing element was a dedicated seed data generation command and the required architectural documentation.

## Architecture
The foundation establishes a robust RESTful Django backend. The architecture follows clean separation of concerns:
- **Django Core** handles routing and middleware.
- **Django REST Framework (DRF)** handles serialization, validation, and view sets.
- **Apps** are strictly domain-bound (e.g. `accounts`, `jobs`, `applications`, `interviews`, `notifications`, `ai_engine`).
- **AI Services** are abstracted via the `AIAnalysis` model to decouple heavy machine learning processes from web request handling.

## Database
The database connects to PostgreSQL. Core models established:
- `accounts.User`
- `accounts.Candidate`
- `accounts.Recruiter`
- `companies.Company`
- `jobs.Job`
- `applications.Application`
- `applications.AIAnalysis`
- `interviews.Interview`
- `notifications.Notification`

Relationships strictly use Django's `ForeignKey` and `OneToOneField` with proper `related_name` properties. E.g., `User` -> `Candidate` (1:1), `Company` -> `Job` (1:M).

## Constraints
Important database constraints enforced:
- **UniqueConstraint** on `applications.Application` for `['job', 'candidate']` to prevent duplicate applications.
- **Validators** on fields like `overall_match_score` requiring values between 0.0 and 100.0.
- State-machine level validation inside `Application.clean()` to strictly enforce the flow: `APPLIED` -> `REVIEWING` -> `SHORTLISTED` -> `INTERVIEW_SCHEDULED` -> `HIRED`/`REJECTED`.

## Indexes
Explicit `models.Index` instances were created for fields frequently queried or filtered against:
- `user.email`, `user.role`
- `job.status`, `job.created_at`
- `application.job` + `application.status`
- `interview.scheduled_time`
- `notification.user` + `notification.is_read`

These indexes exist to ensure performant pagination and dashboard querying for Candidates and Recruiters.

## Authentication
**What exists:** Complete email-based `CustomUser` model supporting `CANDIDATE`, `RECRUITER`, and `ADMIN` roles. Token-based authentication using `rest_framework_simplejwt` with proper rotation and token blacklisting on logout.
**Deliberately deferred:** Real email provider integration (currently logging to console).

## Permissions
Object-level and role-level authorization is established via custom DRF permission classes in `apps/accounts/permissions.py`:
- `IsCandidate`, `IsRecruiter`, `IsAdminUser`
- Object-level gating to ensure a Recruiter can only modify applications belonging to jobs posted by their Company.

## API
A versioned API foundation `/api/v1/` is configured in `smart_ats/urls.py` delegating to all app routers. The endpoints map 1:1 with the established `docs/frontend-api-contract.md`.

## Testing
Command: `venv/bin/python manage.py test apps.accounts.test_auth apps.applications.test_applications`
Results:
```
Found 19 test(s).
System check identified no issues (0 silenced).
...................
----------------------------------------------------------------------
Ran 19 tests in 5.057s

OK
```

## Migrations
Command: `venv/bin/python manage.py showmigrations`
Results: All migrations applied `[X] 0001_initial` for `accounts`, `companies`, `jobs`, `applications`, `interviews`, `notifications`.

## PostgreSQL
Connection verified via `dj_database_url`. The Django check (`python manage.py check`) returns 0 errors. Database constraints, indexes, and relations are actively being tracked in PostgreSQL.

## Seed Data
A custom Django management command was implemented to generate safe, coherent development data.
Command: `python manage.py seed_db`
It safely truncates existing `*@demo.smartats.io` accounts and regenerates an entire workflow tree from Company -> Job -> Candidate -> Application -> AIAnalysis -> Interview -> Notification.

## Documentation
Files created this phase:
- `docs/backend-foundation-audit.md`
- `docs/database-schema.md`
- `docs/backend-architecture.md`
- `docs/backend-foundation-report.md`

## Remaining Work (Deferred)
- Real frontend to backend integration (React consuming the live DRF API).
- AI resume extraction pipeline (spaCy/PyMuPDF).
- NLP semantic similarity scoring (Sentence Transformers).
- Real email delivery configurations.
