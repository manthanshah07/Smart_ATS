from rest_framework.permissions import BasePermission
from .models import User


class IsCandidate(BasePermission):
    """Allows access only to authenticated users with CANDIDATE role."""

    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role == User.Role.CANDIDATE
        )


class IsRecruiter(BasePermission):
    """Allows access only to authenticated users with RECRUITER role."""

    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role == User.Role.RECRUITER
        )


class IsAdmin(BasePermission):
    """Allows access only to authenticated users with ADMIN role or staff status."""

    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            (request.user.role == User.Role.ADMIN or request.user.is_staff or request.user.is_superuser)
        )


class IsApplicationOwner(BasePermission):
    """Object-level permission allowing candidates to view/manage only their own applications."""

    def has_object_permission(self, request, view, obj):
        if not request.user or not request.user.is_authenticated:
            return False
        if request.user.role == User.Role.ADMIN:
            return True
        return hasattr(obj, 'candidate') and obj.candidate.user == request.user


class IsJobPoster(BasePermission):
    """Object-level permission allowing recruiters to manage only their own posted jobs."""

    def has_object_permission(self, request, view, obj):
        if not request.user or not request.user.is_authenticated:
            return False
        if request.user.role == User.Role.ADMIN:
            return True
        if hasattr(obj, 'recruiter') and obj.recruiter and hasattr(request.user, 'recruiter_profile'):
            return obj.recruiter == request.user.recruiter_profile
        return False
