from django.urls import reverse
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.core import mail
from rest_framework import status
from rest_framework.test import APITestCase, APIClient

from apps.accounts.models import User, Candidate, Recruiter
from apps.companies.models import Company
from apps.jobs.models import Job


class AuthenticationTests(APITestCase):
    """Mandatory test suite for Phase 2 authentication, RBAC, and token workflows."""

    def setUp(self):
        self.client = APIClient()
        self.candidate_email = "candidate@example.com"
        self.recruiter_email = "recruiter@example.com"
        self.admin_email = "admin@example.com"
        self.password = "StrongPass123!@#"

        # Seed test candidate
        self.candidate_user = User.objects.create_user(
            email=self.candidate_email,
            password=self.password,
            first_name="Jane",
            last_name="Candidate",
            role=User.Role.CANDIDATE
        )
        self.candidate_profile = Candidate.objects.create(
            user=self.candidate_user,
            headline="Full-Stack Python Developer"
        )

        # Seed test recruiter with company
        self.company = Company.objects.create(name="Acme Corp")
        self.recruiter_user = User.objects.create_user(
            email=self.recruiter_email,
            password=self.password,
            first_name="Bob",
            last_name="Recruiter",
            role=User.Role.RECRUITER
        )
        self.recruiter_profile = Recruiter.objects.create(
            user=self.recruiter_user,
            company=self.company,
            designation="Talent Lead"
        )

        # Seed second recruiter (for object-level permission tests)
        self.company_b = Company.objects.create(name="Beta LLC")
        self.recruiter_user_b = User.objects.create_user(
            email="recruiter_b@example.com",
            password=self.password,
            first_name="Alice",
            last_name="RecruiterB",
            role=User.Role.RECRUITER
        )
        self.recruiter_profile_b = Recruiter.objects.create(
            user=self.recruiter_user_b,
            company=self.company_b
        )

        # Seed test admin
        self.admin_user = User.objects.create_superuser(
            email=self.admin_email,
            password=self.password,
            first_name="Super",
            last_name="Admin"
        )

    # 1. Candidate registration succeeds
    def test_01_candidate_registration_succeeds(self):
        url = reverse('auth_register')
        data = {
            "email": "newcandidate@example.com",
            "password": "SecurePassword123!",
            "password_confirm": "SecurePassword123!",
            "first_name": "New",
            "last_name": "Candidate",
            "role": "CANDIDATE"
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(email="newcandidate@example.com").exists())
        user = User.objects.get(email="newcandidate@example.com")
        self.assertTrue(Candidate.objects.filter(user=user).exists())
        self.assertNotIn("password", response.data)

    # 2. Recruiter registration succeeds
    def test_02_recruiter_registration_succeeds(self):
        url = reverse('auth_register')
        data = {
            "email": "newrecruiter@example.com",
            "password": "SecurePassword123!",
            "password_confirm": "SecurePassword123!",
            "first_name": "New",
            "last_name": "Recruiter",
            "role": "RECRUITER"
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(email="newrecruiter@example.com").exists())
        user = User.objects.get(email="newrecruiter@example.com")
        self.assertTrue(Recruiter.objects.filter(user=user).exists())

    # 3. Admin public registration is rejected
    def test_03_admin_public_registration_rejected(self):
        url = reverse('auth_register')
        data = {
            "email": "fakeadmin@example.com",
            "password": "SecurePassword123!",
            "password_confirm": "SecurePassword123!",
            "first_name": "Hacker",
            "last_name": "Admin",
            "role": "ADMIN"
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(User.objects.filter(email="fakeadmin@example.com").exists())

    # 4. Duplicate email is rejected
    def test_04_duplicate_email_rejected(self):
        url = reverse('auth_register')
        data = {
            "email": self.candidate_email,
            "password": "SecurePassword123!",
            "password_confirm": "SecurePassword123!",
            "first_name": "Duplicate",
            "last_name": "User",
            "role": "CANDIDATE"
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    # 5. Weak / mismatched password is rejected
    def test_05_weak_and_mismatched_password_rejected(self):
        url = reverse('auth_register')
        # Mismatched password
        data_mismatch = {
            "email": "testpass@example.com",
            "password": "SecurePassword123!",
            "password_confirm": "DifferentPassword123!",
            "first_name": "Test",
            "last_name": "User",
            "role": "CANDIDATE"
        }
        res_mismatch = self.client.post(url, data_mismatch, format='json')
        self.assertEqual(res_mismatch.status_code, status.HTTP_400_BAD_REQUEST)

        # Short / weak password
        data_weak = {
            "email": "testweak@example.com",
            "password": "123",
            "password_confirm": "123",
            "first_name": "Test",
            "last_name": "User",
            "role": "CANDIDATE"
        }
        res_weak = self.client.post(url, data_weak, format='json')
        self.assertEqual(res_weak.status_code, status.HTTP_400_BAD_REQUEST)

    # 6. Login succeeds with valid credentials
    def test_06_login_succeeds_with_valid_credentials(self):
        url = reverse('token_obtain_pair')
        data = {
            "email": self.candidate_email,
            "password": self.password
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)
        self.assertEqual(response.data["user"]["email"], self.candidate_email)
        self.assertEqual(response.data["user"]["role"], "CANDIDATE")

    # 7. Login fails with invalid credentials
    def test_07_login_fails_with_invalid_credentials(self):
        url = reverse('token_obtain_pair')
        data = {
            "email": self.candidate_email,
            "password": "WrongPassword!999"
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    # 8. Deactivated user cannot authenticate
    def test_08_deactivated_user_cannot_authenticate(self):
        deactivated_user = User.objects.create_user(
            email="inactive@example.com",
            password=self.password,
            role=User.Role.CANDIDATE,
            is_active=False
        )
        url = reverse('token_obtain_pair')
        data = {
            "email": "inactive@example.com",
            "password": self.password
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    # 9. /auth/me requires authentication
    def test_09_current_user_me_endpoint_requires_auth(self):
        url = reverse('auth_me')
        unauthenticated_response = self.client.get(url)
        self.assertEqual(unauthenticated_response.status_code, status.HTTP_401_UNAUTHORIZED)

        # Authenticate as candidate
        self.client.force_authenticate(user=self.candidate_user)
        auth_response = self.client.get(url)
        self.assertEqual(auth_response.status_code, status.HTTP_200_OK)
        self.assertEqual(auth_response.data["email"], self.candidate_email)
        self.assertEqual(auth_response.data["role"], "CANDIDATE")
        self.assertIsNotNone(auth_response.data.get("profile"))
        self.assertNotIn("password", auth_response.data)

    # 10. Candidate cannot access recruiter-only endpoint
    def test_10_candidate_cannot_access_recruiter_endpoint(self):
        self.client.force_authenticate(user=self.candidate_user)
        url = reverse('recruiter_company')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # 11. Recruiter cannot access admin-only endpoint
    def test_11_recruiter_cannot_access_admin_endpoint(self):
        self.client.force_authenticate(user=self.recruiter_user)
        url = reverse('admin_users_list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # 12. Admin can access admin endpoint
    def test_12_admin_can_access_admin_endpoint(self):
        self.client.force_authenticate(user=self.admin_user)
        url = reverse('admin_users_list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    # 13. Candidate cannot access another candidate's private profile
    def test_13_candidate_cannot_access_other_candidate_profile(self):
        other_user = User.objects.create_user(
            email="other@example.com",
            password=self.password,
            role=User.Role.CANDIDATE
        )
        Candidate.objects.create(user=other_user, headline="Other Profile")

        # Candidate user gets ONLY their own profile at /candidate/profile/
        self.client.force_authenticate(user=self.candidate_user)
        url = reverse('candidate_profile')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["headline"], "Full-Stack Python Developer")

    # 14. Recruiter cannot modify another recruiter's job
    def test_14_recruiter_cannot_modify_other_recruiter_job(self):
        # Create job belonging to recruiter_user (Acme Corp)
        job_a = Job.objects.create(
            company=self.company,
            recruiter=self.recruiter_profile,
            title="Backend Lead",
            description="Acme Job description",
            location="Remote"
        )

        # Authenticate as recruiter_user_b (Beta LLC)
        self.client.force_authenticate(user=self.recruiter_user_b)
        url = reverse('job_detail', kwargs={'pk': job_a.pk})
        patch_data = {"title": "Hacked Title"}
        response = self.client.patch(url, patch_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # 15. JWT refresh works
    def test_15_jwt_token_refresh(self):
        login_url = reverse('token_obtain_pair')
        login_res = self.client.post(login_url, {"email": self.candidate_email, "password": self.password}, format='json')
        refresh_token = login_res.data["refresh"]

        refresh_url = reverse('token_refresh')
        response = self.client.post(refresh_url, {"refresh": refresh_token}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)

    # 16. Logout invalidates / blacklists refresh token
    def test_16_logout_blacklists_refresh_token(self):
        login_url = reverse('token_obtain_pair')
        login_res = self.client.post(login_url, {"email": self.candidate_email, "password": self.password}, format='json')
        refresh_token = login_res.data["refresh"]
        access_token = login_res.data["access"]

        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
        logout_url = reverse('auth_logout')
        logout_res = self.client.post(logout_url, {"refresh": refresh_token}, format='json')
        self.assertEqual(logout_res.status_code, status.HTTP_200_OK)

        # Attempting to refresh with the blacklisted token must fail with 401
        self.client.credentials()
        refresh_url = reverse('token_refresh')
        refresh_attempt = self.client.post(refresh_url, {"refresh": refresh_token}, format='json')
        self.assertEqual(refresh_attempt.status_code, status.HTTP_401_UNAUTHORIZED)

    # 17. Password reset request and confirmation
    def test_17_password_reset_flow(self):
        reset_req_url = reverse('password_reset')
        req_res = self.client.post(reset_req_url, {"email": self.candidate_email}, format='json')
        self.assertEqual(req_res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(mail.outbox), 1)
        self.assertIn("SmartATS — Password Reset Request", mail.outbox[0].subject)

        # Generate uid and token as done in the email flow
        uid = urlsafe_base64_encode(force_bytes(self.candidate_user.pk))
        token = default_token_generator.make_token(self.candidate_user)

        new_password = "BrandNewSecurePassword456!"
        confirm_url = reverse('password_reset_confirm')
        confirm_data = {
            "uid": uid,
            "token": token,
            "new_password": new_password,
            "new_password_confirm": new_password
        }
        confirm_res = self.client.post(confirm_url, confirm_data, format='json')
        self.assertEqual(confirm_res.status_code, status.HTTP_200_OK)

        # Login with new password succeeds
        login_url = reverse('token_obtain_pair')
        login_res = self.client.post(login_url, {"email": self.candidate_email, "password": new_password}, format='json')
        self.assertEqual(login_res.status_code, status.HTTP_200_OK)
