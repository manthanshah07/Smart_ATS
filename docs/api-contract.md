# API Contract Specification (v1)

**Base URL:** `/api/v1/`  
**Authentication Scheme:** `Authorization: Bearer <JWT_ACCESS_TOKEN>`

---

## 1. Authentication & Accounts (`/api/v1/auth/`)

### 1.1 Register User
* **Endpoint:** `POST /api/v1/auth/register/`
* **Access:** Public
* **Request Body:**
```json
{
  "email": "candidate@example.com",
  "password": "SecurePassword123!",
  "first_name": "Jane",
  "last_name": "Doe",
  "role": "CANDIDATE" // "CANDIDATE" | "RECRUITER"
}
```
* **Response (201 Created):**
```json
{
  "id": 1,
  "email": "candidate@example.com",
  "first_name": "Jane",
  "last_name": "Doe",
  "role": "CANDIDATE"
}
```
* **Errors:** `400 Bad Request` (Validation errors, duplicate email).

---

### 1.2 Obtain JWT Token (Login)
* **Endpoint:** `POST /api/v1/auth/token/`
* **Access:** Public
* **Request Body:**
```json
{
  "email": "candidate@example.com",
  "password": "SecurePassword123!"
}
```
* **Response (200 OK):**
```json
{
  "access": "<JWT_ACCESS_TOKEN>",
  "refresh": "<JWT_REFRESH_TOKEN>",
  "user": {
    "id": 1,
    "email": "candidate@example.com",
    "first_name": "Jane",
    "last_name": "Doe",
    "role": "CANDIDATE"
  }
}
```
* **Errors:** `401 Unauthorized` (Invalid credentials).

---

### 1.3 Refresh JWT Token
* **Endpoint:** `POST /api/v1/auth/token/refresh/`
* **Access:** Public
* **Request Body:**
```json
{
  "refresh": "<JWT_REFRESH_TOKEN>"
}
```
* **Response (200 OK):**
```json
{
  "access": "<NEW_JWT_ACCESS_TOKEN>"
}
```

---

### 1.4 Password Reset Request
* **Endpoint:** `POST /api/v1/auth/password-reset/`
* **Access:** Public
* **Request Body:** `{ "email": "candidate@example.com" }`
* **Response (200 OK):** `{ "message": "Password reset instructions sent if email exists." }`

---

## 2. Candidate Endpoints (`/api/v1/candidate/`)

### 2.1 Get / Update Profile
* **Endpoint:** `GET /api/v1/candidate/profile/`, `PUT/PATCH /api/v1/candidate/profile/`
* **Access:** Authenticated (`CANDIDATE`)
* **Request Body (PATCH):**
```json
{
  "phone": "+1234567890",
  "headline": "Senior Full-Stack Python/React Engineer",
  "bio": "Experienced builder with 5 years in Django & React.",
  "location": "San Francisco, CA"
}
```
* **Response (200 OK):**
```json
{
  "id": 1,
  "email": "candidate@example.com",
  "phone": "+1234567890",
  "headline": "Senior Full-Stack Python/React Engineer",
  "bio": "Experienced builder with 5 years in Django & React.",
  "location": "San Francisco, CA",
  "parsed_skills": ["Python", "Django", "React", "PostgreSQL"],
  "parsed_education": [{"degree": "B.S. Computer Science", "institution": "State University"}],
  "parsed_experience": [{"title": "Software Engineer", "company": "Tech Corp", "years": 3}],
  "resume_file": "/media/resumes/2026/09/resume.pdf",
  "resume_uploaded_at": "2026-09-03T10:00:00Z"
}
```

---

### 2.2 Upload Resume
* **Endpoint:** `POST /api/v1/candidate/resume/`
* **Access:** Authenticated (`CANDIDATE`)
* **Request:** `multipart/form-data` with `file: <resume.pdf|resume.docx>`
* **Response (200 OK):** Profile object with updated `parsed_skills`, `parsed_education`, `parsed_experience`.
* **Errors:** `400 Bad Request` (Unsupported file type or oversized file > 5MB).

---

## 3. Job Endpoints (`/api/v1/jobs/`)

### 3.1 List / Search Jobs
* **Endpoint:** `GET /api/v1/jobs/`
* **Access:** Public / Authenticated
* **Query Params:** `?search=python&location=remote&job_type=FULL_TIME&page=1`
* **Response (200 OK):** Paginated list of open jobs with company details.

---

### 3.2 Get Job Details
* **Endpoint:** `GET /api/v1/jobs/{id}/`
* **Access:** Public / Authenticated
* **Response (200 OK):** Detailed Job model representation.

---

### 3.3 Create / Update / Close Job
* **Endpoints:** `POST /api/v1/jobs/`, `PUT/PATCH /api/v1/jobs/{id}/`
* **Access:** Authenticated (`RECRUITER`)
* **Request Body (POST):**
```json
{
  "title": "Senior Backend Developer",
  "description": "We are seeking a senior backend developer...",
  "department": "Engineering",
  "location": "Remote",
  "job_type": "FULL_TIME",
  "experience_min_years": 4,
  "required_skills": ["Python", "Django", "PostgreSQL", "Docker"],
  "preferred_skills": ["Redis", "AWS", "CI/CD"],
  "status": "OPEN"
}
```
* **Response (201 Created / 200 OK):** Job object.

---

## 4. Recruiter Endpoints (`/api/v1/recruiter/`)

### 4.1 Manage Company Profile
* **Endpoint:** `GET/PUT/PATCH /api/v1/recruiter/company/`
* **Access:** Authenticated (`RECRUITER`)
* **Response (200 OK):** Associated Company model object.

---

### 4.2 View Ranked Applicants for a Job
* **Endpoint:** `GET /api/v1/jobs/{job_id}/applicants/`
* **Access:** Authenticated (`RECRUITER` - owner of the job)
* **Response (200 OK):**
```json
[
  {
    "application_id": 101,
    "candidate_id": 12,
    "candidate_name": "Jane Doe",
    "candidate_email": "jane@example.com",
    "status": "APPLIED",
    "applied_at": "2026-09-03T12:00:00Z",
    "ai_analysis": {
      "overall_match_score": 88.5,
      "semantic_similarity_score": 85.0,
      "skill_match_score": 92.0,
      "experience_match_score": 95.0,
      "matched_skills": ["Python", "Django", "PostgreSQL"],
      "missing_skills": ["Docker"],
      "experience_match_summary": "Meets 4+ years minimum requirement."
    }
  }
]
```

---

## 5. Application Endpoints (`/api/v1/applications/`)

### 5.1 Submit Application
* **Endpoint:** `POST /api/v1/applications/`
* **Access:** Authenticated (`CANDIDATE`)
* **Request Body:** `{ "job_id": 5 }`
* **Response (201 Created):** Created Application record with `ai_analysis` summary.
* **Errors:** `400 Bad Request` (Missing resume), `409 Conflict` (Duplicate application).

---

### 5.2 List Candidate's Applications
* **Endpoint:** `GET /api/v1/candidate/applications/`
* **Access:** Authenticated (`CANDIDATE`)
* **Response (200 OK):** List of candidate's own submitted applications with status & AI match preview.

---

### 5.3 Update Application Status (Shortlist / Reject)
* **Endpoint:** `PATCH /api/v1/applications/{id}/status/`
* **Access:** Authenticated (`RECRUITER` managing the job)
* **Request Body:** `{ "status": "SHORTLISTED" }` // Validated against State Machine
* **Response (200 OK):** Updated Application record.
* **Errors:** `400 Bad Request` (Illegal state transition).

---

## 6. Interview Endpoints (`/api/v1/interviews/`)

### 6.1 Schedule Interview
* **Endpoint:** `POST /api/v1/interviews/`
* **Access:** Authenticated (`RECRUITER`)
* **Request Body:**
```json
{
  "application_id": 101,
  "scheduled_time": "2026-09-10T15:00:00Z",
  "duration_minutes": 60,
  "interview_type": "TECHNICAL",
  "meeting_link_or_location": "https://meet.google.com/abc-defg-hij"
}
```
* **Response (201 Created):** Interview object; moves application status to `INTERVIEW_SCHEDULED`.

---

## 7. Notification Endpoints (`/api/v1/notifications/`)

### 7.1 List Notifications
* **Endpoint:** `GET /api/v1/notifications/`
* **Access:** Authenticated (Any role)
* **Response (200 OK):** Paginated notification list for the authenticated user.

### 7.2 Mark as Read
* **Endpoint:** `PATCH /api/v1/notifications/{id}/read/`
* **Access:** Authenticated (Owner of notification)
* **Response (200 OK):** `{ "id": 1, "is_read": true }`

---

## 8. Admin Endpoints (`/api/v1/admin/`)

### 8.1 List / Deactivate Users
* **Endpoint:** `GET /api/v1/admin/users/`, `PATCH /api/v1/admin/users/{id}/`
* **Access:** Authenticated (`ADMIN`)
* **Request Body (PATCH):** `{ "is_active": false }`
* **Response (200 OK):** Updated User object.

### 8.2 Platform Analytics
* **Endpoint:** `GET /api/v1/admin/analytics/`
* **Access:** Authenticated (`ADMIN`)
* **Response (200 OK):** Total users, candidates, recruiters, jobs posted, applications processed, average match score.
