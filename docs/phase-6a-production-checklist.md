# SmartATS — Phase 6A Production Checklist

**Date:** 2026-09-10

---

## VERIFIED LOCALLY

> Items actually executed and tested during Phase 6A implementation.

- [x] **Backend tests:** 53/53 pass (`apps.accounts.test_auth` + `apps.accounts.test_production` + `apps.applications.test_applications` + `apps.ai_engine.tests`)
- [x] **AI tests:** 9/9 pass (`apps.ai_engine.tests`)
- [x] **Migration integrity:** `manage.py makemigrations --check` → No changes detected
- [x] **Django system check:** `manage.py check` → 0 issues
- [x] **collectstatic:** 163 files collected without errors
- [x] **Health endpoint:** `GET /api/v1/health/` → `{"status": "ok"}` — unauthenticated, no secrets exposed
- [x] **WhiteNoise installed and configured** in `MIDDLEWARE` and `STORAGES`
- [x] **Gunicorn installed** (`26.2.0`)
- [x] **`requirements.txt` updated** with `gunicorn` and `whitenoise`
- [x] **`render.yaml` created** with correct build/start commands
- [x] **`.env` NOT committed** (verified gitignore rule active)
- [x] **`.env.example` updated** with all required variables and documentation
- [x] **Production security flags** added to `settings.py` (conditional on `DEBUG=False`)
  - `SECURE_PROXY_SSL_HEADER` — trusts Render's TLS proxy
  - `SESSION_COOKIE_SECURE`, `CSRF_COOKIE_SECURE`
  - `SECURE_HSTS_SECONDS = 31536000`
  - `SECURE_CONTENT_TYPE_NOSNIFF`, `X_FRAME_OPTIONS`
- [x] **`SECRET_KEY` validation** — raises `ValueError` if missing or insecure in production
- [x] **`DEBUG` defaults to `True`** (safe for local dev; set `False` in Render)
- [x] **CORS** — env-driven, no wildcard, `CORS_ALLOW_CREDENTIALS = True`
- [x] **JWT** — unchanged from Phase 5 (access=30min, refresh=7d, blacklisting active)
- [x] **`manage.py check --deploy`** with production env → 1 warning only (expected: `SECURE_SSL_REDIRECT` intentionally `False` for Render proxy)
- [x] **MEDIA storage limitation documented** in settings.py, urls.py, and deployment docs
- [x] **AI formula preserved:** 60% semantic + 30% skill + 10% experience — unchanged
- [x] **spaCy model:** `en_core_web_sm` installed and loaded successfully locally
- [x] **Sentence Transformers:** `all-MiniLM-L6-v2` loads correctly (lazy singleton)
- [x] **No LLMs, no vector databases, no Redis, no Celery introduced**

---

## READY FOR CLOUD DEPLOYMENT

> Items implemented and correct in code, but requiring cloud setup to verify end-to-end.

- [ ] **Gunicorn serves Django correctly** — code ready, requires Render deployment to verify
- [ ] **WhiteNoise serves static files** — `collectstatic` passes locally; requires live deployment
- [ ] **Database migrations on Neon** — Django ORM and migrations are compatible; requires Neon `DATABASE_URL`
- [ ] **SSL/HTTPS security headers** — production flags are correct; activated only when `DEBUG=False` on Render
- [ ] **`SECURE_PROXY_SSL_HEADER`** — set correctly for Render's reverse proxy; requires deployment to confirm X-Forwarded-Proto behavior
- [ ] **CORS on production domain** — configured to read from `CORS_ALLOWED_ORIGINS` env var; requires Vercel URL to verify

---

## BLOCKED

> Items requiring user action, credentials, or external service setup.

- [ ] **Render account** — Must be created by user at https://render.com
- [ ] **Neon account + database** — Must be created by user at https://neon.tech; `DATABASE_URL` must be provided
- [ ] **Production `SECRET_KEY`** — Must be generated and set in Render dashboard
- [ ] **`ALLOWED_HOSTS` in Render** — Must be set to actual Render subdomain (e.g. `smartats-api.onrender.com`)
- [ ] **`CORS_ALLOWED_ORIGINS` in Render** — Must be set to actual Vercel frontend URL (e.g. `https://smartats.vercel.app`)
- [ ] **Vercel env vars** — `VITE_API_BASE_URL` must be updated to Render backend URL after deployment
- [ ] **Resume persistent storage** — `django-storages` + S3/Cloudinary NOT yet configured; files are ephemeral on Render (Phase 6B)
- [ ] **Actual production deployment verification** — Cannot be performed without Render/Neon credentials

---

## Known Issues / Limitations

| Issue | Severity | Phase |
|---|---|---|
| Resume files lost on Render redeploy | High | Phase 6B (object storage) |
| Sentence Transformer cold start ~6s | Medium | Acceptable for MVP; mitigate with paid Render instance |
| Render Free tier spin-down (15min) | Medium | Upgrade to Starter/paid plan |
| JWT stored in localStorage (XSS risk) | Medium | Known; documented in auth-security.md |
| Admin `/admin/` panel publicly accessible | Low | No IP restriction; acceptable for now |
