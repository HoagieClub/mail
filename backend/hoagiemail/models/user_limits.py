from django.db import models

from .user import User


class UserLimits(models.Model):
	user = models.OneToOneField(User, on_delete=models.CASCADE)
	last_send_now = models.DateTimeField(blank=True, null=True)
	last_test_email = models.DateTimeField(blank=True, null=True)

	class Meta:
		db_table = "UserLimits"
