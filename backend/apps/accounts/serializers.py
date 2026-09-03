from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import User, Candidate, Recruiter


class UserSerializer(serializers.ModelSerializer):
    """Safe User serializer for profile and response serialization."""

    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'role', 'is_active', 'created_at']
        read_only_fields = ['id', 'email', 'role', 'is_active', 'created_at']


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Handles candidate and recruiter registration with password validation."""

    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password],
        style={'input_type': 'password'}
    )
    password_confirm = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )

    class Meta:
        model = User
        fields = ['id', 'email', 'password', 'password_confirm', 'first_name', 'last_name', 'role']
        extra_kwargs = {
            'role': {'required': True}
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password_confirm": "Passwords do not match."})

        if attrs['role'] == User.Role.ADMIN:
            raise serializers.ValidationError({"role": "Cannot register as Admin via standard registration."})

        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        role = validated_data.get('role')
        user = User.objects.create_user(**validated_data)

        # Automatically create the corresponding role profile
        if role == User.Role.CANDIDATE:
            Candidate.objects.create(user=user)
        elif role == User.Role.RECRUITER:
            Recruiter.objects.create(user=user)

        return user


class CandidateProfileSerializer(serializers.ModelSerializer):
    """Candidate profile representation with nested user info."""

    user = UserSerializer(read_only=True)

    class Meta:
        model = Candidate
        fields = [
            'id', 'user', 'phone', 'headline', 'bio', 'location',
            'resume_file', 'raw_resume_text', 'parsed_skills',
            'parsed_education', 'parsed_experience',
            'resume_uploaded_at', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'user', 'raw_resume_text', 'parsed_skills',
            'parsed_education', 'parsed_experience', 'resume_uploaded_at',
            'created_at', 'updated_at'
        ]


class RecruiterProfileSerializer(serializers.ModelSerializer):
    """Recruiter profile representation with nested user and company info."""

    user = UserSerializer(read_only=True)
    company_name = serializers.CharField(source='company.name', read_only=True)

    class Meta:
        model = Recruiter
        fields = [
            'id', 'user', 'company', 'company_name',
            'designation', 'is_approved', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'is_approved', 'created_at', 'updated_at']
