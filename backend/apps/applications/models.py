from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.core.exceptions import ValidationError


class Application(models.Model):
    """Job application submitted by a candidate."""

    class ApplicationStatus(models.TextChoices):
        APPLIED = 'APPLIED', 'Applied'
        REVIEWING = 'REVIEWING', 'Under Review'
        SHORTLISTED = 'SHORTLISTED', 'Shortlisted'
        INTERVIEW_SCHEDULED = 'INTERVIEW_SCHEDULED', 'Interview Scheduled'
        REJECTED = 'REJECTED', 'Rejected'
        HIRED = 'HIRED', 'Hired'
        WITHDRAWN = 'WITHDRAWN', 'Withdrawn'

    # Authoritative finite-state transition map
    VALID_TRANSITIONS = {
        ApplicationStatus.APPLIED: [ApplicationStatus.REVIEWING, ApplicationStatus.REJECTED, ApplicationStatus.WITHDRAWN],
        ApplicationStatus.REVIEWING: [ApplicationStatus.SHORTLISTED, ApplicationStatus.REJECTED, ApplicationStatus.WITHDRAWN],
        ApplicationStatus.SHORTLISTED: [ApplicationStatus.INTERVIEW_SCHEDULED, ApplicationStatus.REJECTED],
        ApplicationStatus.INTERVIEW_SCHEDULED: [ApplicationStatus.HIRED, ApplicationStatus.REJECTED],
        ApplicationStatus.REJECTED: [],  # Terminal state
        ApplicationStatus.HIRED: [],     # Terminal state
        ApplicationStatus.WITHDRAWN: [], # Terminal state
    }

    job = models.ForeignKey(
        'jobs.Job',
        on_delete=models.CASCADE,
        related_name='applications',
        db_index=True
    )
    candidate = models.ForeignKey(
        'accounts.Candidate',
        on_delete=models.CASCADE,
        related_name='applications',
        db_index=True
    )
    resume_snapshot = models.JSONField(
        default=dict,
        help_text='Frozen snapshot of the candidate parsed resume at time of evaluation.'
    )
    status = models.CharField(
        max_length=25,
        choices=ApplicationStatus.choices,
        default=ApplicationStatus.APPLIED,
        db_index=True
    )
    applied_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Application'
        verbose_name_plural = 'Applications'
        ordering = ['-applied_at']
        constraints = [
            models.UniqueConstraint(
                fields=['job', 'candidate'],
                name='unique_candidate_job_application'
            )
        ]
        indexes = [
            models.Index(fields=['job', 'status'], name='idx_app_job_status'),
            models.Index(fields=['candidate', 'status'], name='idx_app_cand_status'),
        ]

    def __str__(self):
        return f"{self.candidate.user.email} -> {self.job.title} ({self.status})"

    def clean(self):
        super().clean()
        if self.pk:
            current_instance = Application.objects.get(pk=self.pk)
            old_status = current_instance.status
            new_status = self.status
            if old_status != new_status:
                allowed_next_states = self.VALID_TRANSITIONS.get(old_status, [])
                if new_status not in allowed_next_states:
                    raise ValidationError({
                        'status': f"Illegal status transition from '{old_status}' to '{new_status}'."
                    })

    def save(self, *args, **kwargs):
        is_new = self.pk is None
        self.full_clean()
        super().save(*args, **kwargs)
        if is_new:
            ApplicationStatusHistory.objects.create(
                application=self,
                status=self.status
            )


class ApplicationStatusHistory(models.Model):
    """Tracks the history of status changes for an application."""
    application = models.ForeignKey(
        Application,
        on_delete=models.CASCADE,
        related_name='status_history'
    )
    status = models.CharField(
        max_length=25,
        choices=Application.ApplicationStatus.choices
    )
    changed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Application Status History'
        verbose_name_plural = 'Application Status Histories'
        ordering = ['changed_at']

    def __str__(self):
        return f"{self.application.id} -> {self.status} at {self.changed_at}"


class AIAnalysis(models.Model):
    """Explainable AI match analysis for a job application."""

    application = models.OneToOneField(
        Application,
        on_delete=models.CASCADE,
        related_name='ai_analysis'
    )
    overall_match_score = models.FloatField(
        validators=[MinValueValidator(0.0), MaxValueValidator(100.0)],
        db_index=True,
        help_text='Weighted composite score (0-100%)'
    )
    semantic_similarity_score = models.FloatField(
        validators=[MinValueValidator(0.0), MaxValueValidator(100.0)],
        help_text='Dense embedding similarity (60% weight)'
    )
    skill_match_score = models.FloatField(
        validators=[MinValueValidator(0.0), MaxValueValidator(100.0)],
        help_text='Skill overlap percentage (30% weight)'
    )
    experience_match_score = models.FloatField(
        validators=[MinValueValidator(0.0), MaxValueValidator(100.0)],
        help_text='Experience fit percentage (10% weight)'
    )
    matched_skills = models.JSONField(default=list, blank=True)
    missing_skills = models.JSONField(default=list, blank=True)
    experience_match_summary = models.TextField(blank=True)
    explanation = models.JSONField(
        default=dict,
        blank=True,
        help_text='Structured explanation payload with score breakdown'
    )
    model_name = models.CharField(max_length=100, default='all-MiniLM-L6-v2')
    model_version = models.CharField(max_length=50, default='1.0.0')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'AI Analysis'
        verbose_name_plural = 'AI Analyses'
        ordering = ['-overall_match_score']

    def __str__(self):
        return f"Analysis for App #{self.application_id}: {self.overall_match_score}%"
