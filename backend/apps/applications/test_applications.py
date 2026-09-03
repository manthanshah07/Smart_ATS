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
