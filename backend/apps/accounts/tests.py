from django.test import SimpleTestCase
from .models import User
from .permissions import IsCandidate, IsRecruiter, IsAdmin


class AccountsArchitectureTests(SimpleTestCase):
    """Verifies user model definition and permission roles."""

    def test_user_roles_defined(self):
        self.assertEqual(User.Role.CANDIDATE, 'CANDIDATE')
        self.assertEqual(User.Role.RECRUITER, 'RECRUITER')
        self.assertEqual(User.Role.ADMIN, 'ADMIN')

    def test_permissions_classes(self):
        candidate_perm = IsCandidate()
        recruiter_perm = IsRecruiter()
        admin_perm = IsAdmin()
        self.assertIsNotNone(candidate_perm)
        self.assertIsNotNone(recruiter_perm)
        self.assertIsNotNone(admin_perm)
