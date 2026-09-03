# Requirements Traceability Matrix (FR-1 through FR-24)

| Req ID | Requirement | Primary Backend App | Key API Endpoint | Primary Frontend Route / UI | Core DB Entity |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **FR-1** | Candidate / Recruiter Registration | `apps.accounts` | `POST /api/v1/auth/register/` | `/register` (`RegisterPage.jsx`) | `User`, `Candidate`, `Recruiter` |
| **FR-2** | JWT Authentication | `apps.accounts` | `POST /api/v1/auth/token/`, `refresh/` | `/login` (`LoginPage.jsx`) | `User` |
| **FR-3** | Role-Based Access Control | `apps.accounts` | DRF Permissions (`IsCandidate`, etc.)| `ProtectedRoute`, `RoleGuard` | `User.role` |
| **FR-4** | Password Reset | `apps.accounts` | `POST /api/v1/auth/password-reset/` | `/forgot-password` | `User` |
| **FR-5** | Candidate Profile Management | `apps.accounts` | `GET/PUT /api/v1/candidate/profile/` | `/candidate/profile` | `Candidate`, `User` |
| **FR-6** | PDF / DOCX Resume Upload | `apps.accounts`, `ai_engine` | `POST /api/v1/candidate/resume/` | `/candidate/profile` (Upload section)| `Candidate.resume_file` |
| **FR-7** | Job Browsing & Search | `apps.jobs` | `GET /api/v1/jobs/` | `/jobs`, `/jobs/:id` | `Job`, `Company` |
| **FR-8** | Job Application | `apps.applications` | `POST /api/v1/applications/` | `/jobs/:id` (`ApplyModal.jsx`) | `Application` |
| **FR-9** | Application Tracking | `apps.applications` | `GET /api/v1/candidate/applications/`| `/candidate/applications` | `Application`, `Job` |
| **FR-10**| Company Profile Management | `apps.companies` | `GET/PUT /api/v1/recruiter/company/` | `/recruiter/company` | `Company`, `Recruiter` |
| **FR-11**| Job Creation / Editing / Closing | `apps.jobs` | `POST/PUT/PATCH /api/v1/jobs/` | `/recruiter/jobs`, `/recruiter/jobs/new` | `Job` |
| **FR-12**| Applicants Ranked by AI Score | `apps.applications`, `ai_engine`| `GET /api/v1/jobs/:id/applicants/` | `/recruiter/jobs/:id/applicants` | `Application`, `AIAnalysis` |
| **FR-13**| Shortlist / Reject Candidates | `apps.applications` | `PATCH /api/v1/applications/:id/status/`| `/recruiter/jobs/:id/applicants` | `Application.status` |
| **FR-14**| Interview Scheduling | `apps.interviews` | `POST /api/v1/interviews/` | `/recruiter/interviews/new` | `Interview`, `Application`|
| **FR-15**| Resume Text Extraction | `apps.ai_engine.parser` | Triggered internally on upload | Upload progress state | `Candidate.raw_resume_text`|
| **FR-16**| Parse Skills/Edu/Experience | `apps.ai_engine.extractor` | Triggered internally | Skill badges in Profile/Application | `Candidate.parsed_skills` |
| **FR-17**| Semantic Embeddings (SentenceTrans.)| `apps.ai_engine.embeddings` | Triggered on job/application eval | Backend calculation | In-memory / vector cache |
| **FR-18**| Cosine Similarity Match Score | `apps.ai_engine.matcher` | Returned in Application endpoints | Match score badge (`AIConfidence`)| `AIAnalysis.overall_match_score`|
| **FR-19**| Matched & Missing Skills | `apps.ai_engine.matcher` | Returned in Application endpoints | Match breakdown card | `AIAnalysis.matched_skills`, `missing_skills`|
| **FR-20**| User Management & Deactivation | `apps.accounts` | `GET/PATCH /api/v1/admin/users/` | `/admin/users` | `User.is_active` |
| **FR-21**| Job & Company Moderation | `apps.companies`, `jobs` | `PATCH /api/v1/admin/moderate/...` | `/admin/moderation` | `Company`, `Job` |
| **FR-22**| Platform Analytics | `apps.analytics` | `GET /api/v1/admin/analytics/` | `/admin/dashboard` | Aggregates across tables |
| **FR-23**| Notify Candidate on Status Change| `apps.notifications` | `GET /api/v1/notifications/` | Navbar Bell + Toast Notification | `Notification` |
| **FR-24**| Notify Recruiter on New App | `apps.notifications` | `GET /api/v1/notifications/` | Navbar Bell + Toast Notification | `Notification` |
