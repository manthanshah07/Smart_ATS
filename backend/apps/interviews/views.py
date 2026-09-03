from rest_framework import generics, permissions
from rest_framework.exceptions import PermissionDenied
from .models import Interview
from .serializers import InterviewSerializer
from apps.accounts.permissions import IsRecruiter, IsCandidate, IsAdmin


class InterviewListCreateView(generics.ListCreateAPIView):
    """FR-14: Schedule interview (Recruiters) or view scheduled interviews (Candidate/Recruiter)."""
    serializer_class = InterviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'CANDIDATE':
            candidate = getattr(user, 'candidate_profile', None)
            if not candidate:
                return Interview.objects.none()
            return Interview.objects.filter(application__candidate=candidate)
        elif user.role == 'RECRUITER':
            recruiter = getattr(user, 'recruiter_profile', None)
            if not recruiter or not recruiter.company:
                return Interview.objects.none()
            return Interview.objects.filter(application__job__company=recruiter.company)
        elif user.role == 'ADMIN':
            return Interview.objects.all()
        return Interview.objects.none()

    def perform_create(self, serializer):
        if self.request.user.role != 'RECRUITER' and not self.request.user.is_staff:
            raise PermissionDenied("Only recruiters or admins can schedule interviews.")
        serializer.save()


class InterviewDetailView(generics.RetrieveUpdateAPIView):
    """View and update interview details and feedback."""
    queryset = Interview.objects.all()
    serializer_class = InterviewSerializer
    permission_classes = [permissions.IsAuthenticated]
