from django.urls import path
from .views import (
    ApplicationSubmitView,
    CandidateApplicationListView,
    JobApplicantsRankedListView,
    ApplicationStatusUpdateView,
)

urlpatterns = [
    path('applications/', ApplicationSubmitView.as_view(), name='application_submit'),
    path('candidate/applications/', CandidateApplicationListView.as_view(), name='candidate_applications'),
    path('jobs/<int:job_id>/applicants/', JobApplicantsRankedListView.as_view(), name='job_applicants_ranked'),
    path('applications/<int:pk>/status/', ApplicationStatusUpdateView.as_view(), name='application_status_update'),
]
