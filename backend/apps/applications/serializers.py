from rest_framework import serializers
from .models import Application, AIAnalysis, ApplicationStatusHistory
from apps.jobs.serializers import JobSerializer
from apps.accounts.serializers import CandidateProfileSerializer


class AIAnalysisSerializer(serializers.ModelSerializer):
    """Explainable AI Analysis Serializer."""

    class Meta:
        model = AIAnalysis
        fields = [
            'id', 'overall_match_score', 'semantic_similarity_score',
            'skill_match_score', 'experience_match_score',
            'matched_skills', 'missing_skills', 'experience_match_summary',
            'explanation', 'model_name', 'model_version', 'created_at'
        ]
        read_only_fields = fields


class ApplicationStatusHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ApplicationStatusHistory
        fields = ['status', 'changed_at']

class ApplicationSerializer(serializers.ModelSerializer):
    """Application serializer for candidates and recruiters."""

    job_details = JobSerializer(source='job', read_only=True)
    candidate_details = CandidateProfileSerializer(source='candidate', read_only=True)
    ai_analysis = AIAnalysisSerializer(read_only=True)
    status_history = ApplicationStatusHistorySerializer(many=True, read_only=True)

    class Meta:
        model = Application
        fields = [
            'id', 'job', 'job_details', 'candidate', 'candidate_details',
            'resume_snapshot', 'status', 'ai_analysis', 'status_history', 'applied_at', 'updated_at'
        ]
        read_only_fields = ['id', 'candidate', 'resume_snapshot', 'applied_at', 'updated_at']


class ApplicationStatusUpdateSerializer(serializers.ModelSerializer):
    """Serializer strictly for updating application status (Recruiters)."""

    class Meta:
        model = Application
        fields = ['id', 'status']

    def validate_status(self, value):
        instance = self.instance
        if instance:
            allowed = instance.VALID_TRANSITIONS.get(instance.status, [])
            if value not in allowed:
                raise serializers.ValidationError(
                    f"Cannot transition status from '{instance.status}' to '{value}'. Allowed transitions: {allowed}"
                )
        return value
