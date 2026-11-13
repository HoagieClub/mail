from django.core.management.base import BaseCommand

from hoagiemail.scripts.stuff_posts_ttl_script import stuff_posts_ttl


class Command(BaseCommand):
	help = "Delete stuff posts older than 2 weeks"

	def handle(self, *args, **options):
		stuff_posts_ttl()
