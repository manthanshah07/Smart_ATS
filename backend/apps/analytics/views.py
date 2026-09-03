from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Avg

from apps.accounts.permissions import IsAdmin
from apps.accounts.models import User, Candidate, Recruiter
from apps.companies.models import Company
from apps.jobs.models import Job
from apps.applications.models import Application, AIAnalysis
from apps.interviews.models import Interview
from .serializers import PlatformAnalyticsSerializer


class AdminAnalyticsView(APIView):
    """FR-22: Platform analytics overview for Admins."""
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request):
        avg_score = AIAnalysis.objects.aggregate(avg=Avg('overall_match_score'))['avg'] or 0.0

        metrics = {
            'total_users': User.objects.count(),
            'total_candidates': Candidate.objects.count(),
            'total_recruiters': Recruiter.objects.count(),
            'total_companies': Company.objects.count(),
            'total_jobs': Job.objects.count(),
            'open_jobs': Job.objects.filter(status=Job.JobStatus.OPEN).count(),
            'total_applications': Application.objects.count(),
            'total_interviews': Interview.objects.count(),
            'average_match_score': round(avg_score, 2),
        }

        serializer = PlatformAnalyticsSerializer(metrics)
        return Response(serializer.data)
