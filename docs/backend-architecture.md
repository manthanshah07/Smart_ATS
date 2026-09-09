# SmartATS Backend Architecture

## System Layers

```text
Django
   ↓
Django REST Framework (DRF)
   ↓
API Views & ViewSets (apps/*/views.py)
   ↓
Serializers (apps/*/serializers.py)
   ↓
Permissions & Authorization (apps/*/permissions.py)
   ↓
Services / Business Logic (apps/ai_engine/services.py)
   ↓
Models (apps/*/models.py)
   ↓
PostgreSQL
```

## Application Structure
The backend is highly modular, split into specific domain boundaries within the `apps/` directory:
- `accounts`: Custom User model, Candidate/Recruiter profiles, auth views, permissions.
- `companies`: Company profiles and validation.
- `jobs`: Job posting models and recruiter access control.
- `applications`: Application submission, state transitions, and snapshotting.
- `interviews`: Interview scheduling tied to applications.
- `notifications`: User alert system.
- `analytics`: Platform and user-specific aggregated data.
- `ai_engine`: Explainable AI evaluation logic.

## AI Services Layer
Future AI services (Sentence Transformers, spaCy NLP extraction) will live inside `apps/ai_engine/`. 
The `AIAnalysis` model acts as the data bridge between the `applications` app and the `ai_engine`, storing the static JSON representations of model explanations and embeddings. Background tasks (e.g. Celery) will process uploaded resumes, perform inferences, and update the `AIAnalysis` table asynchronously without blocking API responses.

## Authorization
Role-Based Access Control (RBAC) is implemented via Django REST Framework permission classes (e.g., `IsCandidate`, `IsRecruiter`, `IsOwnerOrReadOnly`).
Token-based auth is handled by `rest_framework_simplejwt`, ensuring stateless backend scaling.
