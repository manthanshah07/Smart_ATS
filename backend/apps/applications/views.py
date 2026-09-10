from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied, ValidationError
from .models import Application
from .serializers import (
    ApplicationSerializer,
    ApplicationStatusUpdateSerializer,
)
from apps.jobs.models import Job
from apps.accounts.permissions import IsCandidate, IsRecruiter, IsAdmin


class ApplicationSubmitView(generics.CreateAPIView):
    """FR-8: Candidate submits an application for a job."""
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated, IsCandidate]

    def perform_create(self, serializer):
        candidate = getattr(self.request.user, 'candidate_profile', None)
        if not candidate:
            raise ValidationError("Candidate profile does not exist.")

        job_id = self.request.data.get('job')
        try:
            job = Job.objects.get(pk=job_id)
        except Job.DoesNotExist:
            raise ValidationError("Specified job does not exist.")

        if job.status == Job.JobStatus.CLOSED:
            raise ValidationError("Cannot apply to a closed job.")

        if Application.objects.filter(job=job, candidate=candidate).exists():
            raise ValidationError("You have already applied for this job.")

        # Create application snapshotting the current parsed resume state
        resume_snapshot = {
            'parsed_skills': candidate.parsed_skills,
            'parsed_education': candidate.parsed_education,
            'parsed_experience': candidate.parsed_experience,
            'headline': candidate.headline,
            'bio': candidate.bio,
        }

        # We must save the application first so it has an ID, then we evaluate it.
        # However, DRF's perform_create doesn't return the instance automatically.
        # We can capture the saved instance via the serializer.
        application = serializer.save(candidate=candidate, resume_snapshot=resume_snapshot)

        # Trigger AI Pipeline
        from apps.ai_engine.services import AIPipelineService
        
        try:
            AIPipelineService.evaluate_application(application)
        except Exception as e:
            # We don't fail the application submission if AI evaluation fails.
            # We log it and let it proceed (could be a retry mechanism later).
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"AI Pipeline failed for application {application.id}: {e}")

class CandidateApplicationListView(generics.ListAPIView):
    """FR-9: Candidate tracks their own submitted applications."""
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated, IsCandidate]

    def get_queryset(self):
        candidate = getattr(self.request.user, 'candidate_profile', None)
        if not candidate:
            return Application.objects.none()
        return Application.objects.filter(candidate=candidate).select_related('job', 'job__company', 'ai_analysis')


class JobApplicantsRankedListView(generics.ListAPIView):
    """FR-12: Recruiter views applicants for a job, ranked by AI match score."""
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated, (IsRecruiter | IsAdmin)]

    def get_queryset(self):
        job_id = self.kwargs.get('job_id')
        try:
            job = Job.objects.get(pk=job_id)
        except Job.DoesNotExist:
            return Application.objects.none()

        # Check recruiter permission for this company's job
        if self.request.user.role == 'RECRUITER':
            recruiter = getattr(self.request.user, 'recruiter_profile', None)
            if not recruiter or job.company != recruiter.company:
                raise PermissionDenied("You do not have permission to view applicants for this job.")

        return Application.objects.filter(job=job).select_related(
            'candidate__user', 'ai_analysis'
        ).order_by('-ai_analysis__overall_match_score', '-applied_at')


class ApplicationStatusUpdateView(generics.UpdateAPIView):
    """FR-13: Recruiter shortlists or rejects a candidate."""
    queryset = Application.objects.all()
    serializer_class = ApplicationStatusUpdateSerializer
    permission_classes = [permissions.IsAuthenticated, (IsRecruiter | IsAdmin)]

    def check_object_permissions(self, request, obj):
        super().check_object_permissions(request, obj)
        if request.user.role == 'RECRUITER':
            recruiter = getattr(request.user, 'recruiter_profile', None)
            if not recruiter or obj.job.company != recruiter.company:
                raise PermissionDenied("You do not have permission to modify this application.")

class ApplicationWithdrawView(generics.UpdateAPIView):
    """Candidate withdraws their application."""
    queryset = Application.objects.all()
    serializer_class = ApplicationStatusUpdateSerializer
    permission_classes = [permissions.IsAuthenticated, IsCandidate]

    def check_object_permissions(self, request, obj):
        super().check_object_permissions(request, obj)
        candidate = getattr(request.user, 'candidate_profile', None)
        if not candidate or obj.candidate != candidate:
            raise PermissionDenied("You can only withdraw your own applications.")

    def perform_update(self, serializer):
        serializer.save(status='WITHDRAWN')
