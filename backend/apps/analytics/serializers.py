from rest_framework import serializers


class PlatformAnalyticsSerializer(serializers.Serializer):
    """Platform metrics aggregation serializer."""

    total_users = serializers.IntegerField()
    total_candidates = serializers.IntegerField()
    total_recruiters = serializers.IntegerField()
    total_companies = serializers.IntegerField()
    total_jobs = serializers.IntegerField()
    open_jobs = serializers.IntegerField()
    total_applications = serializers.IntegerField()
    total_interviews = serializers.IntegerField()
    average_match_score = serializers.FloatField()
