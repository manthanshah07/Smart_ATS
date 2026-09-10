# SmartATS — Phase 6A Render Deployment Guide

**Date:** 2026-09-10  
**Target:** Render Web Service (Python/Django)  
**Database:** Neon (PostgreSQL)  
**Frontend:** Vercel (separate — Phase 6B)

---

## Architecture

```
Internet
  │
  ├─ Vercel (React frontend)
  │      └─ calls → Render backend API
  │
  └─ Render Web Service (Django + Gunicorn)
         └─ connects → Neon (PostgreSQL)
```

---

## Step 1 — Prerequisites

Before deploying, you must have:

- [ ] Render account at https://render.com
- [ ] Neon account at https://neon.tech
- [ ] SmartATS repository pushed to GitHub/GitLab

---

## Step 2 — Neon Database Setup

1. Log in to https://neon.tech
2. Create a new project: `smartats`
3. Create a database: `smartats_db`
4. Copy the connection string from **Connection Details → Pooled Connection (PgBouncer)**
5. It will look like:
   ```
   postgresql://USER:PASSWORD@ep-xxx.us-east-1.aws.neon.tech/smartats_db?sslmode=require
   ```
6. Save this — it is your `DATABASE_URL`

---

## Step 3 — Generate Production Secret Key

Run locally:
```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

Save the output — it is your `SECRET_KEY`.

---

## Step 4 — Create Render Web Service

### Option A: Automatic via render.yaml (recommended)

1. Go to https://dashboard.render.com → New → Blueprint
2. Connect your GitHub repository
3. Render will detect `backend/render.yaml` automatically
4. Review the proposed service and click **Apply**
5. Then set the env vars manually that have `sync: false` (see Step 5)

### Option B: Manual via Render Dashboard

1. Go to https://dashboard.render.com → New → Web Service
2. Connect your repository
3. Configure:

| Field | Value |
|---|---|
| **Name** | `smartats-api` |
| **Root Directory** | `backend` |
| **Runtime** | Python 3 |
| **Build Command** | `pip install -r requirements.txt && python -m spacy download en_core_web_sm && python manage.py collectstatic --noinput && python manage.py migrate` |
| **Start Command** | `gunicorn smart_ats.wsgi:application --bind 0.0.0.0:$PORT --workers 2 --timeout 120` |
| **Health Check Path** | `/api/v1/health/` |
| **Instance Type** | Starter (512 MB RAM minimum due to sentence-transformers) |

---

## Step 5 — Required Environment Variables

Set these in Render Dashboard → Your Service → **Environment**:

| Variable | Value |
|---|---|
| `DJANGO_SETTINGS_MODULE` | `smart_ats.settings` |
| `DEBUG` | `False` |
| `SECRET_KEY` | *(generated in Step 3)* |
| `DATABASE_URL` | *(Neon connection string from Step 2)* |
| `ALLOWED_HOSTS` | `smartats-api.onrender.com` *(your Render subdomain)* |
| `CORS_ALLOWED_ORIGINS` | `https://smartats.vercel.app` *(your Vercel frontend URL)* |
| `EMAIL_BACKEND` | `django.core.mail.backends.console.EmailBackend` |
| `DEFAULT_FROM_EMAIL` | `noreply@smartats.io` |

> **IMPORTANT:** Never put real credentials in `render.yaml` or commit them to Git.
> All sensitive values must be set in the Render dashboard.

---

## Step 6 — Verify the Deployment

After Render finishes building and starting:

1. **Health check:**
   ```bash
   curl https://smartats-api.onrender.com/api/v1/health/
   # Expected: {"status": "ok"}
   ```

2. **Unauthenticated endpoint:**
   ```bash
   curl https://smartats-api.onrender.com/api/v1/candidate/profile/
   # Expected: {"detail": "Authentication credentials were not provided."}
   ```

3. **Registration:**
   ```bash
   curl -X POST https://smartats-api.onrender.com/api/v1/auth/register/ \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","first_name":"Test","last_name":"User","password":"SecurePass123!","password_confirm":"SecurePass123!","role":"CANDIDATE"}'
   # Expected: 201 Created
   ```

---

## Step 7 — Configure Vercel Frontend

After the Render service is running:

1. Go to your Vercel project → Settings → Environment Variables
2. Set for **Production**:
   ```
   VITE_API_BASE_URL = https://smartats-api.onrender.com/api/v1
   VITE_DEMO_MODE = false
   ```
3. Redeploy the Vercel frontend (Dashboard → Deployments → Redeploy)

---

## Known Limitations and Production Considerations

### Memory
`sentence-transformers` loads a 90MB model into memory on first request. The Render Starter instance (512MB RAM) may be tight. If you encounter OOM errors:
- Upgrade to a Standard instance (2GB RAM)
- Or pre-warm the model in a startup hook

### Cold Starts
Render Free tier spins down after 15 minutes of inactivity. The first request after spin-down will take ~30-40 seconds (model loading + Django startup). Upgrade to a paid instance to avoid this.

### Resume File Storage (**CRITICAL**)
Uploaded resume files are stored on Render's **ephemeral local disk**. Files are lost on every deploy or restart. The AI analysis (text + scores) survives in Neon, but the resume download link will break.

**Phase 6B action required:** Add `django-storages` + AWS S3 or Cloudinary for persistent resume file storage.

### spaCy Model
`en_core_web_sm` is downloaded during the build step. If the build times out (unlikely but possible on slow connections), retry the build.

---

## build.sh (Optional Helper Script)

You may optionally add a `backend/build.sh` to centralize the build:

```bash
#!/bin/bash
set -e
pip install -r requirements.txt
python -m spacy download en_core_web_sm
python manage.py collectstatic --noinput
python manage.py migrate
```

Then set Render's Build Command to: `chmod +x build.sh && ./build.sh`
