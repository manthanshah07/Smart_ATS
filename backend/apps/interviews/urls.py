from django.urls import path
from .views import InterviewListCreateView, InterviewDetailView

urlpatterns = [
    path('interviews/', InterviewListCreateView.as_view(), name='interview_list_create'),
    path('interviews/<int:pk>/', InterviewDetailView.as_view(), name='interview_detail'),
]
