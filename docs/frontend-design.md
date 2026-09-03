# SmartATS Frontend Design & UI/UX Architecture Specification

---

## 1. Design Philosophy & Prototype Boundary

SmartATS is engineered as an enterprise-grade Applicant Tracking System (ATS) where AI is designed to be an **explainable, deterministic decision-support tool**.

> [!IMPORTANT]
> **Frontend Prototype Disclaimer:**
> This phase establishes the complete visual design, component library, user journeys, and state workflows. All AI match scores, applicant rankings, and analytics metrics in this prototype are **static sample/mock data** located in `src/mock/ai/`. No real-time ML scoring algorithms or live backend inference exist in this phase.

### Core Visual Tenets:
* **Restraint & Trust:** Clean slate neutrals, deep enterprise blues (`#2563EB`), high contrast, and disciplined typography.
* **Explainability First:** In the final architecture, AI matches will never be presented as opaque percentages. Every score is designed around its 3 mathematical constituents:
  * **Semantic Vector Similarity (60% weight)** via Sentence Transformers (`all-MiniLM-L6-v2`)
  * **Skill Taxonomy Overlap (30% weight)** via spaCy entity extraction
  * **Experience Alignment (10% weight)**
* **Deterministic Information Hierarchy:** Dense, actionable data tables and ranking lists that scale gracefully down to mobile cards without horizontal scroll issues.
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

## 4. Reusable UI Components & State Handling

* [`AIAnalysisCard.jsx`](file:///Users/manthanshah/Documents/Smart_ATS/frontend/src/components/ui/AIAnalysisCard.jsx):
  * **State 1 (Pending):** Displays "AI Analysis Pending — Analysis will appear here once your application has been evaluated."
  * **State 2 (Available):** Prominently labeled with "Sample / Demo AI Analysis" badge; renders composite fit score, 60/30/10 constituent progress meters, matched skill tags, missing gap tags, and plain-English evaluation summary.
  * **State 3 (Unavailable):** Displays "AI Analysis Unavailable" with retry action.
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
* `/jobs/:id` &rarr; Job detail view with requirements, company specs, and interactive application confirmation modal
* `/login` &rarr; Authentication with role redirection
* `/register` &rarr; Candidate & Recruiter registration tabs (Admin registration forbidden)
* `/forgot-password` &rarr; Password reset request & confirmation
* `/unauthorized` &rarr; 403 Access Denied view with portal navigation
* `*` &rarr; 404 Not Found view

### Candidate Portal (`AppLayout`)
* `/candidate/dashboard` &rarr; Overview, profile completeness, interview alerts, application stream
* `/candidate/profile` &rarr; Personal details, contact info, headline, bio, location
* `/candidate/resume` &rarr; Drag-and-drop PDF/DOCX uploader, extracted skills tags, education/work timeline
* `/candidate/applications` &rarr; Searchable, filterable submitted application cards/table with pending status handling
* `/candidate/applications/:id` &rarr; Full application milestone stepper + Explainable `AIAnalysisCard`
* `/candidate/interviews` &rarr; Scheduled interviews, meeting links, preparation notes
* `/candidate/notifications` &rarr; Filterable in-app notification center
* `/candidate/settings` &rarr; Notification preferences & password settings

### Recruiter Portal (`AppLayout`)
* `/recruiter/dashboard` &rarr; Hiring pipeline metrics, active jobs, top AI-ranked candidates preview
* `/recruiter/company` &rarr; Organization profile editor, verified employer badge
* `/recruiter/jobs` &rarr; Job postings management table with pause/close/edit controls
* `/recruiter/jobs/new` &rarr; Multi-section job creator with skill tags input
* `/recruiter/jobs/:id/edit` &rarr; Job posting editor
* `/recruiter/jobs/:id/applicants` &rarr; **AI Candidate Ranking Table** with explicit "Sample AI Ranking (Demo)" indicator
* `/recruiter/applications/:id` &rarr; Candidate review screen + status actions + Schedule Interview modal
* `/recruiter/interviews` &rarr; Interview management calendar/list
* `/recruiter/notifications` &rarr; Recruiter applicant alerts
* `/recruiter/settings` &rarr; Hiring notification preferences

### Administrator Portal (`AppLayout`)
* `/admin/dashboard` &rarr; Sample platform SaaS metrics, recruitment funnel, stage distributions
* `/admin/users` &rarr; Searchable user directory with deactivation confirmation modal
* `/admin/companies` &rarr; Company directory with verification badge toggles
* `/admin/jobs` &rarr; Global job moderation table
* `/admin/applications` &rarr; System-wide application audit log
* `/admin/analytics` &rarr; Platform volume curves & technical skill demand curves
* `/admin/notifications` &rarr; System governance alerts
* `/admin/settings` &rarr; Configured AI scoring architecture weights (60/30/10)

---

## 6. Mock Data & Service Layer Architecture

All mock datasets are centralized in `src/mock/`:
* `src/mock/ai/mockAIAnalysis.js`: Reference explainable AI analysis records explicitly tagged as demo datasets.
* `src/mock/users.js`
* `src/mock/companies.js`
* `src/mock/jobs.js`
* `src/mock/applications.js`
* `src/mock/interviews.js`
* `src/mock/notifications.js`
* `src/mock/analytics.js`

All UI views interact exclusively through the abstracted service layer in `src/services/` (`jobService`, `candidateService`, `applicationService`, `recruiterService`, `interviewService`, `notificationService`, `adminService`).

---

## 7. Prototype Persona Switcher & Environment Flag

The `DemoPersonaBar` enables 1-click toggling between **Candidate (`Jane Doe`)**, **Recruiter (`Alex Vance`)**, and **Administrator (`Sarah Connor`)** during prototype testing.

### Environment Control:
* `VITE_DEMO_MODE=true` (or unset in dev): Renders the persona switcher bar with a dismiss button.
* `VITE_DEMO_MODE=false`: Completely hides the bar for standard production rendering.
