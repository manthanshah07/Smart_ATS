from django.test import SimpleTestCase
from apps.applications.models import Application
from apps.ai_engine.constants import (
    WEIGHT_SEMANTIC_SIMILARITY,
    WEIGHT_SKILL_MATCH,
    WEIGHT_EXPERIENCE_ALIGNMENT,
)


class ApplicationStateMachineTests(SimpleTestCase):
    """Verifies that the authoritative state machine transitions are properly defined."""

    def test_valid_transitions_map(self):
        transitions = Application.VALID_TRANSITIONS
        self.assertIn(Application.ApplicationStatus.REVIEWING, transitions[Application.ApplicationStatus.APPLIED])
        self.assertIn(Application.ApplicationStatus.SHORTLISTED, transitions[Application.ApplicationStatus.REVIEWING])
        self.assertIn(Application.ApplicationStatus.REJECTED, transitions[Application.ApplicationStatus.REVIEWING])
        self.assertIn(Application.ApplicationStatus.INTERVIEW_SCHEDULED, transitions[Application.ApplicationStatus.SHORTLISTED])
        self.assertIn(Application.ApplicationStatus.HIRED, transitions[Application.ApplicationStatus.INTERVIEW_SCHEDULED])
        # Terminal states have no outbound transitions
        self.assertEqual(transitions[Application.ApplicationStatus.REJECTED], [])
        self.assertEqual(transitions[Application.ApplicationStatus.HIRED], [])

    def test_ai_scoring_weights_sum_to_one(self):
        total_weight = WEIGHT_SEMANTIC_SIMILARITY + WEIGHT_SKILL_MATCH + WEIGHT_EXPERIENCE_ALIGNMENT
        self.assertAlmostEqual(total_weight, 1.0, places=5)


from rest_framework.test import APITestCase
from rest_framework import status
from apps.accounts.models import User, Candidate, Recruiter
from apps.companies.models import Company
from apps.jobs.models import Job


class ApplicationDetailRBACSecurityTests(APITestCase):
    """Verifies role-safe access to GET /api/v1/applications/{id}/"""

    def setUp(self):
        self.company_a = Company.objects.create(name="Company A")
        self.company_b = Company.objects.create(name="Company B")

        # Candidate A
        self.user_cand_a = User.objects.create_user(
            email="cand_a@test.com", password="Password123!", role=User.Role.CANDIDATE, first_name="Cand", last_name="A"
        )
        self.candidate_a = Candidate.objects.create(user=self.user_cand_a)

        # Candidate B
        self.user_cand_b = User.objects.create_user(
            email="cand_b@test.com", password="Password123!", role=User.Role.CANDIDATE, first_name="Cand", last_name="B"
        )
        self.candidate_b = Candidate.objects.create(user=self.user_cand_b)

        # Recruiter A (Company A)
        self.user_rec_a = User.objects.create_user(
            email="rec_a@test.com", password="Password123!", role=User.Role.RECRUITER, first_name="Rec", last_name="A"
        )
        self.recruiter_a = Recruiter.objects.create(user=self.user_rec_a, company=self.company_a)

        # Recruiter B (Company B)
        self.user_rec_b = User.objects.create_user(
            email="rec_b@test.com", password="Password123!", role=User.Role.RECRUITER, first_name="Rec", last_name="B"
        )
        self.recruiter_b = Recruiter.objects.create(user=self.user_rec_b, company=self.company_b)

        # Admin
        self.admin_user = User.objects.create_superuser(
            email="admin@test.com", password="Password123!"
        )

        # Job belonging to Company A
        self.job_a = Job.objects.create(
            company=self.company_a,
            recruiter=self.recruiter_a,
            title="Software Engineer",
            job_type="FULL_TIME",
            status="OPEN",
            location="Remote"
        )

        # Application of Candidate A for Job A
        self.app = Application.objects.create(
            job=self.job_a,
            candidate=self.candidate_a,
            status=Application.ApplicationStatus.APPLIED,
            resume_snapshot={"skills": ["Python"]}
        )

    def test_candidate_can_view_own_application(self):
        self.client.force_authenticate(user=self.user_cand_a)
        resp = self.client.get(f'/api/v1/applications/{self.app.id}/')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data['id'], self.app.id)

    def test_other_candidate_cannot_view_application(self):
        self.client.force_authenticate(user=self.user_cand_b)
        resp = self.client.get(f'/api/v1/applications/{self.app.id}/')
        self.assertEqual(resp.status_code, status.HTTP_403_FORBIDDEN)

    def test_recruiter_from_same_company_can_view_application(self):
        self.client.force_authenticate(user=self.user_rec_a)
        resp = self.client.get(f'/api/v1/applications/{self.app.id}/')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data['id'], self.app.id)

    def test_recruiter_from_different_company_cannot_view_application(self):
        self.client.force_authenticate(user=self.user_rec_b)
        resp = self.client.get(f'/api/v1/applications/{self.app.id}/')
        self.assertEqual(resp.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_can_view_any_application(self):
        self.client.force_authenticate(user=self.admin_user)
        resp = self.client.get(f'/api/v1/applications/{self.app.id}/')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data['id'], self.app.id)

    def test_unauthenticated_cannot_view_application(self):
        resp = self.client.get(f'/api/v1/applications/{self.app.id}/')
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)

