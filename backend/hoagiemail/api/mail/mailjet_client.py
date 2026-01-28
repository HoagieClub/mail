import os

from mailjet_rest import Client

mailjet_client = None


def get_mailjet_client():
	"""Returns a Mailjet client instance, or None if credentials are not configured"""
	global mailjet_client

	if mailjet_client is None:
		mailjet_public_key = os.getenv("MAILJET_PUBLIC_KEY")
		mailjet_private_key = os.getenv("MAILJET_PRIVATE_KEY")

		if not mailjet_public_key or not mailjet_private_key:
			raise ValueError("MAILJET_PUBLIC_KEY and MAILJET_PRIVATE_KEY must be set")

		mailjet_client = Client(auth=(mailjet_public_key, mailjet_private_key), version="v3.1")

	return mailjet_client
