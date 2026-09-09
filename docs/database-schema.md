# SmartATS Database Schema

## Overview
The SmartATS database uses PostgreSQL and is managed via Django ORM. The core entities represent the recruitment workflow from user registration through application and AI evaluation.

---

## Core Models

### `accounts.User`
Custom email-based authentication model.
* **Fields**: `id`, `email` (unique), `password`, `first_name`, `last_name`, `role` (CANDIDATE, RECRUITER, ADMIN), `is_active`, `is_staff`, `created_at`, `updated_at`.
* **Indexes**: `email`, `role`.

### `accounts.Candidate`
Candidate profile data.
* **Fields**: `id`, `user` (OneToOne to User), `phone`, `headline`, `bio`, `location`, `resume_file`, `raw_resume_text`, `parsed_skills` (JSON), `parsed_education` (JSON), `parsed_experience` (JSON), `resume_uploaded_at`.

### `accounts.Recruiter`
Recruiter profile data.
* **Fields**: `id`, `user` (OneToOne to User), `company` (ForeignKey to Company), `designation`, `is_approved`.

### `companies.Company`
Organizations posting jobs.
* **Fields**: `id`, `name`, `website`, `description`, `industry`, `location`, `logo`, `is_verified`.

### `jobs.Job`
Job postings.
* **Fields**: `id`, `company` (ForeignKey), `recruiter` (ForeignKey), `title`, `description`, `department`, `location`, `job_type`, `experience_min_years`, `required_skills` (JSON), `preferred_skills` (JSON), `status` (DRAFT, OPEN, PAUSED, CLOSED), `created_at`, `updated_at`.
* **Indexes**: `status`, `created_at`, `title`.

### `applications.Application`
Job application submissions.
* **Fields**: `id`, `job` (ForeignKey), `candidate` (ForeignKey), `resume_snapshot` (JSON), `status` (APPLIED, REVIEWING, SHORTLISTED, INTERVIEW_SCHEDULED, REJECTED, HIRED), `applied_at`, `updated_at`.
* **Constraints**: Unique combination of `(job, candidate)`.
* **Indexes**: `(job, status)`, `(candidate, status)`.
* **Logic**: Strict state transition enforcement.

### `applications.AIAnalysis`
AI Match Data for an application.
* **Fields**: `application` (OneToOne), `overall_match_score`, `semantic_similarity_score`, `skill_match_score`, `experience_match_score`, `matched_skills` (JSON), `missing_skills` (JSON), `experience_match_summary`, `explanation` (JSON), `model_name`, `model_version`, `created_at`.
* **Indexes**: `overall_match_score`.

### `interviews.Interview`
Interview schedules.
* **Fields**: `id`, `application` (OneToOne), `scheduled_time`, `duration_minutes`, `interview_type`, `meeting_link_or_location`, `status`, `feedback`.
* **Indexes**: `scheduled_time`, `status`.

### `notifications.Notification`
In-app alerts.
* **Fields**: `id`, `user` (ForeignKey), `title`, `message`, `notification_type`, `link_url`, `is_read`, `created_at`.
* **Indexes**: `(user, is_read)`, `created_at`.

---

## Status Enums

* **Roles**: CANDIDATE, RECRUITER, ADMIN
* **Job Status**: DRAFT, OPEN, PAUSED, CLOSED
* **Application Status**: APPLIED, REVIEWING, SHORTLISTED, INTERVIEW_SCHEDULED, REJECTED, HIRED
* **Interview Status**: SCHEDULED, COMPLETED, CANCELLED, RESCHEDULED
* **Notification Type**: APPLICATION_STATUS, NEW_APPLICATION, INTERVIEW_SCHEDULED, SYSTEM
