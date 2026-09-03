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
| - pdfplumber / python-docx            | | - PostgreSQL (Neon-ready)   |
| - spaCy (NER & Skill Extraction)      | | - Relational Schema         |
| - Sentence Transformers (MiniLM)      | | - Media Storage             |
| - scikit-learn (Cosine Sim / Overlap) | |                             |
+---------------------------------------+ +-----------------------------+
```

---

## 2. Frontend Architecture
* **Core Technologies:** React 18, Vite, TailwindCSS, `shadcn/ui` (accessible Radix UI component library).
* **State Management:**
  * **Server / Cache State:** TanStack Query (`@tanstack/react-query`) for API fetching, caching, invalidation, and optimistic updates.
  * **Client / Session State:** React Context API (`AuthContext`) for authentication state, user identity, and active role.
  * **HTTP Client:** Axios instance configured with base URL, request interceptors (attaching `Authorization: Bearer <token>`), and response interceptors (handling 401 token refresh).
  * **Routing:** `react-router-dom` with role-based protected route wrappers (`ProtectedRoute`, `RoleGuard`).

---

## 3. Backend Architecture
* **Framework:** Python (Django 5.x + Django REST Framework).
* **App Modularization:**
  * `accounts`: Custom email-based User model, Candidate profile, Recruiter profile, JWT auth, RBAC permissions.
  * `companies`: Company profiles and verification.
  * `jobs`: Job postings, search/filters, status management (`DRAFT`, `OPEN`, `PAUSED`, `CLOSED`).
  * `applications`: Application submission, state machine transitions, historical resume snapshot.
  * `interviews`: Interview scheduling, type selection, and status updates.
  * `notifications`: In-app notification queue and read receipts.
  * `analytics`: Platform-wide aggregation and metrics for Admins.
  * `ai_engine`: Text parsing, entity/skill extraction, embeddings, and explainable scoring.
* **Security & Hardening:**
  * Strict CORS policies.
  * Role-Based Access Control (RBAC) at the DRF view level (`IsCandidate`, `IsRecruiter`, `IsAdmin`).
  * Object-level ownership validation (`IsApplicationOwner`, `IsJobPoster`).
  * Parameterized SQL queries via Django ORM preventing SQL injection.

---

## 4. Database Architecture
* **Engine:** PostgreSQL.
* **Schema Highlights:**
  * Email-based User identity with 1:1 extensions for `Candidate` and `Recruiter`.
  * `JSONField` for structured skill tags, education records, and explainable AI breakdown.
  * Explicit constraints prohibiting duplicate active job applications (`unique_together = ['job', 'candidate']`).
  * Strategic indexes on high-frequency lookup fields (`email`, `role`, `status`, `job_id`, `candidate_id`, `is_read`).

---

## 5. AI Matching & Explainability Architecture
* **Offline Open-Source AI Stack:** No proprietary paid APIs.
* **Pipeline:**
  1. **Validation & Extraction:** `pdfplumber` / `python-docx` extracts raw text.
  2. **NLP Extraction:** `spaCy` identifies skills, degrees, and years of experience.
  3. **Vector Embeddings:** `sentence-transformers` (`all-MiniLM-L6-v2`) encodes resume and job description into 384-dimensional dense vectors.
  4. **Cosine Similarity & Skill Overlap:**
     * Semantic Similarity (60% weight)
     * Skill Match / Overlap (30% weight)
     * Experience Alignment (10% weight)
  5. **Explainability:** Returns exact lists of `matched_skills`, `missing_skills`, and a composite match percentage (0–100%).

---

## 6. Authentication & Session Architecture
* **Standard:** JSON Web Tokens (`djangorestframework-simplejwt`).
* **Flow:**
  * Access Token: 30 minutes lifetime.
  * Refresh Token: 7 days lifetime with automatic token rotation and blacklist on logout.
  * Header: `Authorization: Bearer <access_token>`.
