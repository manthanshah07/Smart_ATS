# SmartATS — AI-Powered Applicant Tracking System

SmartATS is a full-stack, AI-powered Applicant Tracking System (ATS) designed to streamline the modern recruitment lifecycle for **Candidates**, **Recruiters**, and **Admins**. Its core differentiator is an explainable resume-to-job matching engine built using Natural Language Processing and Semantic Embeddings.

---

## Architecture Overview

* **Frontend:** React 18, Vite, TailwindCSS, shadcn/ui, TanStack Query, React Router, Axios
* **Backend:** Python 3.12, Django 5.x, Django REST Framework, SimpleJWT
* **Database:** PostgreSQL (Neon-ready)
* **AI Engine:** Sentence Transformers (`all-MiniLM-L6-v2`), spaCy (`en_core_web_sm`), scikit-learn
* **Deployment Targets:** Vercel (Frontend), Render (Backend), Neon (Database)

---

## Directory Layout

```
Smart_ATS/
├── frontend/             # React + Vite client
├── backend/              # Django + DRF backend API service
│   ├── apps/             # Decoupled Django apps
│   │   ├── accounts/     # User, Candidate, Recruiter models, Auth, RBAC
│   │   ├── companies/    # Company profiles & verification
│   │   ├── jobs/         # Job postings & search
│   │   ├── applications/ # Application tracking & state machine
│   │   ├── interviews/   # Interview scheduling
│   │   ├── notifications/# In-app notifications
│   │   ├── analytics/    # Platform analytics & metrics
│   │   └── ai_engine/    # Resume parsing & explainable matching
│   └── smart_ats/        # Core Django settings & routing
├── docs/                 # Architectural specifications & API contracts
│   ├── architecture.md
│   ├── database.md
│   ├── api-contract.md
│   ├── requirements-traceability.md
│   └── development-phases.md
├── .gitignore
└── README.md
```

---

## Quickstart (Development Setup)

### 1. Prerequisites
- Python 3.10+
- Node.js 18+ and npm
- PostgreSQL (Local or Neon Cloud)

### 2. Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Configure DATABASE_URL and SECRET_KEY in .env
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```

### 3. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

---

## Documentation
- [System Architecture](docs/architecture.md)
- [Database Schema & ER Model](docs/database.md)
- [API Contracts](docs/api-contract.md)
- [Requirements Traceability Matrix (FR-1 – FR-24)](docs/requirements-traceability.md)
- [Development Phases](docs/development-phases.md)
