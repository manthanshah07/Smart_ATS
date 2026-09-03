from django.db import models


class Interview(models.Model):
    """Interview scheduling entity tied to an application."""

    class InterviewType(models.TextChoices):
        TECHNICAL = 'TECHNICAL', 'Technical Interview'
        HR = 'HR', 'HR Interview'
        BEHAVIORAL = 'BEHAVIORAL', 'Behavioral Interview'

    class InterviewStatus(models.TextChoices):
        SCHEDULED = 'SCHEDULED', 'Scheduled'
        COMPLETED = 'COMPLETED', 'Completed'
        CANCELLED = 'CANCELLED', 'Cancelled'
        RESCHEDULED = 'RESCHEDULED', 'Rescheduled'

    application = models.OneToOneField(
        'applications.Application',
        on_delete=models.CASCADE,
        related_name='interview'
    )
    scheduled_time = models.DateTimeField(db_index=True)
    duration_minutes = models.IntegerField(default=45)
    interview_type = models.CharField(
        max_length=20,
        choices=InterviewType.choices,
        default=InterviewType.TECHNICAL
    )
    meeting_link_or_location = models.CharField(max_length=500)
    status = models.CharField(
        max_length=20,
        choices=InterviewStatus.choices,
        default=InterviewStatus.SCHEDULED,
        db_index=True
    )
    feedback = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Interview'
        verbose_name_plural = 'Interviews'
        ordering = ['scheduled_time']

    def __str__(self):
        return f"{self.interview_type} Interview for App #{self.application_id} on {self.scheduled_time}"
