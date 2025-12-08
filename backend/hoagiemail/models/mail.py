from django.db import models
from models import User


class ScheduledEmail(models.Model):
    custom_sender_name = models.CharField(blank=True, max_length=30) # If blank, use sender.name
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    header_text = models.CharField(max_length=150)
    body_text = models.CharField(max_length=2000)
    scheduled_at = models.DateTimeField(db_index=True)
    created_at = models.DateTimeField()

    def get_sender_name(self) -> str:
        return self.custom_sender_name if self.custom_sender_name else self.sender.get_full_name()