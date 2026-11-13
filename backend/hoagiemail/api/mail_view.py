import logging
from datetime import datetime, timedelta, timezone

from django.conf import settings
from rest_framework import serializers, status
from rest_framework.response import Response
from rest_framework.views import APIView

from hoagiemail.email import get_listservs
from hoagiemail.email.limiter import Visitor
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


class ScheduledMailSerializer(serializers.ModelSerializer):
	class Meta:
		model = ScheduledEmail
		fields = ["sender", "header", "body", "schedule", "createdAt"]


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
		user = request.user

		try:
			scheduled_emails = ScheduledEmail.objects.filter(user=user).order_by("schedule")
			if not scheduled_emails:
				return Response({"status": "unused", "scheduledMail": None}, status=status.HTTP_200_OK)

			seralizer = ScheduledMailSerializer(scheduled_emails, many=True)
			return Response({"status": "used", "scheduledMail": seralizer.data}, status=status.HTTP_200_OK)
		except ScheduledEmail.DoesNotExist:
			return Response({"status": "unused", "scheduledMail": None}, status=status.HTTP_200_OK)
		except Exception as e:
			logger.error(f"Unexpected error retrieving email: {str(e)}")

			return Response(
				{"error": "Unexpected error getting scheduled mails", "status": status.HTTP_500_INTERNAL_SERVER_ERROR}
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
			scheduled_email = ScheduledEmail.objects.get(user=user, schedule=schedule_time)
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
	logger.debug(f"ReplyTo: {message['ReplyTo']['Name']} <{message['ReplyTo']['Email']}>")
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
	# Create the message with actual content
	if mail_data["schedule"] != "test":
		actual_message = create_message(mail_data, sender_email, HOAGIE_EMAIL)
		actual_message["Cc"] = get_listservs()
	else:
		actual_message = create_message(mail_data, sender_email, sender_email)

	print_debug(actual_message)

	if not settings.SEND_EMAIL:
		return

	# Send email only to self if not in production
	to_send = actual_message
	if not settings.PROD and mail_data["schedule"] != "test":
		to_send = create_message(mail_data, sender_email, sender_email)

	# Send email via Mailjet
	mailjet = get_mailjet_client()
	result = mailjet.send.create(data={"Messages": [to_send]})

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
	if ScheduledEmail.objects.filter(user=user, schedule=schedule_time).exists():
		return "You already have an email scheduled for this time. If you would like to change your message, please \
			delete your mail in the Scheduled Emails page and try again."

	message = create_message(mail_data, user.email, HOAGIE_EMAIL)
	print_debug(message, schedule=schedule_time)

	# Create scheduled email
	ScheduledEmail.objects.create(
		user=user,
		sender=mail_data["sender"],
		header=mail_data["header"],
		body=mail_data["body"],
		schedule=schedule_time,
	)

	return None


def handle_email_now(mail_data, user):
	is_test = mail_data["schedule"] == "test"

	if settings.SEND_EMAIL:
		visitor = Visitor(user)

		if is_test:
			if not visitor.allow_test_email():
				return "You can only send one test email every 1 minute."
		elif not visitor.allow_instant_email():
			return "You can only send one instant email every 6 hours."

	if is_test:
		mail_data["body"] += TEST_EMAIL_FOOTER % (user.username, user.email)
	else:
		mail_data["body"] += NORMAL_EMAIL_FOOTER % (user.username, user.email)

	# Send the email
	return send_email(mail_data, user.email)
