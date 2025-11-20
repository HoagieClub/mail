from django.db import models
from models.user import User

class ScheduledEmail(models.Model):
    custom_sender_name = models.CharField(blank=True)
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    header_text = models.CharField()
    body_text = models.CharField()
    scheduled_at = models.DateTimeField(db_index=True)
    created_at = models.DateTimeField()

    def get_sender_name(self) -> str:
        return self.custom_sender_name if self.custom_sender_name else self.sender.name
    