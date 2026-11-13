from django.db import models

from .user import User


class ScheduledEmail(models.Model):
	sender = models.CharField(blank=True, max_length=30)  # If blank, use sender.name
	user = models.ForeignKey(User, on_delete=models.CASCADE)
	header = models.CharField(max_length=150)
	body = models.TextField()
	schedule = models.DateTimeField(db_index=True)
	createdAt = models.DateTimeField(auto_now_add=True)

	def get_sender_name(self) -> str:
		return self.sender if self.sender else self.user.get_full_name()

	class Meta:
		db_table = "ScheduledEmail"
