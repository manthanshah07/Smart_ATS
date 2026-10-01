from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from django.core.mail import send_mail
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.conf import settings

from .models import User, Candidate, Recruiter
from .permissions import IsCandidate, IsAdmin
from .serializers import (
    UserRegistrationSerializer,
    UserSerializer,
    CurrentUserSerializer,
    CandidateProfileSerializer,
    RecruiterProfileSerializer,
    LogoutSerializer,
    PasswordResetRequestSerializer,
    PasswordResetConfirmSerializer,
)


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Augments standard JWT token payload with user profile details and enforces active status."""

    def validate(self, attrs):
        data = super().validate(attrs)
        if not self.user.is_active:
            raise serializers.ValidationError("This account has been deactivated.")

        data['user'] = {
            'id': self.user.id,
            'email': self.user.email,
            'first_name': self.user.first_name,
            'last_name': self.user.last_name,
            'role': self.user.role,
        }
        return data


class CustomTokenObtainPairView(TokenObtainPairView):
    """FR-2: JWT token obtain view (Login)."""
    serializer_class = CustomTokenObtainPairSerializer


class RegisterView(generics.CreateAPIView):
    """FR-1: Candidate and Recruiter registration endpoint."""
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]


class CurrentUserView(generics.RetrieveAPIView):
    """Current authenticated user profile endpoint."""
    serializer_class = CurrentUserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class LogoutView(APIView):
    """Invalidates the provided refresh token via simplejwt blacklisting."""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = LogoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            refresh_token = serializer.validated_data['refresh']
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(
                {"message": "Successfully logged out. Refresh token has been blacklisted."},
                status=status.HTTP_200_OK
            )
        except TokenError as e:
            return Response(
                {"error": f"Invalid or expired token: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST
            )


class PasswordResetRequestView(APIView):
    """FR-4: Password reset request flow generating secure tokens."""
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email'].lower().strip()

        try:
            user = User.objects.get(email=email, is_active=True)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)

            reset_url = f"http://localhost:5173/forgot-password?uid={uid}&token={token}"
            subject = "SmartATS — Password Reset Request"
            message = (
                f"Hello {user.first_name or user.email},\n\n"
                f"You requested a password reset for your SmartATS account.\n"
                f"Please reset your password using the following link or tokens:\n\n"
                f"{reset_url}\n\n"
                f"UID: {uid}\n"
                f"Token: {token}\n\n"
                f"If you did not make this request, please ignore this email."
            )

            send_mail(
                subject=subject,
                message=message,
                from_email=getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@smartats.local'),
                recipient_list=[user.email],
                fail_silently=False,
            )
        except User.DoesNotExist:
            # Silently pass to avoid user email enumeration
            pass

        return Response(
            {"message": "If an active account with this email exists, password reset instructions have been sent."},
            status=status.HTTP_200_OK
        )


class PasswordResetConfirmView(APIView):
    """FR-4: Password reset confirmation submitting token and new password."""
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {"message": "Password has been successfully updated. You may now log in with your new password."},
            status=status.HTTP_200_OK
        )


class CandidateProfileView(generics.RetrieveUpdateAPIView):
    """FR-5: Candidate profile management endpoint."""
    serializer_class = CandidateProfileSerializer
    permission_classes = [IsAuthenticated, IsCandidate]

    def get_object(self):
        candidate, _ = Candidate.objects.get_or_create(user=self.request.user)
        return candidate


from django.utils import timezone
from rest_framework.parsers import MultiPartParser, FormParser
from django.core.exceptions import ValidationError as DjangoValidationError

class CandidateResumeUploadView(APIView):
    """FR-6: Candidate resume upload endpoint."""
    permission_classes = [IsAuthenticated, IsCandidate]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        candidate = getattr(request.user, 'candidate_profile', None)
        if not candidate:
            return Response({"error": "Candidate profile not found."}, status=status.HTTP_400_BAD_REQUEST)

        file_obj = request.FILES.get('resume')
        if not file_obj:
            return Response({"error": "No resume file provided."}, status=status.HTTP_400_BAD_REQUEST)

        import os
        file_ext = os.path.splitext(file_obj.name)[1]

        # Validate file extension
        valid_extensions = ['.pdf', '.docx']
        if not any(file_ext.lower() == ext for ext in valid_extensions):
            return Response({"error": "Invalid file format. Only PDF and DOCX are allowed."}, status=status.HTTP_400_BAD_REQUEST)

        # Validate file size (e.g., max 5MB)
        if file_obj.size > 5 * 1024 * 1024:
            return Response({"error": "File size exceeds 5MB limit."}, status=status.HTTP_400_BAD_REQUEST)

        candidate.resume_file = file_obj
        candidate.resume_uploaded_at = timezone.now()

        # Extract Text
        from apps.ai_engine.parser import ResumeParser
        from apps.ai_engine.extractor import NLPExtractor
        
        file_obj.seek(0)
        raw_text = ResumeParser.extract_text(file_obj, file_ext)
        candidate.raw_resume_text = raw_text

        # Parse NLP Entities
        parsed_data = NLPExtractor.extract_entities(raw_text)
        candidate.parsed_skills = parsed_data.get('skills', {})
        candidate.parsed_education = parsed_data.get('education', [])
        candidate.parsed_experience = parsed_data.get('experience', [])
        candidate.parsed_projects = parsed_data.get('projects', [])
        candidate.parsed_certifications = parsed_data.get('certifications', [])
        candidate.parsed_achievements = parsed_data.get('achievements', [])
        candidate.parsed_summary = parsed_data.get('summary', '')
        candidate.parsed_contact = parsed_data.get('contact', {})
        candidate.resume_validation = parsed_data.get('validation', {})

        # Automatically enrich candidate user profile if currently default/blank
        contact_info = parsed_data.get('contact', {})
        user = request.user
        user_modified = False

        if not user.first_name and contact_info.get('name'):
            name_parts = contact_info['name'].split()
            user.first_name = name_parts[0]
            if len(name_parts) > 1:
                user.last_name = " ".join(name_parts[1:])
            user_modified = True

        if user_modified:
            user.save()

        if not candidate.phone and contact_info.get('phone'):
            candidate.phone = contact_info['phone']
        if not candidate.location and contact_info.get('location'):
            candidate.location = contact_info['location']
        if not candidate.bio and parsed_data.get('summary'):
            candidate.bio = parsed_data['summary']
        if not candidate.headline and candidate.parsed_experience:
            first_role = candidate.parsed_experience[0].get('role') or candidate.parsed_experience[0].get('title')
            if first_role:
                candidate.headline = first_role
        
        candidate.save()

        profile_data = CandidateProfileSerializer(candidate).data

        return Response(
            {
                "message": "Resume uploaded and analyzed successfully.",
                **profile_data,
                "validation": candidate.resume_validation
            },
            status=status.HTTP_200_OK
        )


class AdminUserListView(generics.ListAPIView):
    """FR-20: Admin user management list."""
    queryset = User.objects.all().order_by('-created_at')
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsAdmin]


class AdminUserDetailView(generics.RetrieveUpdateAPIView):
    """FR-20: Admin user update & deactivation."""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsAdmin]
