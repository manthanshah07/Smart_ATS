from rest_framework import serializers
from .models import Job
from apps.companies.serializers import CompanySerializer


class JobSerializer(serializers.ModelSerializer):
    """Job serializer with nested company details for read and explicit fields for write."""

    company_details = CompanySerializer(source='company', read_only=True)
    recruiter_name = serializers.SerializerMethodField()

    class Meta:
        model = Job
        fields = [
            'id', 'company', 'company_details', 'recruiter', 'recruiter_name',
            'title', 'description', 'department', 'location', 'job_type',
            'experience_min_years', 'required_skills', 'preferred_skills',
            'status', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'company', 'recruiter', 'created_at', 'updated_at']

    def get_recruiter_name(self, obj):
        if obj.recruiter and obj.recruiter.user:
            return f"{obj.recruiter.user.first_name} {obj.recruiter.user.last_name}".strip() or obj.recruiter.user.email
        return None
