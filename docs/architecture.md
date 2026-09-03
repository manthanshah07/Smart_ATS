# System Architecture Specification

## 1. Overview
SmartATS is an enterprise-grade Applicant Tracking System built to connect Candidates, Recruiters, and Admins through a single interface powered by an explainable, deterministic AI matching pipeline.

```
+-----------------------------------------------------------------------+
|                             CLIENT TIER                               |
|        React 18 + Vite + TailwindCSS + shadcn/ui + TanStack Query     |
+-----------------------------------+-----------------------------------+
                                    | HTTPS / REST (JWT Auth)
+-----------------------------------v-----------------------------------+
|                           APPLICATION TIER                            |
|             Django 5.x + Django REST Framework + SimpleJWT            |
|                                                                       |
|  [accounts] [companies] [jobs] [applications] [interviews] [notifs]   |
+-------------------+-----------------------------------+---------------+
                    |                                   |
+-------------------v-------------------+ +-------------v---------------+
|               AI ENGINE               | |      PERSISTENCE TIER       |
| - pdfplumber / python-docx            | | - PostgreSQL 16 (Neon/Local)|
| - spaCy (NER & Skill Extraction)      | | - Relational Schema         |
| - Sentence Transformers (MiniLM)      | | - Token Blacklist Tables    |
| - scikit-learn (Cosine Sim / Overlap) | | - Media Storage             |
+---------------------------------------+ +-----------------------------+
```

---

## 2. Authentication & Authorization Architecture (Phase 2 Implemented)

### 2.1 Identity & User Management
* **Email-Based Custom User Model:** `accounts.User` inherits from `AbstractBaseUser` + `PermissionsMixin` with email as unique identifier (`USERNAME_FIELD = 'email'`).
* **Roles:** `CANDIDATE`, `RECRUITER`, `ADMIN`.
* **Atomic Profile Creation:** Registration wraps `User` creation and 1:1 profile extension (`Candidate` or `Recruiter`) in a single database transaction (`transaction.atomic`). Public registration as `ADMIN` is strictly forbidden.
* **Account Deactivation:** Soft deactivation via `is_active=False`. Inactive users cannot authenticate or obtain JWT tokens.

### 2.2 JWT Architecture & Lifecycle
* **Package:** `djangorestframework-simplejwt` + `rest_framework_simplejwt.token_blacklist`.
* **Token Specifications:**
  * **Access Token:** 30 minutes lifetime, signed via HS256 with server `SECRET_KEY`.
  * **Refresh Token:** 7 days lifetime with automatic token rotation (`ROTATE_REFRESH_TOKENS = True`) and blacklisting (`BLACKLIST_AFTER_ROTATION = True`).
* **Logout & Invalidation:** Dedicated `POST /api/v1/auth/logout/` endpoint adds the submitted refresh token to the database blacklist table (`token_blacklist`), preventing subsequent token refreshes.
* **Axios Interceptor Queue:** Client-side Axios interceptor queues concurrent requests during token refresh to eliminate race conditions and avoid infinite loops.

### 2.3 Role-Based & Object-Level Access Control
* **Backend Permission Classes:**
  * `IsCandidate`: Restricts endpoints strictly to candidates.
  * `IsRecruiter`: Restricts endpoints strictly to recruiters.
  * `IsAdmin`: Restricts endpoints to admin/staff users.
  * `IsApplicationOwner`: Verifies candidate owns the specific application object.
  * `IsJobPoster`: Verifies recruiter owns the specific job posting object.
* **Frontend Route Guards:** `ProtectedRoute` component ensures unauthorized users are redirected to their role-appropriate dashboard or `/login`.

---

## 3. Frontend Architecture
* **Core Technologies:** React 18, Vite, TailwindCSS, `shadcn/ui` primitives.
* **State Management:**
  * **Server State:** TanStack Query (`@tanstack/react-query`) for cached queries and mutation lifecycles.
  * **Auth / Client State:** React Context API (`AuthContext`) providing centralized user profile, role helpers (`isCandidate`, `isRecruiter`, `isAdmin`), login, register, and logout.
  * **HTTP Client:** Axios instance with automated Bearer header injection and 401 token refresh queue.
  * **Routing:** `react-router-dom` with role-guarded routes.

---

## 4. Backend Architecture
* **Framework:** Python (Django 5.1.x + Django REST Framework).
* **Modular Apps:** `accounts`, `companies`, `jobs`, `applications`, `interviews`, `notifications`, `analytics`, `ai_engine`.
* **Security Hardening:**
  * Strict CORS policies.
  * Django password validation validators enforced.
  * Database transaction locks.
  * Passwords never returned in API serializers.

---

## 5. Persistence Architecture
* **Database Engine:** PostgreSQL 16 (Neon-ready).
* **Schema Highlights:**
  * Relational tables with foreign key constraints (`CASCADE`, `PROTECT`, `SET_NULL`).
  * `JSONField` for structured skill tags, education records, and AI match breakdowns.
  * State transition validation and unique application constraints.
