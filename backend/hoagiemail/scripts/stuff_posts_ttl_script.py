import logging
from datetime import timedelta

from django.utils import timezone

from hoagiemail.models.stuff import StuffPost

logger = logging.getLogger(__name__)


def stuff_posts_ttl() -> None:
	threshold_time = timezone.now() - timedelta(weeks=2)

	try:
		StuffPost.objects.filter(created_at__lt=threshold_time).delete()
	except Exception as e:
		logging.error(f"Error occurred while deleting expired stuff posts: {e}")
