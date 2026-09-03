from django.urls import path
from .views import RecruiterCompanyView, AdminCompanyModerationView

urlpatterns = [
    path('recruiter/company/', RecruiterCompanyView.as_view(), name='recruiter_company'),
    path('admin/companies/<int:pk>/moderate/', AdminCompanyModerationView.as_view(), name='admin_company_moderate'),
]
