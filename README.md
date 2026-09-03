# SmartATS — AI-Powered Applicant Tracking System

SmartATS is a full-stack, AI-powered Applicant Tracking System (ATS) designed to streamline recruitment for **Candidates**, **Recruiters**, and **Admins**. Its core differentiator is an explainable resume-to-job matching engine built using Natural Language Processing and Semantic Embeddings.

---

## Technology Stack

* **Frontend:** React 18, Vite, TailwindCSS, shadcn/ui, TanStack Query, React Router, Axios
* **Backend:** Python 3.12, Django 5.1.x, Django REST Framework, SimpleJWT (with Token Blacklisting)
* **Database:** PostgreSQL 16 (Neon-ready)
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

## Local Development Setup

### 1. Prerequisites
* Python 3.10+ (Python 3.12 recommended)
* Node.js 18+ and npm
* PostgreSQL 14+ (Local or Neon Cloud)

---

### 2. Backend Setup & Database Migration

1. **Navigate to backend and create virtual environment:**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

2. **Configure Environment Variables:**
Create `.env` inside `backend/`:
```ini
SECRET_KEY=django-insecure-your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0
DATABASE_URL=postgres://your_user:your_password@localhost:5432/smartats_db
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
```

3. **Run Migrations on PostgreSQL:**
```bash
python manage.py showmigrations
python manage.py migrate
```

4. **Run Backend Test Suite:**
```bash
python manage.py test apps/accounts apps/applications
```

5. **Start Django API Server:**
```bash
python manage.py runserver
```
The API server will be available at `http://localhost:8000/api/v1/`.

---

### 3. Frontend Setup

1. **Navigate to frontend and install dependencies:**
```bash
cd frontend
npm install
```

2. **Configure Frontend Environment:**
Create `.env` inside `frontend/`:
```ini
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

3. **Verify Build / Start Development Server:**
```bash
npm run build
npm run dev
```
The client will be running at `http://localhost:5173`.

---

## Documentation
* [System Architecture](docs/architecture.md)
* [Database Schema & ER Model](docs/database.md)
* [API Contracts](docs/api-contract.md)
* [Requirements Traceability Matrix (FR-1 – FR-24)](docs/requirements-traceability.md)
* [Development Phases](docs/development-phases.md)
