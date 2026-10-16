# APPLICATION & AI MATCHING AUDIT

**Date:** 2026-10-01
**Scope:** Candidate → Job → Apply → AI Evaluation → Recruiter views applicant → Explainable Match
**Mode:** `VITE_DEMO_MODE=false` (live API)

---

## 1. Current End-to-End Flow

```
[CANDIDATE]
  → GET  /api/v1/jobs/{id}/           ← Browse job (AllowAny)
  → POST /api/v1/applications/        ← Submit application (IsCandidate)
      └─ ApplicationSubmitView.perform_create()
          ├─ Snapshots candidate.parsed_skills/education/experience → resume_snapshot{}
          ├─ Application.save() → creates ApplicationStatusHistory(APPLIED)
          └─ AIPipelineService.evaluate_application(application)
              └─ ExplainableMatcher.calculate_match(candidate, job)
                  ├─ EmbeddingService (all-MiniLM-L6-v2, ~9s first run)
                  ├─ Cosine similarity on resume_text vs job title+description
                  ├─ Skill intersection (required_skills vs parsed_skills)
                  └─ Experience alignment (years vs experience_min_years)
              └─ AIAnalysis.objects.update_or_create(application=application, defaults=results)
  ← 201 ApplicationSerializer (includes ai_analysis embedded)

[RECRUITER]
  → GET  /api/v1/jobs/{job_id}/applicants/   ← Ranked list (IsRecruiter|IsAdmin)
      └─ ordered by ai_analysis__overall_match_score DESC
  ← ApplicationSerializer[] (includes ai_analysis embedded per row)

  → PATCH /api/v1/applications/{id}/status/  ← Status update (IsRecruiter|IsAdmin)
```

### Frontend Flow (VITE_DEMO_MODE=false)

```
JobDetailsPage
  → jobService.getJobById(id)              → GET /api/v1/jobs/{id}/
  → applicationService.submitApplication(id) → POST /api/v1/applications/
  → navigate(/candidate/applications/{createdApp.id})

CandidateApplicationDetailPage
  → applicationService.getApplicationById(id)
        BUG: calls GET /api/v1/candidate/applications/ (list), then filters by id in memory
  → reads app.ai_analysis directly from the Application object

JobApplicantsPage (recruiter)
  → recruiterService.getApplicantsForJob(jobId)   ← MOCK ONLY, never hits API
  → jobService.getJobById(id)

RecruiterApplicationDetailPage
  → applicationService.getApplicationById(id)
        BUG: calls GET /api/v1/candidate/applications/ (IsCandidate permission),
             recruiter gets 403 Forbidden
```

---

## 2. What Currently Works

### Backend — Fully Working

| Feature | Endpoint | Status |
|---------|----------|--------|
| Candidate applies to job | `POST /api/v1/applications/` | ✅ Works |
| Resume snapshot captured at application time | embedded in create | ✅ Works |
| AI pipeline runs synchronously on submission | in-process | ✅ Works |
| AIAnalysis created and persisted | DB | ✅ Works |
| Application serializer embeds ai_analysis | `ApplicationSerializer` | ✅ Works |
| Recruiter views ranked applicant list | `GET /api/v1/jobs/{id}/applicants/` | ✅ Works |
| Company ownership guard | `JobApplicantsRankedListView` | ✅ Works |
| Status update by recruiter | `PATCH /api/v1/applications/{id}/status/` | ✅ Works |
| Candidate views own application list | `GET /api/v1/candidate/applications/` | ✅ Works |
| Application withdraw | `PATCH /api/v1/candidate/applications/{id}/withdraw/` | ✅ Works |
| State machine validation | `ApplicationSerializer.validate_status` | ✅ Works |
| Duplicate application guard | UniqueConstraint + view check | ✅ Works |
| Cross-company isolation (recruiter != job.company → 403) | `check_object_permissions` | ✅ Works |

### Frontend — Partially Working

| Feature | Status |
|---------|--------|
| Job browse & detail page (live API) | ✅ Works |
| Apply button → `POST /api/v1/applications/` | ✅ Works |
| Navigate to `/candidate/applications/{id}` after apply | ✅ Works |
| Candidate application list page | ✅ Works (uses real API) |
| AI analysis card component renders if data is present | ✅ Works |

---

## 3. What Currently Fails

### FAILURE 1 — No `GET /api/v1/applications/{id}/` detail endpoint

**Severity: P0 — Demo-breaking**

- **Frontend file:** `applicationService.js` lines 53–71
- **Backend file:** `apps/applications/urls.py`
- **Endpoint:** `GET /api/v1/applications/{id}/` — **does not exist**
- **Actual behavior in `getApplicationById()`:**
  ```js
  const response = await apiClient.get('/candidate/applications/')  // fetches FULL LIST
  const app = results.find((a) => a.id === Number(id))             // filters in memory
  ```
- **Root cause:** `apps/applications/urls.py` only registers:
  `POST /applications/`, `GET /candidate/applications/`,
  `PATCH /candidate/applications/{id}/withdraw/`,
  `GET /jobs/{id}/applicants/`, `PATCH /applications/{id}/status/`.
  No single-object retrieval endpoint exists.
- **Impact:** Works for candidates (hitting their own list), but routes a recruiter to a 403-guarded endpoint.

---

### FAILURE 2 — `RecruiterApplicationDetailPage` calls candidate-only endpoint → 403

**Severity: P0 — Demo-breaking**

- **Frontend file:** `RecruiterApplicationDetailPage.jsx` line 51
- **Backend file:** `apps/applications/views.py` line 64
- **Endpoint hit:** `GET /api/v1/candidate/applications/`
- **Permission:** `[IsAuthenticated, IsCandidate]`
- **Actual error:** `403 Forbidden`
- **Root cause:** `RecruiterApplicationDetailPage` calls `applicationService.getApplicationById(id)` which always goes to the candidate list endpoint. A recruiter JWT gets rejected.
- **Impact:** Recruiter cannot open any application detail or see any AI evaluation in live API mode.

---

### FAILURE 3 — `recruiterService.getApplicantsForJob()` is 100% mock

**Severity: P0 — Demo-breaking**

- **Frontend file:** `recruiterService.js` lines 17–21
- **Actual code:**
  ```js
  getApplicantsForJob: async (jobId) => {
    return MOCK_APPLICATIONS.filter((a) => a.job_id === Number(jobId)).sort(...)
  }
  ```
- **Root cause:** Ignores `VITE_DEMO_MODE`, never calls the API. `JobApplicantsPage` uses this exclusively.
- **Impact:** Real applications will never appear in the recruiter's pipeline view.

---

### FAILURE 4 — `aiService.js` is 100% mock (latent)

**Severity: P1 — Visibly broken (latent)**

- **Frontend file:** `aiService.js` lines 18–22
- **Root cause:** Always reads `MOCK_APPLICATIONS`, no `isDemoMode` guard, no real endpoint call.
- **Current impact:** Neither detail page actually calls `aiService` today — both read `app.ai_analysis` directly from the application object. This is latent; becomes P0 if any component wires to it.

---

### FAILURE 5 — `resume_snapshot` field keys mismatch

**Severity: P1 — Visibly broken**

- **Frontend files:** `RecruiterApplicationDetailPage.jsx` lines 106–108, `JobApplicantsPage.jsx` line 183
- **Backend creates snapshot with:**
  ```python
  resume_snapshot = {
      'parsed_skills': candidate.parsed_skills,   # dict {"languages": [], ...}
      'parsed_education': candidate.parsed_education,
      'parsed_experience': candidate.parsed_experience,
      'headline': candidate.headline,
      'bio': candidate.bio,
  }
  ```
- **UI reads:**
  ```js
  const skills = resume.skills || []        // "skills" doesn't exist → always []
  const education = resume.education || []  // "education" vs "parsed_education"
  const experience = resume.experience || []// "experience" vs "parsed_experience"
  ```
- **Impact:** Resume skills, education, and experience panels are always blank for real applications.

---

### FAILURE 6 — `normalizeApp` has wrong field paths for candidate name/email

**Severity: P1 — Visibly broken**

- **Frontend file:** `applicationService.js` lines 14–15
- **Actual code:**
  ```js
  candidate_name: `${app.candidate_details?.user_name || ''}`.trim() || 'Unknown Candidate',
  candidate_email: app.candidate_details?.user_email || '',
  ```
- **Actual `CandidateProfileSerializer` fields:** `first_name`, `last_name`, `email`, `name` (computed)
- **Root cause:** `user_name` and `user_email` do not exist in the serializer output.
- **Impact:** Every real application shows `candidate_name = 'Unknown Candidate'` and blank email.

---

### FAILURE 7 — `JobDetailsPage` uses wrong experience field name

**Severity: P2 — Polish**

- **Frontend file:** `JobDetailsPage.jsx` line 104
- **Code:** `{job.min_experience_years || 2}` — field doesn't exist
- **Actual backend field:** `experience_min_years`
- **Impact:** Always shows "Min 2+ Yrs" regardless of actual job requirement.

---

### FAILURE 8 — Recruiter with `company=None` always gets 403

**Severity: P1 — Setup-dependent**

- **Backend file:** `apps/applications/views.py` line 88
- **Root cause:** `None != job.company` is always `True`, so unaffiliated recruiters are always blocked.
- **Impact:** Recruiter without an assigned company cannot view applicants; relevant for demo setup.

---

## 4. AI Evaluation Output

### Fields Produced by ExplainableMatcher → Stored in AIAnalysis

| Field | Type | Description |
|-------|------|-------------|
| `overall_match_score` | Float 0–100 | `0.6×semantic + 0.3×skill + 0.1×experience` |
| `semantic_similarity_score` | Float 0–100 | Cosine sim via `all-MiniLM-L6-v2` |
| `skill_match_score` | Float 0–100 | `len(required ∩ parsed) / len(required) × 100` |
| `experience_match_score` | Float 0–100 | `min(100, candidate_yrs / req_yrs × 100)` |
| `matched_skills` | `List[str]` | `required_skills ∩ parsed_skills` |
| `missing_skills` | `List[str]` | `required_skills - parsed_skills` |
| `experience_match_summary` | `str` | Human-readable sentence |
| `explanation` | JSON | `{summary, semantic_summary, strengths, recommendations}` |
| `model_name` | `str` | `"all-MiniLM-L6-v2"` |
| `model_version` | `str` | `"1.0.0"` |
| `created_at` | datetime | Auto |

### Verified Output from Live E2E Run (2026-10-01)

```
Overall Score:        60.5%
Semantic Similarity:  59.1%
Skill Match:          83.3%
Experience Match:     0.0%  ← parsed_experience=[] (extractor found no duration field)
Matched Skills:       ['Django', 'Docker', 'PostgreSQL', 'Python', 'REST API']
Missing Skills:       ['Kubernetes']
Experience Summary:   Candidate has 0.0 years, falling short of required 4 years.
explanation.summary:  "AI Match Analysis complete."
explanation.semantic_summary: "Vector similarity is 59.1%"
explanation.strengths: ['Django', 'Docker', 'PostgreSQL', 'Python', 'REST API']
explanation.recommendations: ['Kubernetes']
```

### Known Limitation — Experience Scoring

Experience score is frequently 0% because the experience parser requires either `"X years"` text or year ranges (`"2021 – 2024"`) in `parsed_experience[].duration`. Free-text "5 years of experience" in a resume paragraph ends up in `raw_resume_text`, not `parsed_experience`.

---

## 5. Recruiter Experience (Live API Mode)

| Feature | Accessible? | Notes |
|---------|------------|-------|
| Backend `GET /api/v1/jobs/{id}/applicants/` | ✅ Yes | Returns ranked list with `ai_analysis` |
| Real applicants in `JobApplicantsPage` | ❌ No | `recruiterService` is mock-only |
| Application detail page | ❌ No | 403 Forbidden (candidate-only endpoint) |
| AI scores in detail view | ❌ No | Blocked by 403 |
| Candidate name shown correctly | ❌ No | `normalizeApp` uses wrong field `user_name` |
| Candidate skills in list | ❌ No | `resume_snapshot.skills` is wrong key |
| Status update (shortlist/reject) | ✅ Yes | `PATCH /api/v1/applications/{id}/status/` works |

**Net result:** The recruiter sees mock data in the list view and a 403 error in the detail view. The entire recruiter flow is disconnected from the database.

---

## 6. Candidate Experience (Live API Mode)

| Feature | Accessible? | Notes |
|---------|------------|-------|
| Apply to a job | ✅ Yes | `POST /api/v1/applications/` works |
| See applications list | ✅ Yes | `GET /api/v1/candidate/applications/` works |
| Navigate to application detail after apply | ✅ Partially | Fetches list then filters — works, inefficient |
| See AI overall score | ✅ Yes | Embedded in `ai_analysis` |
| See matched/missing skills | ✅ Yes | Embedded in `ai_analysis` |
| See experience summary | ✅ Yes | Embedded in `ai_analysis` |
| See resume snapshot skills/education/experience | ❌ No | Wrong key names in UI |
| Withdraw application | ✅ Yes | `PATCH .../withdraw/` works |

---

## 7. Security / RBAC

| Check | Status | Notes |
|-------|--------|-------|
| Only authenticated users can apply | ✅ | `IsAuthenticated, IsCandidate` |
| Only candidates can apply (not recruiters) | ✅ | `IsCandidate` permission class |
| Candidate cannot apply twice to same job | ✅ | DB `UniqueConstraint` + view pre-check |
| Candidate cannot apply to closed jobs | ✅ | View checks `job.status == CLOSED` |
| Recruiter sees only own company's applicants | ✅ | `job.company != recruiter.company → 403` |
| Cross-company status update blocked | ✅ | `check_object_permissions` in `ApplicationStatusUpdateView` |
| Candidate can only withdraw own application | ✅ | `obj.candidate != candidate → 403` |
| Unauthenticated cannot view applicants | ✅ | `IsAuthenticated` required |
| Recruiter cannot access candidate list | ✅ | `IsCandidate` guard → 403 |
| Admin bypass on recruiter endpoints | ✅ | `IsRecruiter | IsAdmin` |

**No RBAC vulnerabilities found.** Backend model is sound. The only frontend RBAC issue is routing recruiters to a candidate-only endpoint.

---

## 8. Mock / Hardcoded Data Affecting Demo Flow

| Location | Value | Impact |
|----------|-------|--------|
| `recruiterService.js:17` | `getApplicantsForJob()` always uses `MOCK_APPLICATIONS` | **P0**: JobApplicantsPage never shows real data |
| `applicationService.js:53–65` | `getApplicationById()` always calls candidate list endpoint | **P0**: Recruiter gets 403 on detail page |
| `aiService.js:18–22` | Always reads `MOCK_APPLICATIONS` | P1: Latent — not called by detail pages today |
| `RecruiterApplicationDetailPage.jsx:41` | `scheduled_time: '2026-09-15T15:00'` (past date) | P2 |
| `RecruiterApplicationDetailPage.jsx:44` | `interviewer_name: 'Alex Vance (Lead Recruiter)'` | P2 |
| `RecruiterApplicationDetailPage.jsx:45` | `meeting_link_or_location: 'https://meet.google.com/xyz-ats-demo'` | P2 |
| `applicationService.js:87` | `candidate_id: 101` in mock submit branch | P2: Demo mode only |
| `JobDetailsPage.jsx:104` | `job.min_experience_years || 2` (wrong field + bad fallback) | P2: Always shows "Min 2+ Yrs" |

---

## 9. Minimum Fixes Required

### P0 — Demo-Breaking

#### P0-A: Add `GET /api/v1/applications/{id}/` backend endpoint
- **Files:** `apps/applications/views.py`, `apps/applications/urls.py`
- **Fix:** Add `ApplicationDetailView(RetrieveAPIView)` — candidates see their own, recruiters see their company's.
- **Unblocks:** `RecruiterApplicationDetailPage`, `CandidateApplicationDetailPage`

#### P0-B: Wire `recruiterService.getApplicantsForJob()` to real API
- **File:** `frontend/src/services/recruiterService.js`
- **Fix:** Add `isDemoMode` guard; call `apiClient.get('/jobs/${jobId}/applicants/')` in live mode, run through `normalizeApp`.
- **Unblocks:** `JobApplicantsPage` shows real ranked applicants

#### P0-C: Fix `applicationService.getApplicationById()` for recruiters
- **File:** `frontend/src/services/applicationService.js`
- **Fix after P0-A:** Call `GET /api/v1/applications/{id}/` directly for both roles.
- **Unblocks:** `RecruiterApplicationDetailPage` — no longer 403s

---

### P1 — Visibly Broken

#### P1-A: Fix `normalizeApp` candidate name/email field paths
- **File:** `frontend/src/services/applicationService.js` lines 14–15
- **Fix:**
  ```js
  candidate_name: app.candidate_details?.name ||
    `${app.candidate_details?.first_name || ''} ${app.candidate_details?.last_name || ''}`.trim() ||
    'Unknown Candidate',
  candidate_email: app.candidate_details?.email || '',
  ```

#### P1-B: Fix `resume_snapshot` key reads in recruiter pages
- **Files:** `RecruiterApplicationDetailPage.jsx` lines 106–108, `JobApplicantsPage.jsx` line 183
- **Fix:**
  ```js
  const rawSkills = resume.parsed_skills
  const skills = rawSkills
    ? (Array.isArray(rawSkills) ? rawSkills : Object.values(rawSkills).flat())
    : []
  const education = resume.parsed_education || []
  const experience = resume.parsed_experience || []
  ```

---

### P2 — Polish

#### P2-A: Fix experience field name in `JobDetailsPage`
- **Fix:** `job.experience_min_years || 0`

#### P2-B: Fix hardcoded past date in interview modal
- **Fix:** `new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 16)`

---

## 10. Recommended Implementation Order

```
Step 1  [P0-A]  Add GET /api/v1/applications/{id}/ backend endpoint
                → apps/applications/views.py  (new ApplicationDetailView)
                → apps/applications/urls.py   (register path)

Step 2  [P0-B]  Wire recruiterService.getApplicantsForJob() to live API
                → frontend/src/services/recruiterService.js

Step 3  [P0-C]  Fix applicationService.getApplicationById() to use new endpoint
                → frontend/src/services/applicationService.js

Step 4  [P1-A]  Fix normalizeApp candidate name/email field paths
                → frontend/src/services/applicationService.js

Step 5  [P1-B]  Fix resume_snapshot key reads in recruiter pages
                → RecruiterApplicationDetailPage.jsx
                → JobApplicantsPage.jsx

Step 6  [P2-A]  Fix experience field name in JobDetailsPage
                → JobDetailsPage.jsx

Step 7  [P2-B]  Fix hardcoded past interview date
                → RecruiterApplicationDetailPage.jsx
```

---

## Final Report

### Can Candidate → Apply → AI Evaluation currently work end-to-end?

**YES.** The backend pipeline is complete and verified by live e2e test. `POST /api/v1/applications/` creates the application, synchronously runs `ExplainableMatcher`, persists `AIAnalysis`, and returns the full result with `ai_analysis` embedded in the 201 response. The candidate can view their application via the list endpoint and see AI scores. Resume snapshot display is blank (P1-B) but core AI data is present and rendered.

### Can Recruiter → Applicant → AI Evaluation currently work end-to-end?

**NO.** Two blockers:
1. `JobApplicantsPage` reads from `MOCK_APPLICATIONS` — real applicants never appear.
2. `RecruiterApplicationDetailPage` hits `GET /candidate/applications/` with a recruiter JWT → **403 Forbidden**.

### Biggest Blocker
`recruiterService.getApplicantsForJob()` is entirely mock — recruiter pipeline list is fully disconnected from the database.

### Second Biggest Blocker
Missing `GET /api/v1/applications/{id}/` endpoint — no role-safe way to fetch a single application, causing recruiter detail page to always 403.

### Third Biggest Blocker
`normalizeApp` uses `user_name`/`user_email` which don't exist in `CandidateProfileSerializer` output. Every real application renders as "Unknown Candidate" with blank email.

### Exact Files to Modify Next (in order)

1. `apps/applications/views.py` — Add `ApplicationDetailView`
2. `apps/applications/urls.py` — Register `GET /applications/{id}/`
3. `frontend/src/services/recruiterService.js` — Wire `getApplicantsForJob()` to real API
4. `frontend/src/services/applicationService.js` — Fix `getApplicationById()` + fix `normalizeApp` field paths
5. `frontend/src/pages/recruiter/RecruiterApplicationDetailPage.jsx` — Fix `resume_snapshot` key reads
6. `frontend/src/pages/recruiter/JobApplicantsPage.jsx` — Fix `resume_snapshot.skills` key
7. `frontend/src/pages/public/JobDetailsPage.jsx` — Fix `min_experience_years` → `experience_min_years`
