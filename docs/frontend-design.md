# SmartATS Frontend Design & UI/UX Architecture Specification

---

## 1. Design Philosophy

SmartATS is engineered as a clean, enterprise-grade Applicant Tracking System (ATS) where AI is seamlessly embedded as an **explainable, deterministic decision-support tool** rather than an opaque, gimmicky visual element.

### Core Visual Tenets:
* **Restraint & Trust:** Clean slate neutrals, deep enterprise blues (`#2563EB`), high contrast, and disciplined typography.
* **Explainability First:** AI matches are never presented as bare percentages. Every score is dissected into its 3 mathematical constituents:
  * **Semantic Vector Similarity (60% weight)** via Sentence Transformers (`all-MiniLM-L6-v2`)
  * **Skill Taxonomy Overlap (30% weight)** via spaCy entity extraction
  * **Experience Alignment (10% weight)**
* **Deterministic Information Hierarchy:** Dense, actionable data tables and ranking lists that scale gracefully down to mobile cards without endless horizontal overflow.
* **Unified Shell Architecture:** All authenticated portals (Candidate, Recruiter, Admin) share the exact same responsive layout foundation (`AppLayout`, `Sidebar`, `TopBar`, `DemoPersonaBar`).

---

## 2. Color System & Semantic Tokens

| Token | Semantic Purpose | Light Hex / HSL | Dark Hex / HSL | Usage |
| :--- | :--- | :--- | :--- | :--- |
| `background` | Primary surface | `hsl(220 33% 98%)` | `hsl(224 71% 4%)` | App canvas |
| `foreground` | Primary text | `hsl(222 47% 11%)` | `hsl(213 31% 91%)` | Headings, body text |
| `card` | Elevated container | `hsl(0 0% 100%)` | `hsl(224 71% 4%)` | Cards, modals, sidebars |
| `primary` | Brand & focus | `hsl(221 83% 53%)` | `hsl(217 91% 60%)` | CTAs, active nav, primary badges |
| `emerald-600`| Positive / Match | `hsl(142 71% 45%)` | `hsl(142 71% 45%)` | Match &gt; 80%, Shortlisted, Hired |
| `amber-500`  | Attention / Gap | `hsl(38 92% 50%)`  | `hsl(38 92% 50%)`  | Missing skills, Paused, Reviewing |
| `rose-600`   | Negative / Error | `hsl(346 84% 61%)` | `hsl(346 84% 61%)` | Rejected, Closed, Deactivated |

---

## 3. Typography Hierarchy

* **Font Family:** Inter, system-ui, -apple-system, sans-serif
* **Display / Landing Hero:** `text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.1]`
* **Page Titles (H1):** `text-2xl sm:text-3xl font-extrabold tracking-tight`
* **Section Headers (H2/H3):** `text-base sm:text-lg font-bold tracking-tight`
* **Body Text:** `text-xs sm:text-sm text-foreground`
* **Secondary / Captions:** `text-xs text-muted-foreground`
* **Metadata & Micro-Labels:** `text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider`

---

## 4. Reusable UI Components

* [`AIAnalysisCard.jsx`](file:///Users/manthanshah/Documents/Smart_ATS/frontend/src/components/ui/AIAnalysisCard.jsx): Centralized component rendering composite fit score, 60/30/10 constituent progress meters, matched skill tags, missing gap tags, and plain-English evaluation summary.
* [`StatusBadge.jsx`](file:///Users/manthanshah/Documents/Smart_ATS/frontend/src/components/ui/StatusBadge.jsx): Universal status pill for applications, jobs, and interviews with semantic color indicators.
* [`Button.jsx`](file:///Users/manthanshah/Documents/Smart_ATS/frontend/src/components/ui/button.jsx): Default, secondary, outline, ghost, destructive, and link button variants.
* [`Modal.jsx`](file:///Users/manthanshah/Documents/Smart_ATS/frontend/src/components/ui/Modal.jsx): Accessible dialog with backdrop blur, escape listener, scrollable body, and action footer.
* [`Input.jsx`](file:///Users/manthanshah/Documents/Smart_ATS/frontend/src/components/ui/Input.jsx), [`Textarea.jsx`](file:///Users/manthanshah/Documents/Smart_ATS/frontend/src/components/ui/Textarea.jsx), [`Select.jsx`](file:///Users/manthanshah/Documents/Smart_ATS/frontend/src/components/ui/Select.jsx): Form primitives with validation error rings.
* [`Skeleton.jsx`](file:///Users/manthanshah/Documents/Smart_ATS/frontend/src/components/ui/Skeleton.jsx): Pulse skeletons for dashboard cards, tables, and detail screens.
* [`EmptyState.jsx`](file:///Users/manthanshah/Documents/Smart_ATS/frontend/src/components/ui/EmptyState.jsx) & [`ErrorState.jsx`](file:///Users/manthanshah/Documents/Smart_ATS/frontend/src/components/ui/ErrorState.jsx): Intentional zero-state handling with retry and reset triggers.

---

## 5. Complete Route Map

### Public Routes (`RootLayout` & `AuthLayout`)
* `/` &rarr; Landing Page with explainable AI preview, feature breakdown, and pipeline architecture
* `/jobs` &rarr; Public job board with live search, location filters, and role type selectors
* `/jobs/:id` &rarr; Job detail view with requirements, company specs, and interactive "Apply Now" modal
* `/login` &rarr; Authentication with role redirection
* `/register` &rarr; Candidate & Recruiter registration tabs (Admin registration forbidden)
* `/forgot-password` &rarr; Password reset request & confirmation
* `/unauthorized` &rarr; 403 Access Denied view with portal navigation
* `*` &rarr; 404 Not Found view

### Candidate Portal (`AppLayout`)
* `/candidate/dashboard` &rarr; Overview, profile completeness, interview alerts, application stream
* `/candidate/profile` &rarr; Personal details, contact info, headline, bio, location
* `/candidate/resume` &rarr; Drag-and-drop PDF/DOCX uploader, extracted skills tags, education/work timeline
* `/candidate/applications` &rarr; Searchable, filterable submitted application cards/table
* `/candidate/applications/:id` &rarr; Full application milestone stepper + Explainable `AIAnalysisCard`
* `/candidate/interviews` &rarr; Scheduled interviews, meeting links, preparation notes
* `/candidate/notifications` &rarr; Filterable in-app notification center
* `/candidate/settings` &rarr; Notification preferences & password settings

### Recruiter Portal (`AppLayout`)
* `/recruiter/dashboard` &rarr; Hiring pipeline metrics, active jobs, top AI-ranked candidates queue
* `/recruiter/company` &rarr; Organization profile editor, verified employer badge
* `/recruiter/jobs` &rarr; Job postings management table with pause/close/edit controls
* `/recruiter/jobs/new` &rarr; Multi-section job creator with skill tags input
* `/recruiter/jobs/:id/edit` &rarr; Job posting editor
* `/recruiter/jobs/:id/applicants` &rarr; AI Candidate Ranking Table sorted by match score
* `/recruiter/applications/:id` &rarr; Candidate review screen + status actions + Schedule Interview modal
* `/recruiter/interviews` &rarr; Interview management calendar/list
* `/recruiter/notifications` &rarr; Recruiter applicant alerts
* `/recruiter/settings` &rarr; Hiring notification preferences

### Administrator Portal (`AppLayout`)
* `/admin/dashboard` &rarr; Platform SaaS metrics, conversion funnel, stage distributions
* `/admin/users` &rarr; Searchable user directory with deactivation confirmation modal
* `/admin/companies` &rarr; Company directory with verification badge toggles
* `/admin/jobs` &rarr; Global job moderation table
* `/admin/applications` &rarr; System-wide application audit log
* `/admin/analytics` &rarr; Platform growth trends & technical skill demand curves
* `/admin/notifications` &rarr; System health & verification alerts
* `/admin/settings` &rarr; Global AI weights & parameters

---

## 6. Mock Data & Service Layer Architecture

The frontend uses an abstracted service layer (`src/services/`):
* `jobService.js`
* `candidateService.js`
* `applicationService.js`
* `recruiterService.js`
* `interviewService.js`
* `notificationService.js`
* `adminService.js`

All service functions return Promises over the centralized mock repository (`src/mock/`).
When backend integration begins in later phases, API endpoints can be connected directly inside `src/services/` without rewriting or altering any UI pages or components.

---

## 7. Prototype Persona Switcher

The prototype features a sticky top bar (`DemoPersonaBar.jsx`) that allows immediate, 1-click toggling between:
* **Candidate (`Jane Doe`)**
* **Recruiter (`Alex Vance` • TechPulse AI)**
* **Administrator (`Sarah Connor`)**

This enables thorough visual verification of every role-specific flow without requiring repeated logins.
