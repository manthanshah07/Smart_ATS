from rest_framework import generics, permissions
from rest_framework.exceptions import PermissionDenied
from .models import Job
from .serializers import JobSerializer
from apps.accounts.permissions import IsRecruiter, IsJobPoster, IsAdmin


class JobListCreateView(generics.ListCreateAPIView):
    """FR-7 (List/Search Jobs for public/candidates) & FR-11 (Job Creation for Recruiters)."""
    serializer_class = JobSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated(), IsRecruiter()]
        return [permissions.AllowAny()]

    def get_queryset(self):
        queryset = Job.objects.select_related('company', 'recruiter__user').all()
        # Non-recruiters/public only see OPEN jobs by default
        user = self.request.user
        if not (user.is_authenticated and (user.role == 'RECRUITER' or user.role == 'ADMIN')):
            queryset = queryset.filter(status=Job.JobStatus.OPEN)

        # Filters
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(title__icontains=search)

        job_type = self.request.query_params.get('job_type')
        if job_type:
            queryset = queryset.filter(job_type=job_type)

        location = self.request.query_params.get('location')
        if location:
            queryset = queryset.filter(location__icontains=location)

        return queryset

    def perform_create(self, serializer):
        recruiter = getattr(self.request.user, 'recruiter_profile', None)
        if not recruiter or not recruiter.company:
            raise PermissionDenied("Recruiter must be affiliated with a company to post jobs.")
        serializer.save(recruiter=recruiter, company=recruiter.company)


class JobDetailView(generics.RetrieveUpdateDestroyAPIView):
    """FR-7 (Job Details) & FR-11 (Update/Close Job)."""
    queryset = Job.objects.select_related('company', 'recruiter__user').all()
    serializer_class = JobSerializer

    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [permissions.IsAuthenticated(), (IsJobPoster | IsAdmin)()]
        return [permissions.AllowAny()]
