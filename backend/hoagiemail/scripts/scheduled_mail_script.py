import logging
from datetime import datetime, timedelta, timezone
from zoneinfo import ZoneInfo

from config import settings
from hoagiemail.api.mail_view import HOAGIE_EMAIL, create_message, get_listservs, print_debug
from hoagiemail.email.mailjet_client import get_mailjet_client
from hoagiemail.models import ScheduledEmail

logger = logging.getLogger(__name__)
send_hours = [8, 13, 18]  # 8 AM, 1 PM, and 6 PM ET
grace_period = 10  # minutes to account for Heroku Scheduler not running at exact times
test_email = HOAGIE_EMAIL  # Change to your own email when testing this script


def scheduled_mail_script():
	logger.info("Running scheduled mail script")

	# Current time with grace period because Heroku Scheduler is not exact
	current_time = datetime.now(timezone.utc) + timedelta(minutes=grace_period)
	current_time_et = current_time.astimezone(ZoneInfo("America/New_York"))

	# Get the hour in Eastern Time
	hour = current_time_et.hour

	# Make sure local hour is in the send hours (accounts for daylight savings)
	if hour not in send_hours:
		logger.info("Current hour is not in send hours")
		return

	emails = ScheduledEmail.objects.filter(scheduled_at__lte=current_time)
	mailjet = get_mailjet_client()

	# Send each email and delete if successful, log error if not
	total = 0
	for email in emails:
		logger.info(f"Sending email with ID: {email.id}")
		mail_data = {
			"sender": email.get_sender_name(),
			"header": email.header_text,
			"body": email.body_text,
		}

		# The message that would be sent
		actual_message = create_message(mail_data, email.sender.email, HOAGIE_EMAIL)
		actual_message["Cc"] = get_listservs()
		print_debug(actual_message)

		if not settings.SEND_EMAIL:
			continue

		to_send = actual_message
		# Change recipient if not in production to avoid sending to everyone
		if not settings.PROD:
			to_send = create_message(mail_data, email.sender.email, test_email)

		result = mailjet.send.create(data={"Messages": [to_send]})

		result_status = result.status_code
		if result_status == 200:
			email.delete()
			total += 1
		else:
			error_data = result.json()
			logger.error(f"Error sending email with ID {email.id}: {str(error_data)}")

	if len(emails) == 0:
		logger.info("No emails sent at this time.")
	else:
		logger.info(f"Successfully sent {total}/{len(emails)} emails.")
	logger.info("Finished scheduled mail script")
