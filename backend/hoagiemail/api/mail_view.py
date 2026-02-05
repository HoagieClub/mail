import logging
from datetime import datetime, timedelta, timezone
from zoneinfo import ZoneInfo

from django.conf import settings
from rest_framework import serializers, status
from rest_framework.response import Response
from rest_framework.views import APIView

from hoagiemail.email.mailjet_client import get_mailjet_client
from hoagiemail.email.sanitize import sanitize_html
from hoagiemail.models import ScheduledEmail

logger = logging.getLogger(__name__)


class MailRequestSerializer(serializers.Serializer):
	header = serializers.CharField(
		max_length=150,
		min_length=3,
		error_messages={
			"blank": "Email header must be at least 3 characters.",
			"min_length": "Email header must be at least 3 characters.",
			"max_length": "Email header must be less than 150 characters.",
		},
	)
	sender = serializers.CharField(
		max_length=30,
		min_length=3,
		error_messages={
			"blank": "Sender name must be at least 3 characters.",
			"min_length": "Sender name must be at least 3 characters.",
			"max_length": "Sender name must be less than 30 characters.",
		},
	)
	body = serializers.CharField(error_messages={"blank": "Email body cannot be blank."})
	schedule = serializers.CharField()


HOAGIE_EMAIL = "hoagie@princeton.edu"

NORMAL_EMAIL_FOOTER = (
	"<hr />"
	'<div style="font-size:8pt;">This email was instantly sent to all '
	'college listservs with <a href="https://mail.hoagie.io/">Hoagie Mail</a>. '
	"Email composed by %s (%s) — if you believe this email is offensive, "
	"intentionally misleading or harmful, please report it to "
	f'<a href="mailto:{HOAGIE_EMAIL}">{HOAGIE_EMAIL}</a>.</div>'
)

TEST_EMAIL_FOOTER = (
	"<hr />"
	'<div style="font-size:8pt;">This test email was instantly sent only '
	'to you with <a href="https://mail.hoagie.io/">Hoagie Mail</a>. '
	"Email composed by %s (%s).</div>"
)


class MailView(APIView):
	def post(self, request) -> Response:
		user = request.user
		serializer = MailRequestSerializer(data=request.data)
		serializer.is_valid(raise_exception=True)

		mail_data = serializer.validated_data

		# Sanitize HTML body
		mail_data["body"] = sanitize_html(mail_data["body"])

		# Handle scheduled vs immediate email
		error = ""
		try:
			if mail_data["schedule"] != "now" and mail_data["schedule"] != "test":
				error = handle_scheduled_email(mail_data, user)
			else:
				error = handle_email_now(mail_data, user)
		except Exception as e:
			logger.error(f"Unexpected error processing email: {str(e)}")
			return Response(
				{"error": "Unexpected error processing email"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
			)

		if error:
			return Response({"error": error}, status=status.HTTP_400_BAD_REQUEST)

		return Response({"status": "OK", "message": "Mail sent successfully"}, status=status.HTTP_200_OK)

	def get(self, request) -> Response:
		# Logic to get scheduled mails
		return Response(
			{"status": "unused", "message": "Scheduled mails retrieved successfully"}, status=status.HTTP_200_OK
		)

	def put(self, request) -> Response:
		# Logic to update a scheduled mail
		return Response({"status": "OK", "message": "Scheduled mail updated successfully"}, status=status.HTTP_200_OK)

	def delete(self, request) -> Response:
		# Logic to delete a scheduled mail
		user = request.user
		try:
			schedule = request.data["schedule"]
			schedule_time = datetime.fromisoformat(schedule)
			scheduled_email = ScheduledEmail.objects.get(sender=user, scheduled_at=schedule_time)
			scheduled_email.delete()
			return Response(
				{"status": "OK", "message": "Scheduled mail deleted successfully"}, status=status.HTTP_200_OK
			)
		except ScheduledEmail.DoesNotExist:
			logger.error(f"Scheduled mail not found for user {user.email} and scheduled at {schedule}")
			return Response({"error": "Scheduled mail not found"}, status=status.HTTP_404_NOT_FOUND)
		except Exception as e:
			logger.error(f"Unexpected error deleting scheduled mail: {str(e)}")
			return Response(
				{"error": "Unexpected error deleting scheduled mail"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
			)


def get_listservs():
	"""Returns list of college listserv recipients"""
	return [
		{"Email": "BUTLERBUZZ@PRINCETON.EDU", "Name": "Butler"},
		{"Email": "WHITMANWIRE@PRINCETON.EDU", "Name": "Whitman"},
		{"Email": "RockyWire@PRINCETON.EDU", "Name": "Rocky"},
		{"Email": "Re-INNformer@PRINCETON.EDU", "Name": "Forbes"},
		{"Email": "westwire@princeton.edu", "Name": "NCW"},
		{"Email": "matheymail@PRINCETON.EDU", "Name": "Mathey"},
		{"Email": "yehyellowpages@princeton.edu", "Name": "Yeh"},
		{"Email": "hoagiemailgradstudents@princeton.edu", "Name": "hoagiemailgradstudents"},
	]


def create_message(mail_data, sender_email, to_email):
	"""
	Creates mailjet message structure.
	mail_data: serialized mail request from MailRequestSerializer
	sender_email: email address of the sender
	to_email: email address of the recipient
	"""
	return {
		"From": {"Email": HOAGIE_EMAIL, "Name": mail_data["sender"]},
		"ReplyTo": {"Email": sender_email, "Name": mail_data["sender"]},
		"To": [{"Email": to_email, "Name": mail_data["sender"]}],
		"Subject": mail_data["header"],
		"TextPart": mail_data["body"],
		"HTMLPart": mail_data["body"],
		"CustomID": "HoagieMail",
	}


def print_debug(message, schedule=None):
	"""Prints email contents for debugging purposes"""
	logger.debug("Email:")
	logger.debug(f"From: {message['From']['Name']} <{message['From']['Email']}>")
	logger.debug(f"To: {message['To'][0]['Email']}")
	logger.debug(f"Subject: {message['Subject']}")
	logger.debug(f"Body: {message['TextPart']}")
	if "Cc" in message:
		logger.debug("CC:")
		for cc in message["Cc"]:
			logger.debug(f"    {cc['Name']} <{cc['Email']}>")
	if schedule:
		logger.debug(f"Scheduled for: {schedule} Eastern Time")


def send_email(mail_data, sender_email):
	"""Sends email using Mailjet API"""
	if mail_data["schedule"] != "test":
		message = create_message(mail_data, sender_email, HOAGIE_EMAIL)
		message["Cc"] = get_listservs()
	else:
		message = create_message(mail_data, sender_email, sender_email)

	# In debug mode, print email contents instead of sending
	if settings.DEBUG:
		print_debug(message)
		return

	# Send email via Mailjet
	mailjet = get_mailjet_client()
	result = mailjet.send.create(data={"Messages": [message]})

	result_status = result.status_code
	if result_status == 200:
		return
	else:
		error_data = result.json()
		raise Exception(f"Error sending email: {error_data}")


def valid_schedule(schedule):
	try:
		# Parse the schedule string as UTC
		schedule_time = datetime.fromisoformat(schedule)
	except (ValueError, TypeError):
		return False

	# Validate schedule time (compare in UTC)
	current_time = datetime.now(timezone.utc) + timedelta(minutes=1)
	return schedule_time > current_time


def handle_scheduled_email(mail_data, user):
	# Logic to schedule email for later sending
	schedule = mail_data["schedule"]
	if not valid_schedule(schedule):
		return (
			"Your email could not be scheduled at the specified time. Please refresh the page and select a later time."
		)

	schedule_time = datetime.fromisoformat(schedule)

	# Check if already scheduled mail at this time for this user
	if ScheduledEmail.objects.filter(sender=user, scheduled_at=schedule_time).exists():
		return "You already have an email scheduled for this time. If you would like to change your message, please \
			delete your mail in the Scheduled Emails page and try again."

	if settings.DEBUG:
		message = create_message(mail_data, user.email, HOAGIE_EMAIL)
		# Convert to ET for display purposes
		schedule_time_et = schedule_time.astimezone(ZoneInfo("America/New_York"))
		print_debug(message, schedule=schedule_time_et)

	# Create scheduled email
	ScheduledEmail.objects.create(
		sender=user,
		custom_sender_name=mail_data["sender"],
		header_text=mail_data["header"],
		body_text=mail_data["body"],
		scheduled_at=schedule_time,
	)

	return None


def handle_email_now(mail_data, user):
	if not settings.DEBUG:
		# TODO: rate limiting check
		pass

	if mail_data["schedule"] == "test":
		mail_data["body"] += TEST_EMAIL_FOOTER % (user.username, user.email)
	else:
		mail_data["body"] += NORMAL_EMAIL_FOOTER % (user.username, user.email)

	# Send the email
	return send_email(mail_data, user.email)
