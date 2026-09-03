from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_str
from django.db import transaction
from .models import User, Candidate, Recruiter


class UserSerializer(serializers.ModelSerializer):
    """Safe User serializer for general user serialization."""

    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'role', 'is_active', 'created_at']
        read_only_fields = ['id', 'email', 'role', 'is_active', 'created_at']


class CandidateProfileSerializer(serializers.ModelSerializer):
    """Candidate profile serializer."""

    class Meta:
        model = Candidate
        fields = [
            'id', 'phone', 'headline', 'bio', 'location',
            'resume_file', 'raw_resume_text', 'parsed_skills',
            'parsed_education', 'parsed_experience',
            'resume_uploaded_at', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'raw_resume_text', 'parsed_skills',
            'parsed_education', 'parsed_experience', 'resume_uploaded_at',
            'created_at', 'updated_at'
        ]


class RecruiterProfileSerializer(serializers.ModelSerializer):
    """Recruiter profile serializer."""

    company_name = serializers.CharField(source='company.name', read_only=True)
    company_id = serializers.IntegerField(source='company.id', read_only=True)

    class Meta:
        model = Recruiter
        fields = [
            'id', 'company', 'company_id', 'company_name',
            'designation', 'is_approved', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'company_id', 'company_name', 'is_approved', 'created_at', 'updated_at']


class CurrentUserSerializer(serializers.ModelSerializer):
    """Current authenticated user representation with role-specific profile details."""

    profile = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'role', 'is_active', 'created_at', 'profile']
        read_only_fields = fields

    def get_profile(self, obj):
        if obj.role == User.Role.CANDIDATE:
            candidate = getattr(obj, 'candidate_profile', None)
            if candidate:
                return CandidateProfileSerializer(candidate).data
        elif obj.role == User.Role.RECRUITER:
            recruiter = getattr(obj, 'recruiter_profile', None)
            if recruiter:
                return RecruiterProfileSerializer(recruiter).data
        return None


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Handles candidate and recruiter registration transactionally."""

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
            'role': {'required': True},
            'email': {'required': True},
        }

    def validate_email(self, value):
        normalized_email = value.lower().strip()
        if User.objects.filter(email=normalized_email).exists():
            raise serializers.ValidationError("An account with this email address already exists.")
        return normalized_email

    def validate_role(self, value):
        if value not in [User.Role.CANDIDATE, User.Role.RECRUITER]:
            raise serializers.ValidationError("Public registration is only permitted for CANDIDATE or RECRUITER roles.")
        return value

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password_confirm": "Passwords do not match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        role = validated_data.get('role')

        with transaction.atomic():
            user = User.objects.create_user(**validated_data)
            if role == User.Role.CANDIDATE:
                Candidate.objects.create(user=user)
            elif role == User.Role.RECRUITER:
                Recruiter.objects.create(user=user)

        return user


class LogoutSerializer(serializers.Serializer):
    """Serializer for invalidating / blacklisting a refresh token."""

    refresh = serializers.CharField(required=True)


class PasswordResetRequestSerializer(serializers.Serializer):
    """Serializer for requesting password reset instructions."""

    email = serializers.EmailField(required=True)


class PasswordResetConfirmSerializer(serializers.Serializer):
    """Serializer for confirming password reset with uid and token."""

    uid = serializers.CharField(required=True)
    token = serializers.CharField(required=True)
    new_password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password],
        style={'input_type': 'password'}
    )
    new_password_confirm = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )

    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError({"new_password_confirm": "New passwords do not match."})

        try:
            user_id = force_str(urlsafe_base64_decode(attrs['uid']))
            user = User.objects.get(pk=user_id)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            raise serializers.ValidationError({"uid": "Invalid user identifier."})

        if not default_token_generator.check_token(user, attrs['token']):
            raise serializers.ValidationError({"token": "Invalid or expired password reset token."})

        self.user = user
        return attrs

    def save(self):
        self.user.set_password(self.validated_data['new_password'])
        self.user.save()
        return self.user
