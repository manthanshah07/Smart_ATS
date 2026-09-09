# SmartATS Frontend API Contract
*For Django Backend Implementation — Phase 6+*

This document defines the REST API contract that the SmartATS frontend expects from the Django backend. All endpoints assume the prefix `/api/v1/`.

---

## Authentication

### POST `/auth/token/`
```json
// Request
{ "email": "jane@example.com", "password": "secret" }

// Response 200
{
  "access": "<JWT access token>",
  "refresh": "<JWT refresh token>",
  "user": {
    "id": 101,
    "email": "jane@example.com",
    "first_name": "Jane",
    "last_name": "Doe",
    "role": "CANDIDATE"
  }
}
```

### POST `/auth/token/refresh/`
```json
// Request
{ "refresh": "<JWT refresh token>" }

// Response 200
{ "access": "<new JWT access token>" }
```

### POST `/auth/register/`
```json
// Request
{
  "email": "...", "password": "...", "first_name": "...", "last_name": "...",
  "role": "CANDIDATE | RECRUITER"
}

// Response 201
{ "id": 101, "email": "...", "role": "...", "is_active": true }
```

### GET `/auth/me/`
Returns authenticated user profile.

### POST `/auth/logout/`
```json
{ "refresh": "<refresh token>" }
```

---

## Candidate Profile

### GET `/candidate/profile/`
Returns the authenticated candidate's profile including parsed resume data.

```json
{
  "id": 501,
  "headline": "Senior Full-Stack Python & React Engineer",
  "bio": "...",
  "location": "San Francisco, CA",
  "phone": "+1 (555) 234-5678",
  "resume_file": "Jane_Doe_Resume_2026.pdf",
  "resume_uploaded_at": "2026-08-28T14:30:00Z",
  "parsed_skills": ["Python", "Django", "React", "PostgreSQL", "Docker"],
  "parsed_education": [
    {
      "degree": "B.S. in Computer Science",
      "institution": "UC Berkeley",
      "year": "2019 - 2023",
      "grade": "3.8 GPA"
    }
  ],
  "parsed_experience": [
    {
      "title": "Full-Stack Developer",
      "company": "Nexus Software Labs",
      "duration": "2023 - Present",
      "description": "..."
    }
  ]
}
```

### PATCH `/candidate/profile/`
Partial update: `{ parsed_skills: [...] }`, etc.

### POST `/candidate/resume/`
Multipart form upload: `resume` (file, PDF/DOCX).  
Returns updated profile fields after extraction.

```json
{
  "resume_file": "filename.pdf",
  "resume_uploaded_at": "...",
  "parsed_skills": [...],
  "parsed_education": [...],
  "parsed_experience": [...]
}
```

---

## Jobs

### GET `/jobs/`
Query params: `search`, `location`, `job_type`, `status`, `page`, `page_size`

```json
{
  "count": 27,
  "next": "/api/v1/jobs/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "title": "Senior Full-Stack Python & React Engineer",
      "company_name": "TechPulse AI",
      "company_id": 1,
      "recruiter_id": 201,
      "location": "San Francisco, CA (Hybrid)",
      "job_type": "FULL_TIME",
      "experience_min_years": 4,
      "required_skills": ["Python", "Django", "React"],
      "preferred_skills": ["Kubernetes", "Redis"],
      "description": "...",
      "status": "OPEN",
      "applicants_count": 18,
      "created_at": "2026-08-15T10:00:00Z",
      "posted_at": "2026-08-15"
    }
  ]
}
```

### GET `/jobs/{id}/`
Returns a single job object (same shape as list item).

### POST `/jobs/` *(Recruiter only)*
Create job posting.

### PATCH `/jobs/{id}/` *(Recruiter only)*
Update job posting.

---

## Applications

### GET `/applications/`
Query params: `candidate_id`, `job_id`, `status`, `page`

Returns paginated application list. Each application includes:
```json
{
  "id": 101,
  "job_id": 1,
  "job_title": "...",
  "company_name": "...",
  "company_location": "...",
  "candidate_id": 101,
  "candidate_name": "...",
  "candidate_email": "...",
  "candidate_headline": "...",
  "candidate_experience_years": 3.5,
  "status": "INTERVIEW_SCHEDULED",
  "applied_at": "2026-08-25T14:20:00Z",
  "updated_at": "...",
  "match_score": 91.5,
  "resume_snapshot": {
    "headline": "...",
    "skills": [...],
    "education": [{ "degree": "...", "institution": "...", "year": "..." }],
    "experience": [{ "title": "...", "company": "...", "duration": "...", "description": "..." }]
  },
  "timeline": [
    { "step": "APPLIED", "title": "Application Submitted", "date": "2026-08-25T14:20:00Z", "done": true }
  ],
  "ai_analysis": { /* see AI Analysis */ },
  "interview_id": 1
}
```

### POST `/applications/`
Submit a new application.
```json
{ "job_id": 1 }
```

### GET `/applications/{id}/`
Returns single application.

### PATCH `/applications/{id}/status/` *(Recruiter only)*
```json
{ "status": "SHORTLISTED" }
```

### PATCH `/candidate/applications/{id}/withdraw/` *(Candidate only)*
Candidate withdraws their application.

---

## Interviews

### GET `/interviews/`
Query params: `candidate_id`, `job_id`, `status`

```json
[
  {
    "id": 1,
    "application_id": 101,
    "job_id": 1,
    "job_title": "...",
    "company_name": "...",
    "candidate_id": 101,
    "candidate_name": "Jane Doe",
    "candidate_email": "...",
    "interviewer_name": "Alex Vance",
    "scheduled_time": "2026-09-10T15:00:00Z",
    "scheduled_date": "Sep 10, 2026",
    "scheduled_time_display": "3:00 PM",
    "duration_minutes": 60,
    "interview_type": "TECHNICAL",
    "interview_type_label": "Technical Interview",
    "meeting_link": "https://meet.google.com/...",
    "status": "SCHEDULED",
    "feedback": "",
    "preparation_notes": "..."
  }
]
```

### POST `/interviews/`
Schedule an interview. *(Recruiter only)*

### PATCH `/interviews/{id}/`
Update interview (add feedback, change status).

---

## AI Analysis

### GET `/ai/analysis/application/{application_id}/`
Candidate-facing AI match analysis for their application.

### GET `/ai/analysis/recruiter/{application_id}/`
Recruiter-facing AI match analysis (same data, may include additional fields).

Both return:
```json
{
  "id": 1,
  "overall_match_score": 91.5,
  "semantic_similarity_score": 93.0,
  "skill_match_score": 91.0,
  "experience_match_score": 85.0,
  "matched_skills": ["Python", "Django", "React", "PostgreSQL"],
  "missing_skills": ["Kubernetes", "Sentence Transformers"],
  "experience_match_summary": "Candidate has 3+ years experience...",
  "explanation": {
    "summary": "Strong alignment across core requirements.",
    "semantic_summary": "High vector similarity.",
    "strengths": ["Django ORM proficiency", "React state management"],
    "recommendations": ["Verify Kubernetes familiarity."]
  },
  "model_name": "all-MiniLM-L6-v2",
  "evaluated_at": "2026-08-25T14:20:00Z",
  "is_pending": false
}
```

---

## Admin Endpoints

### GET `/admin/users/`
Query: `role`, `search`, `is_active`

### PATCH `/admin/users/{id}/`
Toggle `is_active`, etc.

### GET `/admin/companies/`
All companies with verification status.

### PATCH `/admin/companies/{id}/`
Toggle `is_verified`.

### GET `/admin/jobs/`
All jobs across platform.

### GET `/admin/applications/`
All applications platform-wide.

### GET `/admin/analytics/`
```json
{
  "platform_overview": {
    "total_users": 142,
    "total_candidates": 118,
    "total_recruiters": 21,
    "total_companies": 16,
    "total_jobs": 38,
    "open_jobs": 27,
    "total_applications": 312,
    "total_interviews": 47,
    "average_match_score": 78.4
  },
  "applications_by_status": [
    { "status": "APPLIED", "label": "Applied", "count": 98, "pct": 31.4 }
  ],
  "hiring_funnel": [
    { "stage": "Applications Submitted", "count": 312, "conversion": "100%" }
  ],
  "top_demanded_skills": [
    { "name": "Python", "count": 28, "category": "Backend" }
  ],
  "monthly_growth": [
    { "month": "Aug 2026", "applications": 312, "jobs": 38, "users": 142 }
  ]
}
```

---

## HTTP Status Codes

| Code | Meaning |
|---|---|
| 200 | Success |
| 201 | Created |
| 400 | Validation error (field errors in body) |
| 401 | Authentication required |
| 403 | Permission denied (role mismatch) |
| 404 | Resource not found |
| 429 | Rate limited |
| 500 | Server error |

---

## Authentication Headers

All authenticated requests include:
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

Refresh on 401 via POST `/auth/token/refresh/` — handled automatically by `src/services/api.js` interceptors.
