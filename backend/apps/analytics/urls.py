from django.urls import path
from .views import AdminAnalyticsView

urlpatterns = [
    path('admin/analytics/', AdminAnalyticsView.as_view(), name='admin_analytics'),
]
