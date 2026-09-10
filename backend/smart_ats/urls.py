"""
URL Configuration for SmartATS Backend.
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse


def health_check(request):
    """
    GET /api/v1/health/
    Minimal health endpoint for Render uptime checks and load balancer probes.
    Does NOT expose environment variables, stack traces, or sensitive data.
    """
    return JsonResponse({"status": "ok"}, status=200)


# Aggregate all API v1 endpoints
api_v1_patterns = [
    path('health/', health_check, name='health_check'),
    path('', include('apps.accounts.urls')),
    path('', include('apps.companies.urls')),
    path('', include('apps.jobs.urls')),
    path('', include('apps.applications.urls')),
    path('', include('apps.interviews.urls')),
    path('', include('apps.notifications.urls')),
    path('', include('apps.analytics.urls')),
]

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/', include(api_v1_patterns)),
]

# Media files: served by Django only in DEBUG mode (local development).
# PRODUCTION NOTE: On Render (ephemeral disk), uploaded resume files are NOT
# durably persisted and will NOT be served after a redeploy. AI analysis
# results are stored in PostgreSQL and remain functional. Persistent file
# serving requires a dedicated object store (S3/Cloudinary) — Phase 6B.
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
