from django.db import models


class Notification(models.Model):
    """In-app notification entity."""

    class NotificationType(models.TextChoices):
        APPLICATION_STATUS = 'APPLICATION_STATUS', 'Application Status Update'
        NEW_APPLICATION = 'NEW_APPLICATION', 'New Application Received'
        INTERVIEW_SCHEDULED = 'INTERVIEW_SCHEDULED', 'Interview Scheduled'
        SYSTEM = 'SYSTEM', 'System Alert'

    user = models.ForeignKey(
        'accounts.User',
        on_delete=models.CASCADE,
        related_name='notifications',
        db_index=True
    )
    title = models.CharField(max_length=200)
    message = models.TextField()
    notification_type = models.CharField(
        max_length=30,
        choices=NotificationType.choices,
        default=NotificationType.SYSTEM
    )
    link_url = models.CharField(max_length=255, blank=True)
    is_read = models.BooleanField(default=False, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        verbose_name = 'Notification'
        verbose_name_plural = 'Notifications'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'is_read'], name='idx_notif_user_read'),
            models.Index(fields=['created_at'], name='idx_notif_created_at'),
        ]

    def __str__(self):
        return f"Notification for {self.user.email}: {self.title}"
