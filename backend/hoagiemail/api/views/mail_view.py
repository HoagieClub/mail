from datetime import datetime, timedelta, timezone
from zoneinfo import ZoneInfo

import bleach
from bleach.css_sanitizer import CSSSanitizer
from django.conf import settings
from mailjet_rest import Client
from rest_framework import serializers, status
from rest_framework.response import Response
from rest_framework.views import APIView

from hoagiemail.models import ScheduledEmail


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


# Bleach configuration
ALLOWED_TAGS = [
	"a",
	"b",
	"blockquote",
	"br",
	"code",
	"div",
	"del",
	"em",
	"h1",
	"h2",
	"h3",
	"h4",
	"h5",
	"h6",
	"hr",
	"i",
	"img",
	"li",
	"ol",
	"p",
	"pre",
	"span",
	"strong",
	"table",
	"tbody",
	"td",
	"th",
	"thead",
	"tr",
	"ul",
]
ALLOWED_ATTRIBUTES = {
	"*": ["class", "style"],
	"a": ["href", "title", "target"],
	"img": ["src", "alt", "width", "height"],
	"table": ["border", "cellpadding", "cellspacing"],
	"td": ["colspan", "rowspan"],
	"th": ["colspan", "rowspan"],
}
SAFE_CSS_PROPERTIES = [
	"width",
	"height",
	"color",
	"background-color",
	"font-size",
	"margin-left",
	"text-align",
	"font-family",
	"line-height",
]

NORMAL_EMAIL_FOOTER = (
	"<hr />"
	'<div style="font-size:8pt;">This email was instantly sent to all '
	'college listservs with <a href="https://mail.hoagie.io/">Hoagie Mail</a>. '
	"Email composed by %s (%s) — if you believe this email is offensive, "
	"intentionally misleading or harmful, please report it to "
	'<a href="mailto:hoagie@princeton.edu">hoagie@princeton.edu</a>.</div>'
)

TEST_EMAIL_FOOTER = (
	"<hr />"
	'<div style="font-size:8pt;">This test email was instantly sent only '
	'to you with <a href="https://mail.hoagie.io/">Hoagie Mail</a>. '
	"Email composed by %s (%s).</div>"
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


def create_message(mail_data, to_email):
	"""Creates mailjet message structure"""
	return {
		"From": {"Email": "hoagie@princeton.edu", "Name": mail_data["sender"]},
		"ReplyTo": {"Email": mail_data["email"], "Name": mail_data["sender"]},
		"To": [{"Email": to_email, "Name": mail_data["sender"]}],
		"Subject": mail_data["header"],
		"TextPart": mail_data["body"],
		"HTMLPart": mail_data["body"],
		"CustomID": "HoagieMail",
	}


def print_debug(message, schedule=None):
	"""Prints email contents for debugging purposes"""
	print("DEBUG - Email:")
	print(f"From: {message['From']['Name']} <{message['From']['Email']}>")
	print(f"To: {message['To'][0]['Email']}")
	print(f"Subject: {message['Subject']}")
	print(f"Body: {message['TextPart']}")
	if "Cc" in message:
		print("CC:")
		for cc in message["Cc"]:
			print(f"    {cc['Name']} <{cc['Email']}>")
	if schedule:
		print(f"Scheduled for: {schedule} Eastern Time")


def send_email(mail_data, user):
	"""Sends email using Mailjet API"""
	if mail_data["schedule"] != "test":
		message = create_message(mail_data, "hoagie@princeton.edu")
		message["Cc"] = get_listservs()
	else:
		message = create_message(mail_data, mail_data["email"])

	# In debug mode, print email contents instead of sending
	if settings.DEBUG:
		print_debug(message)
		return

	# Send email via Mailjet
	mailjet = Client(auth=("your_mailjet_api_key", "your_mailjet_secret_key"), version="v3.1")
	result = mailjet.send.create(data=message)

	result_status = result.status_code
	if result_status == 200:
		return
	else:
		error_data = result.json()
		messages = error_data.get("Messages", [])
		if messages and "Errors" in messages[0]:
			return messages[0]["Errors"]
		return error_data.get("ErrorMessage", "Unknown error")


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
	schedule_time_et = schedule_time.astimezone(ZoneInfo("America/New_York"))

	# Check if already scheduled mail at this time for this user
	if ScheduledEmail.objects.filter(sender=user, scheduled_at=schedule_time_et).exists():
		return "You already have an email scheduled for this time. If you would like to change your message, please \
			delete your mail in the Scheduled Emails page and try again."

	message = create_message(mail_data, mail_data["email"])

	if settings.DEBUG:
		print_debug(message, schedule=schedule_time_et)
		return

	# Create scheduled email
	ScheduledEmail.objects.create(
		sender=user,
		custom_sender_name=mail_data["sender"],
		header_text=mail_data["header"],
		body_text=mail_data["body"],
		scheduled_at=schedule_time_et,
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
	return send_email(mail_data, user)


class MailView(APIView):
	def post(self, request) -> Response:
		user = request.user
		serializer = MailRequestSerializer(data=request.data)

		# Validate request data
		serializer = MailRequestSerializer(data=request.data)
		if not serializer.is_valid():
			print(serializer.errors)

			# Get the first error message string
			first_field = next(iter(serializer.errors))
			error = str(serializer.errors[first_field][0])
			return Response({"error": error}, status=status.HTTP_400_BAD_REQUEST)

		mail_data = serializer.validated_data
		print("Original mail_data:", mail_data)
		mail_data["email"] = user.email

		# Sanitize HTML body
		css_sanitizer = CSSSanitizer(allowed_css_properties=SAFE_CSS_PROPERTIES)
		mail_data["body"] = bleach.clean(
			mail_data["body"],
			tags=ALLOWED_TAGS,
			attributes=ALLOWED_ATTRIBUTES,
			css_sanitizer=css_sanitizer,
			strip=True,
		)

		print("Sanitized mail_data:", mail_data)

		# Handle scheduled vs immediate email
		error = ""
		if mail_data["schedule"] != "now" and mail_data["schedule"] != "test":
			error = handle_scheduled_email(mail_data, user)
		else:
			error = handle_email_now(mail_data, user)

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
		return Response({"status": "OK", "message": "Scheduled mail deleted successfully"}, status=status.HTTP_200_OK)
