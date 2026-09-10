"""
Django settings for smart_ats project.

Driven entirely by environment variables. Single settings file supports both
local development (DEBUG=True) and production (DEBUG=False) through env config.
"""

import os
import sys
from pathlib import Path
from datetime import timedelta
import dj_database_url
from dotenv import load_dotenv

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Add apps directory to sys.path
sys.path.insert(0, str(BASE_DIR))

# Load environment variables from .env file (no-op in production where env vars are injected)
load_dotenv(BASE_DIR / '.env')

# ─── Core ──────────────────────────────────────────────────────────────────────

DEBUG = os.getenv('DEBUG', 'True').lower() in ('true', '1', 't')

_raw_secret = os.getenv('SECRET_KEY', '')

if not DEBUG and (not _raw_secret or 'django-insecure' in _raw_secret or len(_raw_secret) < 40):
    raise ValueError(
        "FATAL: SECRET_KEY is missing, insecure, or too short for production. "
        "Set a strong SECRET_KEY environment variable before deploying."
    )

SECRET_KEY = _raw_secret or 'django-insecure-smartats-dev-fallback-key-for-local-development-only-replace-in-prod'

ALLOWED_HOSTS = [
    host.strip()
    for host in os.getenv('ALLOWED_HOSTS', 'localhost,127.0.0.1,0.0.0.0').split(',')
    if host.strip()
]

# ─── Application ───────────────────────────────────────────────────────────────

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Third-party packages
    'rest_framework',
    'rest_framework_simplejwt',
    'rest_framework_simplejwt.token_blacklist',
    'corsheaders',

    # SmartATS Local Apps
    'apps.accounts',
    'apps.companies',
    'apps.jobs',
    'apps.applications',
    'apps.interviews',
    'apps.notifications',
    'apps.analytics',
    'apps.ai_engine',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    # WhiteNoise: must be immediately after SecurityMiddleware
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'smart_ats.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'smart_ats.wsgi.application'

# ─── Database ──────────────────────────────────────────────────────────────────
# Configurable via DATABASE_URL. Defaults to local PostgreSQL for development.
# Production: set DATABASE_URL to your Neon connection string.

DATABASE_URL = os.getenv(
    'DATABASE_URL',
    'postgres://postgres:postgres@localhost:5432/smartats_db'
)

DATABASES = {
    'default': dj_database_url.config(
        default=DATABASE_URL,
        conn_max_age=600,
        conn_health_checks=True,
    )
}

# ─── Custom User Model ─────────────────────────────────────────────────────────

AUTH_USER_MODEL = 'accounts.User'

# ─── Password Validation ───────────────────────────────────────────────────────

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
        'OPTIONS': {'min_length': 8},
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# ─── Internationalization ──────────────────────────────────────────────────────

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# ─── Static Files ──────────────────────────────────────────────────────────────
# WhiteNoise serves static files directly from Django in production.

STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

STORAGES = {
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
    },
    # NOTE: Media/resume files use local filesystem storage.
    # PRODUCTION LIMITATION: Render's ephemeral disk means uploaded resume files
    # are lost on each deploy/restart. The parsed text and AI scores ARE durable
    # in PostgreSQL (Neon). Durable file storage (e.g. S3 via django-storages)
    # is required for persistent resume downloads — planned for Phase 6B.
    "default": {
        "BACKEND": "django.core.files.storage.FileSystemStorage",
    },
}

# ─── Media Files (Resume Uploads) ─────────────────────────────────────────────
# IMPORTANT: These files are stored on local disk.
# In production on Render (ephemeral disk), uploaded files will be lost on
# each deploy or instance restart. The extracted resume text and AI analysis
# are safely stored in PostgreSQL. Media files must be migrated to a
# persistent object store (S3/Cloudinary) for durable download links.

MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# ─── Primary Key ───────────────────────────────────────────────────────────────

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# ─── Django REST Framework ─────────────────────────────────────────────────────

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 10,
    'EXCEPTION_HANDLER': 'rest_framework.views.exception_handler',
}

# ─── JWT ───────────────────────────────────────────────────────────────────────

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=30),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'UPDATE_LAST_LOGIN': True,
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
    'AUTH_HEADER_TYPES': ('Bearer',),
    'AUTH_HEADER_NAME': 'HTTP_AUTHORIZATION',
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
    'USER_AUTHENTICATION_RULE': 'rest_framework_simplejwt.authentication.default_user_authentication_rule',
    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
}

# ─── Email ─────────────────────────────────────────────────────────────────────

EMAIL_BACKEND = os.getenv('EMAIL_BACKEND', 'django.core.mail.backends.console.EmailBackend')
DEFAULT_FROM_EMAIL = os.getenv('DEFAULT_FROM_EMAIL', 'noreply@smartats.local')

# ─── CORS ──────────────────────────────────────────────────────────────────────
# CORS_ALLOWED_ORIGINS must be set explicitly in production.
# Never use CORS_ALLOW_ALL_ORIGINS = True.

CORS_ALLOWED_ORIGINS = [
    origin.strip()
    for origin in os.getenv(
        'CORS_ALLOWED_ORIGINS',
        'http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173'
    ).split(',')
    if origin.strip()
]
CORS_ALLOW_CREDENTIALS = True

# ─── Security (production-only) ────────────────────────────────────────────────
# These settings are appropriate for Render + HTTPS deployment.
# Render terminates SSL at the load balancer and passes X-Forwarded-Proto header.
# SSL redirect is handled by Render's infrastructure — do NOT set
# SECURE_SSL_REDIRECT=True as it causes redirect loops behind Render's proxy.

if not DEBUG:
    # Trust Render's SSL termination proxy
    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

    # Cookie security
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SESSION_COOKIE_HTTPONLY = True
    CSRF_COOKIE_HTTPONLY = True

    # Clickjacking protection (already covered by middleware, explicit here)
    X_FRAME_OPTIONS = 'DENY'

    # HSTS — enforce HTTPS for 1 year, include subdomains
    SECURE_HSTS_SECONDS = 31536000
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True

    # Content type sniffing protection
    SECURE_CONTENT_TYPE_NOSNIFF = True
