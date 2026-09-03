from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterView,
    CustomTokenObtainPairView,
    PasswordResetRequestView,
    CandidateProfileView,
    CandidateResumeUploadView,
    AdminUserListView,
    AdminUserDetailView,
)

urlpatterns = [
    # Auth endpoints
    path('auth/register/', RegisterView.as_view(), name='auth_register'),
    path('auth/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/password-reset/', PasswordResetRequestView.as_view(), name='password_reset'),

    # Candidate endpoints
    path('candidate/profile/', CandidateProfileView.as_view(), name='candidate_profile'),
    path('candidate/resume/', CandidateResumeUploadView.as_view(), name='candidate_resume'),

    # Admin user management
    path('admin/users/', AdminUserListView.as_view(), name='admin_users_list'),
    path('admin/users/<int:pk>/', AdminUserDetailView.as_view(), name='admin_user_detail'),
]
