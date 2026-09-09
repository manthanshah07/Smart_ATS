# SmartATS Candidate + Job Workflow Audit

## 1. Current State
The backend has skeleton Django REST Framework views for Applications (`apps/applications/views.py`) and Jobs (`apps/jobs/views.py`), and Candidate endpoints (`CandidateProfileView` and `CandidateResumeUploadView` in `apps/accounts/views.py`).
The frontend contains Mock-based service files (`candidateService.js`, `jobService.js`, `applicationService.js`) which return static JSON arrays.

## 2. Candidate Profile & Resume APIs
### Backend
- **Endpoint**: `GET/PATCH /api/v1/candidate/profile/` and `POST /api/v1/candidate/resume/`.
- **Logic**: Expected to read the authenticated `User.candidate_profile`.
- **Gap**: Need to verify if the views exist and properly support updates. Also, resume upload parsing needs to be skipped or stubbed out without doing actual AI parsing, but returning a success state.

### Frontend
- **Current**: Returns `MOCK_USERS.candidate.profile`.
- **Target**: Must use `apiClient` to fetch from `/api/v1/candidate/profile/` and `POST` to `/api/v1/candidate/resume/` using multipart/form-data.

## 3. Job APIs
### Backend
- **Endpoint**: `GET/POST /api/v1/jobs/` and `GET/PATCH/DELETE /api/v1/jobs/{id}/`.
- **Logic**: Filters by `search`, `job_type`, `location`. Public candidates only see `OPEN` jobs. Recruiters see their own company jobs.
- **Gap**: Sorting needs to be verified (e.g. `order_by('-created_at')`). Pagination is enforced via DRF defaults (limit 10).

### Frontend
- **Current**: Searches `MOCK_JOBS`.
- **Target**: Pass query params via `apiClient.get('/jobs/')`. Must handle DRF's paginated response (`response.data.results`, `response.data.count`).

## 4. Application APIs
### Backend
- **Endpoints**: 
  - `POST /api/v1/applications/` (Submit)
  - `GET /api/v1/candidate/applications/` (Candidate list)
  - `GET /api/v1/jobs/{job_id}/applicants/` (Recruiter list)
  - `PATCH /api/v1/applications/{id}/status/` (Update status)
- **Logic**: Prevents duplicates, closed jobs. Derives candidate from `request.user.candidate_profile`.
- **Gap**: Needs application withdrawal logic for candidate (`PATCH` status to `WITHDRAWN`). History tracking must also be verified.

### Frontend
- **Current**: Pushes to `MOCK_APPLICATIONS`.
- **Target**: Use `apiClient.post('/applications/')` etc.

## 5. UI and Error Handling
The UI currently assumes synchronous returns from mocks. When switching to real APIs:
- Need to unwrap DRF pagination (`res.data.results`).
- Need to map backend field names (e.g., handling nested `recruiter.user.first_name` vs flattened mock fields).
- Handle `loading` and `error` states gracefully without silently falling back to mock data when `isDemoMode === false`.

## 6. Implementation Plan Next Steps
1. Adjust the frontend service files (`candidateService.js`, `jobService.js`, `applicationService.js`) to switch between Mock and Real API depending on `import.meta.env.VITE_DEMO_MODE`.
2. Adapt frontend component data mappings to match DRF responses.
3. Test end-to-end functionality including database persistence, search parameters, and pagination.
4. Run automated test suites for validation.
