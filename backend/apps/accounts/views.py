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


class CandidateResumeUploadView(APIView):
    """FR-6: Candidate resume upload contract endpoint."""
    permission_classes = [IsAuthenticated, IsCandidate]

    def post(self, request):
        return Response(
            {"message": "Resume upload contract ready. AI parsing pipeline will attach in Phase 5."},
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
