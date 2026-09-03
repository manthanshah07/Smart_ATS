from rest_framework import serializers
from .models import Company


class CompanySerializer(serializers.ModelSerializer):
    """Serializer for Company entity."""

    class Meta:
        model = Company
        fields = [
            'id', 'name', 'website', 'description', 'industry',
            'location', 'logo', 'is_verified', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'is_verified', 'created_at', 'updated_at']
