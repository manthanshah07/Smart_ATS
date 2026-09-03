from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import User, Candidate, Recruiter
from .permissions import IsCandidate, IsAdmin
from .serializers import (
    UserRegistrationSerializer,
    UserSerializer,
    CandidateProfileSerializer,
    RecruiterProfileSerializer,
)


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Augments standard JWT token payload with user profile details."""

    def validate(self, attrs):
        data = super().validate(attrs)
        data['user'] = {
            'id': self.user.id,
            'email': self.user.email,
            'first_name': self.user.first_name,
            'last_name': self.user.last_name,
            'role': self.user.role,
        }
        return data


class CustomTokenObtainPairView(TokenObtainPairView):
    """Custom token view returning user details alongside access/refresh tokens."""
    serializer_class = CustomTokenObtainPairSerializer


class RegisterView(generics.CreateAPIView):
    """FR-1: Candidate/Recruiter registration endpoint."""
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]


class PasswordResetRequestView(APIView):
    """FR-4: Password reset request endpoint contract."""
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response(
                {"error": "Email is required."},
                status=status.status.HTTP_400_BAD_REQUEST if hasattr(status, 'status') else status.HTTP_400_BAD_REQUEST
            )
        # Skeleton implementation for Phase 1 contract
        return Response(
            {"message": "If an account with this email exists, password reset instructions have been sent."},
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
        # Full validation & AI pipeline trigger reserved for dedicated phases
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
