# Development Phases & Roadmap

This project follows an incremental development lifecycle across 11 controlled phases (Phase 0 – Phase 10).

---

## Phase Summary

* **Phase 0: Project Preparation & Repository Scaffolding**
  * Repository initialization, directory layout, baseline `.gitignore`, environment files.
* **Phase 1: Architecture, Database & API Contract Implementation (Current)**
  * Django project setup, custom email-based User model, core entities, database constraints & indexes, serializer schemas, API URL routing scaffolding, Vite/React foundation, documentation.
* **Phase 2: Authentication & Role-Based Access Control (RBAC)**
  * SimpleJWT configuration, registration, token refresh, password reset endpoints, frontend `AuthContext`, login/register pages, route guards.
* **Phase 3: Candidate Module**
  * Candidate profile management, resume upload handling (PDF/DOCX), job search, filter, and public details UI.
* **Phase 4: Recruiter Module**
  * Company profile creation/updates, job creation, editing, closing, job listing management UI.
* **Phase 5: Explainable AI Engine Integration**
  * Resume text extraction (`pdfplumber`/`python-docx`), spaCy skill & entity extraction, Sentence Transformers vector embeddings, scikit-learn cosine similarity calculation, explainability payload generation.
* **Phase 6: Application, Interview & Notification Workflow**
  * Job application submission with auto-eval, recruiter applicant ranking table, shortlist/reject status machine transitions, interview scheduling modal, in-app notification system.
* **Phase 7: Admin Module & Platform Analytics**
  * Admin user management/deactivation, company & job moderation, aggregation metrics dashboard.
* **Phase 8: Testing, Security & Optimization**
  * Backend API unit & integration tests, frontend testing, permission testing, response latency profiling (< 3s AI execution target).
* **Phase 9: Production Deployment Configuration**
  * Render configuration for DRF backend, Neon PostgreSQL connection, Vercel frontend deployment build verification.
* **Phase 10: Demo & Viva Hardening**
  * Realistic seed data (mock job postings, verified resumes), edge case hardening, viva defense documentation.
