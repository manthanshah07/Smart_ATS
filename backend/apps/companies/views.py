from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from apps.accounts.permissions import IsRecruiter, IsAdmin
from .models import Company
from .serializers import CompanySerializer


class RecruiterCompanyView(generics.RetrieveUpdateAPIView):
    """FR-10: Recruiter company profile management."""
    serializer_class = CompanySerializer
    permission_classes = [IsAuthenticated, IsRecruiter]

    def get_object(self):
        recruiter = getattr(self.request.user, 'recruiter_profile', None)
        if not recruiter or not recruiter.company:
            # If no company attached yet, return a blank/newly linked one or 404
            company = Company.objects.create(name=f"{self.request.user.first_name}'s Organization")
            if recruiter:
                recruiter.company = company
                recruiter.save()
            return company
        return recruiter.company


class AdminCompanyModerationView(generics.UpdateAPIView):
    """FR-21: Admin moderation of companies."""
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [IsAuthenticated, IsAdmin]
