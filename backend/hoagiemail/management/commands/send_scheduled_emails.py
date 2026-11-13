import logging

from django.core.management.base import BaseCommand

from hoagiemail.scripts.scheduled_mail_script import scheduled_mail_script

logger = logging.getLogger(__name__)


class Command(BaseCommand):
	help = "Send scheduled emails"

	def handle(self, *args, **options):
		try:
			scheduled_mail_script()
		except Exception as e:
			logger.error(f"Unexpected error running scheduled mail script: {str(e)}")
