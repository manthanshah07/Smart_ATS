# SmartATS — Phase 6A Deployment Audit

**Date:** 2026-09-10  
**Auditor:** Phase 6A release gate  
**Target platform:** Render (backend) + Neon (PostgreSQL) + Vercel (frontend)

---

## 1. Current Deployment Readiness

| Area | Status |
|---|---|
| Django settings | Partially ready — env-driven but missing production security flags |
| Environment handling | Good foundation — `python-dotenv` + `os.getenv` throughout |
| Database configuration | `dj-database-url` present, `DATABASE_URL` env-driven — GOOD |
| CORS | Env-driven — GOOD |
| JWT | Fully implemented — GOOD |
| Static files | `STATIC_ROOT` configured, `collectstatic` will work once WhiteNoise is added |
| Media/resume storage | **LOCAL FILESYSTEM ONLY — CRITICAL PRODUCTION GAP** |
| Gunicorn | **NOT installed** |
| WhiteNoise | **NOT installed** |
| Health endpoint | **MISSING** |
| `render.yaml` | **MISSING** |
| spaCy model | Auto-download fallback exists in `extractor.py` — requires startup script |
| Sentence Transformers | Lazy-loaded singleton — will work but cold start is slow (~6s) |

---

## 2. Existing Production Configuration

### What is already correct

- `SECRET_KEY`: Read from env via `os.getenv` — no hardcoding
- `DEBUG`: Driven by `DEBUG` env var via `os.getenv('DEBUG', 'True')`
- `ALLOWED_HOSTS`: Comma-separated env var, split and parsed correctly
- `DATABASE_URL`: `dj_database_url.config()` with `conn_max_age=600`, `conn_health_checks=True` — Neon-compatible pattern
- `CORS_ALLOWED_ORIGINS`: Env-driven, no `CORS_ALLOW_ALL_ORIGINS`
- `CORS_ALLOW_CREDENTIALS = True`
- JWT: Access=30min, Refresh=7d, `ROTATE_REFRESH_TOKENS`, `BLACKLIST_AFTER_ROTATION` — correctly secured
- Password validation: 4 validators active
- Custom User model: `AUTH_USER_MODEL = 'accounts.User'`
- Email backend: Env-driven, defaults to console (safe)
- Migrations: 2/2 applied, no pending migrations

### `.env` file

- Present and `.gitignore`'d — NOT committed to git ✅
- Contains only local dev credentials ✅
- `.env.example` present ✅ (but incomplete — missing email, JWT, security settings)

---

## 3. What Is Missing

### Production blocker issues

1. **Gunicorn not installed** — Render requires a WSGI server. `python manage.py runserver` is not production-safe.
2. **WhiteNoise not installed** — Django cannot serve its own static files in production without a middleware layer or separate CDN.
3. **No `render.yaml`** — Render deployment configuration is missing.
4. **No health endpoint** — Render and uptime monitors require `GET /api/v1/health/` returning 200.
5. **Production security flags missing** in `settings.py`:
   - `SECURE_SSL_REDIRECT` not set (should be `True` in production behind Render's TLS termination — actually should be `False` on Render because TLS is terminated at the proxy)
   - `SESSION_COOKIE_SECURE` not set
   - `CSRF_COOKIE_SECURE` not set
   - `SECURE_HSTS_SECONDS` not set
   - `SECURE_PROXY_SSL_HEADER` not set (required on Render which uses reverse proxy)
6. **spaCy `en_core_web_sm` model** — The auto-download fallback in `extractor.py` works but is fragile on cold Render deployments. The build command must explicitly install it.
7. **`sentence-transformers` model download** — `all-MiniLM-L6-v2` is downloaded from HuggingFace on first use. On Render it will download to a persistent `/tmp` dir (ephemeral). This adds ~6s to first request. Acceptable for MVP, documented as known.
8. **`DJANGO_SETTINGS_MODULE`** — defaults to `smart_ats.settings` in wsgi.py/asgi.py but should be explicit in the Render environment.
9. **`SECRET_KEY` insecure fallback** — the hardcoded `django-insecure-` fallback is dangerous if `SECRET_KEY` env var is accidentally missing in production. Should raise an error in production instead.
10. **`MEDIA_URL` served through `DEBUG` guard** in `urls.py` — media files are ONLY served in `DEBUG=True` mode. In production, local media files will be inaccessible, causing uploaded resume file links to 404.

---

## 4. Security Risks

| Risk | Severity | Notes |
|---|---|---|
| Insecure `SECRET_KEY` fallback | **HIGH** | If env var is missing in production, Django uses a known weak key |
| Local media storage | **HIGH** | Resume files on ephemeral Render disk are lost on each deploy |
| No HSTS | Medium | Render provides HTTPS but Django won't enforce it |
| localStorage for JWT tokens | Medium | XSS vulnerability; acceptable for MVP, documented |
| Admin site publicly accessible | Low | No IP restriction on `/admin/` |
| `DEBUG` default is `True` | Medium | If `DEBUG` env var is not set, defaults to `True` |

---

## 5. Render-Specific Requirements

- Service type: **Web Service**
- Runtime: **Python**
- Build command: `pip install -r requirements.txt && python -m spacy download en_core_web_sm && python manage.py collectstatic --noinput && python manage.py migrate`
- Start command: `gunicorn smart_ats.wsgi:application --bind 0.0.0.0:$PORT`
- Environment: Python 3.12
- `PORT` environment variable: Set automatically by Render — Gunicorn must bind to `$PORT`
- `RENDER=True` can be used to detect Render environment
- `SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')` required — Render terminates SSL at load balancer
- `SECURE_SSL_REDIRECT = False` — Render's proxy handles redirect already
- Disk/storage: ephemeral — media files CANNOT persist across deploys

---

## 6. Neon-Specific Requirements

- Neon provides PostgreSQL with standard `DATABASE_URL` connection strings
- Neon requires SSL — `dj-database-url` with `?sslmode=require` or via OPTIONS
- `conn_max_age=600` is already configured — appropriate for Neon's connection pooler
- `conn_health_checks=True` already configured — good for PgBouncer compatibility
- Neon uses Postgres 16 — fully compatible with Django ORM and all current models
- Migrations must be applied against Neon before serving traffic

---

## 7. Media/Resume Storage Implications

**This is the most critical production limitation.**

The current implementation:
- `MEDIA_ROOT = BASE_DIR / 'media'` — local filesystem
- `MEDIA_URL = '/media/'` — served only when `DEBUG=True`
- `resume_file = models.FileField(upload_to='resumes/%Y/%m/')` — writes to local disk

**On Render:**
- Render web services use **ephemeral disk** — all local files are lost on deploy, restart, or scale
- A resume uploaded by a candidate will physically disappear on the next deploy
- The `raw_resume_text` and parsed JSON fields ARE stored in PostgreSQL (Neon) and ARE durable
- AI matching does NOT re-read the file — it uses the database fields
- Therefore: AI functionality survives, but `resume_file` download links break after each deploy

**Decision:**
- Phase 6A: Document this clearly, preserve existing dev behavior, do NOT introduce Django Storages/S3/Cloudinary without approval
- The migration path for durable storage is: `django-storages` + AWS S3 or Cloudinary (Phase 6B+)
- Phase 6A acceptable because: the text extraction happens at upload time and results are stored in Postgres

---

## 8. Exact Changes Required

1. Add `gunicorn` and `whitenoise` to `requirements.txt`
2. Update `settings.py`:
   - Add production security settings (conditional on `DEBUG=False`)
   - Add `SECURE_PROXY_SSL_HEADER`
   - Add `whitenoise` to `MIDDLEWARE`
   - Add `whitenoise` to `STATICFILES_STORAGE`
   - Raise `ValueError` if `SECRET_KEY` is insecure in production
3. Create `render.yaml` with correct build/start commands
4. Add health endpoint `GET /api/v1/health/` with test
5. Update `.env.example` with all required variables
6. Update `urls.py` to add health endpoint
7. Update frontend `VITE_API_BASE_URL` instructions (Phase 6B)

---

## 9. Risks/Blockers

| Item | Blocker |
|---|---|
| Render account | **USER ACTION REQUIRED** — must create Render web service |
| Neon account | **USER ACTION REQUIRED** — must create Neon project and supply `DATABASE_URL` |
| Production `SECRET_KEY` | **USER ACTION REQUIRED** — must generate and set in Render env vars |
| Resume storage | **KNOWN GAP** — files ephemeral on Render; acceptable for Phase 6A MVP |
| Sentence Transformer download | **KNOWN SLOW** — ~6s cold start on first request; acceptable |
| spaCy model | Handled in build command |
