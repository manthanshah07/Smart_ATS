# API Contract Specification (v1)

**Base URL:** `/api/v1/`  
**Authentication Scheme:** `Authorization: Bearer <JWT_ACCESS_TOKEN>`

---

## 1. Authentication & Identity (`/api/v1/auth/`)

### 1.1 Register User (Candidate / Recruiter)
* **Endpoint:** `POST /api/v1/auth/register/`
* **Access:** Public
* **Request Body:**
```json
{
  "email": "candidate@example.com",
  "first_name": "Jane",
  "last_name": "Doe",
  "password": "SecurePassword123!",
  "password_confirm": "SecurePassword123!",
  "role": "CANDIDATE" // "CANDIDATE" | "RECRUITER" (ADMIN registration rejected)
}
```
* **Response (201 Created):**
```json
{
  "id": 1,
  "email": "candidate@example.com",
  "first_name": "Jane",
  "last_name": "Doe",
  "role": "CANDIDATE",
  "is_active": true,
  "created_at": "2026-09-03T14:00:00Z"
}
```
* **Errors:**
  * `400 Bad Request` — Duplicate email, password mismatch, password strength failure, or attempt to register as `ADMIN`.

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
* **Errors:**
  * `401 Unauthorized` — Invalid credentials or account is deactivated (`is_active=False`).

---

### 1.3 Refresh JWT Access Token
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
* **Errors:**
  * `401 Unauthorized` — Invalid, blacklisted, or expired refresh token.

---

### 1.4 Get Current User Profile (`/api/v1/auth/me/`)
* **Endpoint:** `GET /api/v1/auth/me/`
* **Access:** Authenticated (`IsAuthenticated`)
* **Response (200 OK - Candidate Example):**
```json
{
  "id": 1,
  "email": "candidate@example.com",
  "first_name": "Jane",
  "last_name": "Doe",
  "role": "CANDIDATE",
  "is_active": true,
  "created_at": "2026-09-03T14:00:00Z",
  "profile": {
    "id": 1,
    "phone": "+1234567890",
    "headline": "Senior Full-Stack Engineer",
    "bio": "5 years building Django & React systems.",
    "location": "San Francisco, CA",
    "resume_file": null,
    "raw_resume_text": "",
    "parsed_skills": [],
    "parsed_education": [],
    "parsed_experience": [],
    "resume_uploaded_at": null,
    "created_at": "2026-09-03T14:00:00Z",
    "updated_at": "2026-09-03T14:00:00Z"
  }
}
```
* **Errors:** `401 Unauthorized` if unauthenticated.

---

### 1.5 Invalidate Token (Logout)
* **Endpoint:** `POST /api/v1/auth/logout/`
* **Access:** Authenticated (`IsAuthenticated`)
* **Request Body:**
```json
{
  "refresh": "<JWT_REFRESH_TOKEN>"
}
```
* **Response (200 OK):**
```json
{
  "message": "Successfully logged out. Refresh token has been blacklisted."
}
```
* **Errors:** `400 Bad Request` if token is invalid or already blacklisted.

---

### 1.6 Request Password Reset
* **Endpoint:** `POST /api/v1/auth/password-reset/`
* **Access:** Public
* **Request Body:**
```json
{
  "email": "candidate@example.com"
}
```
* **Response (200 OK):**
```json
{
  "message": "If an active account with this email exists, password reset instructions have been sent."
}
```

---

### 1.7 Confirm Password Reset
* **Endpoint:** `POST /api/v1/auth/password-reset/confirm/`
* **Access:** Public
* **Request Body:**
```json
{
  "uid": "<BASE64_USER_ID>",
  "token": "<SECURE_RESET_TOKEN>",
  "new_password": "NewStrongPassword123!",
  "new_password_confirm": "NewStrongPassword123!"
}
```
* **Response (200 OK):**
```json
{
  "message": "Password has been successfully updated. You may now log in with your new password."
}
```
* **Errors:** `400 Bad Request` if token is invalid, expired, or passwords mismatch.

---

## 2. Candidate Endpoints (`/api/v1/candidate/`)

### 2.1 Get / Update Candidate Profile
* **Endpoint:** `GET /api/v1/candidate/profile/`, `PUT/PATCH /api/v1/candidate/profile/`
* **Access:** Authenticated (`CANDIDATE`)
* **Errors:** `403 Forbidden` for Recruiters/unauthorized users.

---

## 3. Recruiter Endpoints (`/api/v1/recruiter/`)

### 3.1 Company Profile Management
* **Endpoint:** `GET/PUT/PATCH /api/v1/recruiter/company/`
* **Access:** Authenticated (`RECRUITER`)
* **Errors:** `403 Forbidden` for Candidates.

---

## 4. Job Endpoints (`/api/v1/jobs/`)

### 4.1 Browse & Search Jobs
* **Endpoint:** `GET /api/v1/jobs/`
* **Access:** Public / Authenticated

### 4.2 Create Job
* **Endpoint:** `POST /api/v1/jobs/`
* **Access:** Authenticated (`RECRUITER`)

### 4.3 Update / Close Job (Object-Level Protected)
* **Endpoint:** `PUT/PATCH /api/v1/jobs/{id}/`
* **Access:** Authenticated (`RECRUITER` who owns the job, or `ADMIN`)
* **Errors:** `403 Forbidden` if another recruiter attempts to modify this job.

---

## 5. Application Endpoints (`/api/v1/applications/`)

### 5.1 Submit Job Application
* **Endpoint:** `POST /api/v1/applications/`
* **Access:** Authenticated (`CANDIDATE`)

### 5.2 View Ranked Applicants
* **Endpoint:** `GET /api/v1/jobs/{job_id}/applicants/`
* **Access:** Authenticated (`RECRUITER` managing the job, or `ADMIN`)

### 5.3 Update Status (Shortlist / Reject)
* **Endpoint:** `PATCH /api/v1/applications/{id}/status/`
* **Access:** Authenticated (`RECRUITER` managing the job, or `ADMIN`)

---

## 6. Admin Endpoints (`/api/v1/admin/`)

### 6.1 List / Deactivate Users
* **Endpoint:** `GET /api/v1/admin/users/`, `PATCH /api/v1/admin/users/{id}/`
* **Access:** Authenticated (`ADMIN`)

### 6.2 Platform Analytics
* **Endpoint:** `GET /api/v1/admin/analytics/`
* **Access:** Authenticated (`ADMIN`)
