from django.db import models
from django.core.validators import MinValueValidator


class Job(models.Model):
    """Job posting entity."""

    class JobType(models.TextChoices):
        FULL_TIME = 'FULL_TIME', 'Full Time'
        PART_TIME = 'PART_TIME', 'Part Time'
        REMOTE = 'REMOTE', 'Remote'
        INTERN = 'INTERN', 'Internship'

    class JobStatus(models.TextChoices):
        DRAFT = 'DRAFT', 'Draft'
        OPEN = 'OPEN', 'Open'
        PAUSED = 'PAUSED', 'Paused'
        CLOSED = 'CLOSED', 'Closed'

    company = models.ForeignKey(
        'companies.Company',
        on_delete=models.PROTECT,
        related_name='jobs'
    )
    recruiter = models.ForeignKey(
        'accounts.Recruiter',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='managed_jobs'
    )
    title = models.CharField(max_length=200, db_index=True)
    description = models.TextField()
    department = models.CharField(max_length=100, blank=True)
    location = models.CharField(max_length=150)
    job_type = models.CharField(
        max_length=20,
        choices=JobType.choices,
        default=JobType.FULL_TIME
    )
    experience_min_years = models.IntegerField(
        default=0,
        validators=[MinValueValidator(0)]
    )
    required_skills = models.JSONField(default=list, blank=True)
    preferred_skills = models.JSONField(default=list, blank=True)
    status = models.CharField(
        max_length=20,
        choices=JobStatus.choices,
        default=JobStatus.OPEN,
        db_index=True
    )
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Job'
        verbose_name_plural = 'Jobs'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status'], name='idx_job_status'),
            models.Index(fields=['created_at'], name='idx_job_created_at'),
            models.Index(fields=['title'], name='idx_job_title'),
        ]

    def __str__(self):
        return f"{self.title} at {self.company.name} ({self.status})"

    @property
    def is_open(self):
        return self.status == self.JobStatus.OPEN
