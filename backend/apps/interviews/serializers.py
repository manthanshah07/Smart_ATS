from rest_framework import serializers
from .models import Interview
from apps.applications.models import Application


class InterviewSerializer(serializers.ModelSerializer):
    """Interview serializer for scheduling and status updates."""

    candidate_name = serializers.SerializerMethodField()
    job_title = serializers.CharField(source='application.job.title', read_only=True)

    class Meta:
        model = Interview
        fields = [
            'id', 'application', 'candidate_name', 'job_title',
            'scheduled_time', 'duration_minutes', 'interview_type',
            'meeting_link_or_location', 'status', 'feedback',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_candidate_name(self, obj):
        candidate = obj.application.candidate.user
        return f"{candidate.first_name} {candidate.last_name}".strip() or candidate.email

    def create(self, validated_data):
        interview = super().create(validated_data)
        # Update linked application status to INTERVIEW_SCHEDULED
        app = interview.application
        if app.status != Application.ApplicationStatus.INTERVIEW_SCHEDULED:
            app.status = Application.ApplicationStatus.INTERVIEW_SCHEDULED
            app.save()
        return interview
