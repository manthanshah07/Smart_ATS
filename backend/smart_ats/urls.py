"""
URL Configuration for SmartATS Backend.
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

# Aggregate all API v1 endpoints
api_v1_patterns = [
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

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
