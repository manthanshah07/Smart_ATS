from django.db import transaction
from .matcher import ExplainableMatcher
from apps.applications.models import AIAnalysis

class AIPipelineService:
    """Orchestrates end-to-end resume evaluation and application scoring."""

    @classmethod
    def evaluate_application(cls, application):
        """
        Execute full evaluation pipeline for a submitted application.
        This calculates the AI score and persists the AIAnalysis.
        If an AIAnalysis already exists for this application, it updates it.
        """
        candidate = application.candidate
        job = application.job

        # Calculate scores
        results = ExplainableMatcher.calculate_match(candidate, job)

        with transaction.atomic():
            analysis, created = AIAnalysis.objects.update_or_create(
                application=application,
                defaults=results
            )
        
        return analysis
