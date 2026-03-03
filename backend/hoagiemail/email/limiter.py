from datetime import timedelta
from typing import Final

from django.utils import timezone

from ..models import User, UserLimits


class Visitor:
	SEND_NOW_LIMIT_PERIOD: Final[timedelta] = timedelta(hours=6)
	TEST_EMAIL_LIMIT_PERIOD: Final[timedelta] = timedelta(minutes=1)
	user_limits: UserLimits

	def __init__(self, user: User) -> None:
		self.user_limits = (UserLimits.objects.get_or_create(user=user))[0]

	def allow_instant_email(self) -> bool:
		now = timezone.now()

		if last := self.user_limits.last_send_now:
			if (now - last) < self.SEND_NOW_LIMIT_PERIOD:
				return False

		self.user_limits.last_send_now = now
		self.user_limits.save()

		return True

	def allow_test_email(self) -> bool:
		now = timezone.now()

		if last := self.user_limits.last_test_email:
			if (now - last) < self.TEST_EMAIL_LIMIT_PERIOD:
				return False

		self.user_limits.last_test_email = now
		self.user_limits.save()

		return True
