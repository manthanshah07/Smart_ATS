# SmartATS Baseline Implementation and Verification Audit

**Audit Date:** 2026-10-16  
**Auditor / Agent:** Antigravity Pairing Agent  
**Active Branch:** `chore/automation-bootstrap`  
**Task Reference:** `tasks/TASK-001-baseline-audit.md`  
**Overall Status:** COMPLETED (Read-Only Baseline Established)

---

## 1. Executive Summary

This audit establishes the concrete, evidence-backed implementation baseline of SmartATS. SmartATS is a full-stack applicant tracking system composed of:
- **Frontend:** React 18, Vite, Tailwind CSS, Axios, Lucide Icons
- **Backend:** Django 5.1.15, Django REST Framework 3.15.2, SimpleJWT (with token rotation & blacklisting)
- **AI / NLP Pipeline:** PyMuPDF (`fitz`), `python-docx`, `spaCy` (`en_core_web_sm`), `sentence-transformers` (`all-MiniLM-L6-v2`), and `scikit-learn` cosine similarity
- **Persistence:** PostgreSQL 16 (production/local target), with ephemeral disk storage for media uploads

### Key Audit Findings
1. **The Roadmap is Out of Date:** While `docs/development-phases.md` lists Phase 1 as current, substantial code, models, and passing tests exist through Phase 5 (Authentication, RBAC, Jobs, Applications, AI Engine, and Production hardening).
2. **Backend Core is Strong (62 Passing Tests):** In-memory SQLite execution of the test suite passes 62/62 unit tests across `ai_engine`, `accounts.test_auth`, `accounts.test_production`, and `applications.test_applications`.
3. **Significant Frontend Disconnection:** Multiple frontend services (`interviewService.js`, `notificationService.js`, `adminService.js`, and previously `recruiterService.js`) remain wired exclusively to static mock datasets, preventing live database integration.
4. **Public Tracked Candidate Data Exposure Confirmed:** An existing historical audit report (`docs/REAL_RESUME_EXTRACTION_AUDIT.md`) committed to the repository exposes sensitive personal candidate information (names, institutions, GPA, locations, project links) extracted from real resumes.
5. **Pre-Existing Uncommitted Working-Tree Changes:** The current working branch contains uncommitted modifications implementing `GET /api/v1/applications/<int:pk>/` and updating recruiter frontend services to consume live applicant APIs. These changes are preserved intact.

---

## 2. Working-Tree State & Environment Baseline

### 2.1 Git Status
- **Branch:** `chore/automation-bootstrap` tracking `origin/chore/automation-bootstrap`
- **Pre-existing modified files (preserved):**
  - `backend/apps/applications/test_applications.py` (added `ApplicationDetailRBACSecurityTests`)
  - `backend/apps/applications/urls.py` (added `applications/<int:pk>/` route)
  - `backend/apps/applications/views.py` (added `ApplicationDetailView` with RBAC)
  - `frontend/src/pages/recruiter/JobApplicantsPage.jsx` (live applicant API consumption)
  - `frontend/src/pages/recruiter/RecruiterApplicationDetailPage.jsx` (live application dossier display)
  - `frontend/src/services/applicationService.js` (live detail API call & normalizer)
  - `frontend/src/services/recruiterService.js` (live job applicants API call)
- **Pre-existing untracked files:**
  - `backend/apps/*/__init__.py` (missing module init files)
  - `docs/APPLICATION_AI_MATCHING_AUDIT.md` (uncommitted audit notes)

### 2.2 System & Tooling Versions
- **OS:** macOS (Darwin arm64)
- **System Python:** Python 3.14.7 (no Django installed)
- **Virtualenv Python:** `backend/venv/bin/python` (Python 3.12.14, Django 5.1.15, DRF 3.15.2, PyTorch 2.14.0, spaCy 3.8.16, sentence-transformers 6.0.1)
- **Node.js:** v24.19.0
- **npm:** 12.0.2

---

## 3. Safe Verification Checks & Outcomes

All verification actions adhered strictly to read-only safety rules without modifying application source code, altering persistent databases, applying migrations, or downloading new models.

| Check Category | Command / Inspection | Result | Status | Notes / Limitations |
| :--- | :--- | :--- | :--- | :--- |
| **Git Baseline** | `git status --short --branch` | Exit code 0 | **PASSED** | Working tree inspected; all pre-existing user edits preserved untouched. |
| **Backend Syntax** | `python3 -m py_compile $(git ls-files "backend/*.py")` | Exit code 0 | **PASSED** | All tracked Python source files parse and compile without syntax errors. |
| **Django System Check** | `backend/venv/bin/python backend/manage.py check` | Exit code 0 | **PASSED** | "System check identified no issues (0 silenced)." |
| **AI Unit Tests** | `DATABASE_URL="sqlite:///:memory:" backend/venv/bin/python backend/manage.py test apps.ai_engine` | Exit code 0 | **PASSED** | 12/12 tests passed in 6.257s. Verified parser, extractor, regex taxonomy, and ExplainableMatcher. |
| **Auth & RBAC Tests** | `DATABASE_URL="sqlite:///:memory:" backend/venv/bin/python backend/manage.py test apps.accounts.test_auth` | Exit code 0 | **PASSED** | 17/17 tests passed in 5.263s. Verified registration, JWT login, token refresh/blacklist, RBAC isolation. |
| **Production Settings** | `DATABASE_URL="sqlite:///:memory:" backend/venv/bin/python backend/manage.py test apps.accounts.test_production` | Exit code 0 | **PASSED** | 25/25 tests passed in 0.141s. Verified WhiteNoise, CORS, health endpoint, protected endpoints. |
| **Applications Tests** | `DATABASE_URL="sqlite:///:memory:" backend/venv/bin/python backend/manage.py test apps.applications.test_applications` | Exit code 0 | **PASSED** | 8/8 tests passed in 2.010s. Verified application detail RBAC, state machine transitions, score weights. |
| **Full Backend Suite** | `DATABASE_URL="sqlite:///:memory:" backend/venv/bin/python backend/manage.py test apps -v 1` | Exit code 0 | **PASSED** | 62/62 tests passed in 13.512s across all apps. |
| **Frontend Build** | `npm run build` in `frontend/` | Exit code 0 | **PASSED** | Vite v5.4.21 built production bundle in 930ms (`dist/assets/index-DQdEbMeH.js` 532.62 kB). |
| **Frontend Unit Tests** | `npm test` | — | **SKIPPED** | `frontend/package.json` contains no test runner or test script (`scripts: dev, build, preview`). |
| **Database Migrations** | `manage.py migrate` against PostgreSQL | — | **SKIPPED** | Prohibited by task safety rules (no persistent schema/data changes). Tested safely on in-memory SQLite. |
| **Database Seeding** | `python seed_db.py` | — | **SKIPPED** | Prohibited by safety rules (no database alterations). |
| **External AI Downloads**| `huggingface-cli download ...` | — | **SKIPPED** | Prohibited by safety rules. Local cache utilized. |

---

## 4. Requirements Traceability Matrix (FR-1 through FR-24)

Each functional requirement has been audited against active models, views, API routes, frontend components, and automated tests.

*Statuses:*
- **VERIFIED:** Implemented in backend and frontend, and covered by passing automated tests.
- **PARTIAL:** Implemented in code, but either missing frontend/backend integration or lacking complete test coverage.
- **MISSING:** Endpoint, schema, or critical business logic absent.
- **NOT TESTED:** Implementation exists, but 0 automated tests exist for the feature.

| Req ID | Requirement Description | Primary Backend Code & Endpoint | Primary Frontend Route & Component | Automated Test Evidence | Status | Evidence & Defect Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **FR-1** | Candidate / Recruiter Registration | `apps.accounts.views.RegisterView`<br>`POST /api/v1/auth/register/` | `/register`<br>`RegisterPage.jsx` | `apps.accounts.test_auth`<br>`test_01_candidate_registration_succeeds`<br>`test_02_recruiter_registration_succeeds` | **VERIFIED** | Enforces transactional user+profile creation, password complexity, rejects public admin registration. |
| **FR-2** | JWT Authentication & Refresh | `apps.accounts.views.CustomTokenObtainPairView`, `TokenRefreshView`, `LogoutView`<br>`POST /api/v1/auth/token/` | `/login`<br>`LoginPage.jsx`, `api.js` | `apps.accounts.test_auth`<br>`test_06_login_succeeds_with_valid_credentials`<br>`test_15_jwt_token_refresh`<br>`test_16_logout_blacklists_refresh_token` | **VERIFIED** | Access token 15m, Refresh token 1d with rotation and blacklist in database. |
| **FR-3** | Role-Based Access Control | `apps.accounts.permissions` (`IsCandidate`, `IsRecruiter`, `IsAdmin`) | `ProtectedRoute.jsx`, `RoleGuard` | `apps.accounts.test_auth`<br>`test_10_candidate_cannot_access_recruiter_endpoint`<br>`test_11_recruiter_cannot_access_admin_endpoint`<br>`test_12_admin_can_access_admin_endpoint` | **VERIFIED** | Both DRF permissions and React router protection strictly enforce candidate/recruiter/admin boundaries. |
| **FR-4** | Password Reset | `apps.accounts.views.PasswordResetRequestView`, `PasswordResetConfirmView`<br>`POST /api/v1/auth/password-reset/` | `/forgot-password`<br>`ForgotPasswordPage.jsx` | `apps.accounts.test_auth`<br>`test_17_password_reset_flow` | **VERIFIED** | Generates `default_token_generator` token, sends reset email via Django mail, verifies and resets password. |
| **FR-5** | Candidate Profile Management | `apps.accounts.views.CandidateProfileView`<br>`GET/PUT /api/v1/candidate/profile/` | `/candidate/profile`<br>`CandidateProfilePage.jsx` | `apps.ai_engine.tests`<br>`test_11_candidate_profile_serializer_contract` | **PARTIAL** | Serializer provides profile fields, but historically missed `first_name`/`last_name` from User. Update works. |
| **FR-6** | PDF / DOCX Resume Upload | `apps.accounts.views.CandidateResumeUploadView`<br>`POST /api/v1/candidate/resume/` | `/candidate/resume`<br>`CandidateResumePage.jsx` | `apps.ai_engine.tests`<br>`test_1_pdf_resume_extraction`<br>`test_2_docx_resume_extraction` | **PARTIAL** | Upload and NLP extraction work; risk of `parsed_skills` object vs array mismatch in frontend; media stored on ephemeral disk. |
| **FR-7** | Job Browsing & Search | `apps.jobs.views.JobListCreateView`<br>`GET /api/v1/jobs/` | `/jobs`, `/jobs/:id`<br>`JobsPage.jsx`, `JobDetailsPage.jsx` | *None* | **NOT TESTED** | Public browsing filters on status='OPEN'. Text search and location filtering implemented. Zero unit tests in `apps.jobs`. |
| **FR-8** | Job Application Submission | `apps.applications.views.ApplicationSubmitView`<br>`POST /api/v1/applications/` | `/jobs/:id`<br>`JobDetailsPage.jsx` (`ApplyModal.jsx`) | `apps.applications.test_applications`<br>`test_ai_scoring_weights_sum_to_one` | **PARTIAL** | Creates Application, snapshots resume data, runs AI matching synchronously. Lacks direct API POST test. |
| **FR-9** | Application Tracking | `apps.applications.views.CandidateApplicationListView`<br>`GET /api/v1/candidate/applications/` | `/candidate/applications`<br>`CandidateApplicationsPage.jsx` | `apps.applications.test_applications`<br>`ApplicationDetailRBACSecurityTests` | **VERIFIED** | Candidate retrieves list of own applications with status and AI score. Detail endpoint added in working tree. |
| **FR-10**| Company Profile Management | `apps.companies.views.RecruiterCompanyView`<br>`GET/PUT /api/v1/recruiter/company/` | `/recruiter/company`<br>`CompanyProfilePage.jsx` | `apps.accounts.test_production`<br>`test_recruiter_company_requires_auth` | **PARTIAL** | Backend view exists. Frontend `recruiterService.js` was bound to mock data and hardcoded `companyId: 1`. Zero unit tests in `apps.companies`. |
| **FR-11**| Job Creation / Editing / Closing | `apps.jobs.views.JobListCreateView`, `JobDetailView`<br>`POST/PUT/PATCH /api/v1/jobs/` | `/recruiter/jobs`<br>`JobCreateEditPage.jsx` | `apps.accounts.test_auth`<br>`test_14_recruiter_cannot_modify_other_recruiter_job` | **PARTIAL** | Permissions enforce company ownership on update. Zero unit tests in `apps.jobs`. |
| **FR-12**| Applicants Ranked by AI Score | `apps.applications.views.JobApplicantsRankedListView`<br>`GET /api/v1/jobs/:id/applicants/` | `/recruiter/jobs/:id/applicants`<br>`JobApplicantsPage.jsx` | `apps.ai_engine.tests`<br>`test_12_explainable_matcher_integration` | **PARTIAL** | Backend sorts by `-ai_analysis__overall_match_score`. Frontend `recruiterService.js` was previously mock-bound (live call in working tree). |
| **FR-13**| Shortlist / Reject Candidates | `apps.applications.views.ApplicationStatusUpdateView`<br>`PATCH /api/v1/applications/:id/status/` | `/recruiter/jobs/:id/applicants`<br>`JobApplicantsPage.jsx` | `apps.applications.test_applications`<br>`test_valid_transitions_map` | **VERIFIED** | Validates state machine (`APPLIED -> REVIEWING -> SHORTLISTED -> ...`). Returns 400 on invalid transitions. |
| **FR-14**| Interview Scheduling | `apps.interviews.views.InterviewListCreateView`, `InterviewDetailView`<br>`POST /api/v1/interviews/` | `/recruiter/interviews`<br>`RecruiterInterviewsPage.jsx` | `apps.accounts.test_production`<br>`test_interviews_requires_auth` | **PARTIAL** | `interviewService.js` is entirely mock-bound. `InterviewDetailView` has IDOR exposure. Scheduling crashes if application not `SHORTLISTED`. |
| **FR-15**| Resume Text Extraction | `apps.ai_engine.parser.ResumeParser` | Profile upload trigger | `apps.ai_engine.tests`<br>`test_1_pdf_resume_extraction`<br>`test_2_docx_resume_extraction`<br>`test_4_multipage_pdf_resume`<br>`test_10_malformed_and_empty_input` | **VERIFIED** | PyMuPDF and python-docx parsing handles multi-page, tables, and malformed files cleanly. |
| **FR-16**| Parse Skills/Edu/Experience | `apps.ai_engine.extractor.NLPExtractor` | Candidate profile display | `apps.ai_engine.tests`<br>`test_5_skill_aliases_and_deduplication`<br>`test_6_experience_with_dates`<br>`test_7_education_degrees_and_grades`<br>`test_8_contact_coordinates`<br>`test_9_projects_extraction` | **VERIFIED** | Comprehensive extraction of contact, degrees (B.E, B.Tech, MCA), CGPA, work dates, projects, and skills. |
| **FR-17**| Semantic Embeddings | `apps.ai_engine.embeddings.EmbeddingService` | Internal AI computation | `apps.ai_engine.tests`<br>`test_12_explainable_matcher_integration` | **VERIFIED** | 384-dimensional dense vectors generated via `all-MiniLM-L6-v2`. |
| **FR-18**| Cosine Similarity Match Score | `apps.ai_engine.matcher.ExplainableMatcher` | Match score badge (`AIConfidence`) | `apps.ai_engine.tests`<br>`test_12_explainable_matcher_integration`<br>`test_ai_scoring_weights_sum_to_one` | **VERIFIED** | Composite formula: 60% Semantic, 30% Skill, 10% Experience. |
| **FR-19**| Matched & Missing Skills | `apps.ai_engine.matcher.ExplainableMatcher` | Match breakdown card | `apps.ai_engine.tests`<br>`test_12_explainable_matcher_integration` | **VERIFIED** | Accurately computes skill overlap and gap analysis against job's `required_skills`. |
| **FR-20**| User Management & Deactivation | `apps.accounts.views.AdminUserListView`, `AdminUserDetailView`<br>`GET/PATCH /api/v1/admin/users/` | `/admin/users`<br>`AdminUsersPage.jsx` | `apps.accounts.test_auth`<br>`test_08_deactivated_user_cannot_authenticate`<br>`test_12_admin_can_access_admin_endpoint` | **PARTIAL** | Backend endpoints functional and authenticated; frontend `adminService.js` is mock-bound. |
| **FR-21**| Job & Company Moderation | `apps.companies.views.AdminCompanyModerationView`<br>`PATCH /api/v1/admin/companies/:id/moderate/` | `/admin/companies`<br>`AdminCompaniesPage.jsx` | *None* | **MISSING / PARTIAL** | Backend lacks `GET /api/v1/admin/companies/` list endpoint. Moderation view has 0 tests. Frontend mock-bound. |
| **FR-22**| Platform Analytics | `apps.analytics.views.AdminAnalyticsView`<br>`GET /api/v1/admin/analytics/` | `/admin/dashboard`, `/admin/analytics`<br>`AdminDashboard.jsx` | `apps.accounts.test_production`<br>`test_admin_analytics_requires_auth` | **PARTIAL** | Backend returns flat object; frontend expects nested `{ platform_overview, applications_by_status, hiring_funnel }`. Crash on live API. |
| **FR-23**| Candidate Notification on Status | `apps.notifications.views.NotificationListView`<br>`GET /api/v1/notifications/` | Navbar Bell, `/candidate/notifications`<br>`TopBar.jsx` | `apps.accounts.test_production`<br>`test_notifications_requires_auth` | **MISSING / PARTIAL** | Models and views exist, but `Notification` records are NEVER created on status update. Frontend mock-bound. |
| **FR-24**| Recruiter Notification on Application | `apps.notifications.views.NotificationListView`<br>`GET /api/v1/notifications/` | Navbar Bell, `/recruiter/notifications`<br>`TopBar.jsx` | `apps.accounts.test_production`<br>`test_notifications_requires_auth` | **MISSING / PARTIAL** | Notifications are NOT triggered during `ApplicationSubmitView`. Notification table remains empty in live usage. |

---

## 5. Investigation of Potential Public Candidate-Data Exposure

### 5.1 Investigation Scope & Method
A systematic investigation was performed across git-tracked files, repository history, media directories, and documentation to determine if real candidate resumes or personal identifiable information (PII) were publicly exposed.
- All checks were conducted without deleting files, rewriting Git history, or reproducing personal details in this report.

### 5.2 Evidence & Findings
1. **Local Media Directory (`backend/media/`):**
   - The directory `backend/media/resumes/` contains 20 uploaded resume files (`.pdf` and `.docx`) from testing in September and October 2026.
   - **Git Tracking Status:** `backend/media/` is properly listed in `.gitignore` (lines 19–20). Execution of `git ls-files | grep -i "media/"` confirmed that **zero media files are tracked in the Git repository**.
2. **Critical Documentation Exposure (`docs/REAL_RESUME_EXTRACTION_AUDIT.md`):**
   - In contrast to the media directory, `docs/REAL_RESUME_EXTRACTION_AUDIT.md` **IS tracked in Git** and pushed to GitHub.
   - This document contains extracted parsing summaries of real individual resumes (lines 19–20, 85–121), including full personal names, locations, undergraduate degree details, exact CGPA/marks, and specific project names and URLs.
   - **Exposure Confirmation:** Real candidate personal information has been committed and exposed in the public documentation history of this repository.
3. **Application IDOR & Media Access Vector:**
   - In `backend/smart_ats/urls.py`, media files are routed via `django.conf.urls.static.static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)`. There is no authentication or tenant check on media URLs; anyone with a direct file path can download any candidate's resume.
   - In `backend/apps/interviews/views.py`, `InterviewDetailView` lacks object-level permission enforcement, exposing interview notes across tenants.

### 5.3 Required Safeguard Recommendations
- Add pre-commit hooks to block commits containing files matching `*RESUME*AUDIT*.md` or PII patterns.
- Sanitize or redact `docs/REAL_RESUME_EXTRACTION_AUDIT.md` using synthetic fixture labels (e.g., "Candidate X").
- Restrict media access in production using signed URLs (e.g., S3 pre-signed URLs or DRF protected download views) instead of direct public static serving.

---

## 6. Top 5 Highest-Risk Gaps

### Gap 1: Public Tracked Candidate Data in Git Documentation (Privacy & Compliance)
- **Files:** `docs/REAL_RESUME_EXTRACTION_AUDIT.md`
- **Impact:** Real candidate names, educational histories, and personal project identifiers are committed in Git-tracked documentation.
- **Risk:** High (GDPR/privacy violation, PII leak in public version control).

### Gap 2: Frontend Service Mock Boundary Disconnection (Functional Integrity)
- **Files:** `frontend/src/services/interviewService.js`, `frontend/src/services/notificationService.js`, `frontend/src/services/adminService.js`, `frontend/src/components/layout/TopBar.jsx`
- **Impact:** Interviews, notifications, and administrative moderation run on static, disconnected mock arrays even when `VITE_DEMO_MODE=false`.
- **Risk:** High (Core product features fail to reflect live backend database operations).

### Gap 3: Missing Admin Endpoints & Analytics Response Shape Mismatch (Runtime Crash)
- **Files:** `backend/apps/companies/urls.py`, `backend/apps/applications/urls.py`, `backend/apps/analytics/views.py`, `frontend/src/pages/admin/AdminDashboard.jsx`
- **Impact:** `GET /api/v1/admin/companies/` and `GET /api/v1/admin/applications/` do not exist in the backend. `AdminAnalyticsView` returns a flat object while the frontend destructures nested objects, causing an immediate runtime `TypeError`.
- **Risk:** High (Admin console completely inoperable against live API).

### Gap 4: IDOR Vulnerability & State Machine Failure in Interviews (Security & Integrity)
- **Files:** `backend/apps/interviews/views.py` (`InterviewDetailView`), `backend/apps/interviews/serializers.py`
- **Impact:** Authenticated users can query any interview PK without company/candidate ownership validation. In addition, scheduling an interview on an application that is in `APPLIED` or `REVIEWING` state triggers an uncaught `ValidationError` due to `Application.VALID_TRANSITIONS`.
- **Risk:** High (Unauthorized data access and broken scheduling workflow).

### Gap 5: Ephemeral File Storage on Render Deployment (Data Persistence)
- **Files:** `backend/smart_ats/settings.py`, `backend/render.yaml`
- **Impact:** Resumes are saved to container local disk `BASE_DIR / 'media'`. Each Render deploy or worker restart destroys all stored PDF/DOCX files, causing 404s on resume downloads.
- **Risk:** Medium-High (Silent data loss in cloud deployments).

---

## 7. Recommended Next Application Task

### Recommended Task: `TASK-003-admin-analytics-and-endpoints`
**Title:** Implement Missing Admin List Endpoints and Align Analytics Schema  
**Priority:** P1  
**Status:** DRAFT (Awaiting Human Approval)  
**Dependencies:** TASK-001 (Verified)  
**Scope:**
1. Implement `AdminCompanyListView` (`GET /api/v1/admin/companies/`) in `apps/companies/views.py` with `IsAdmin` permission.
2. Implement `AdminApplicationListView` (`GET /api/v1/admin/applications/`) in `apps/applications/views.py` with `IsAdmin` permission.
3. Align `AdminAnalyticsView` (`GET /api/v1/admin/analytics/`) response schema to return `{ platform_overview, applications_by_status, hiring_funnel }` matching frontend requirements.
4. Add unit test coverage in `apps/companies` and `apps/analytics`.
5. Connect `frontend/src/services/adminService.js` to live endpoints when not in demo mode.

*Note: This task remains strictly in DRAFT status until explicitly approved by the human owner.*
