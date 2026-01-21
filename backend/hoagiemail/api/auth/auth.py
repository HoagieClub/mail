import jwt
import requests
from django.conf import settings
from jwt.algorithms import RSAAlgorithm
from rest_framework import authentication, exceptions

from hoagiemail.models import User


class Auth0JWTAuthentication(authentication.BaseAuthentication):
	def authenticate(self, request):
		auth_header = request.headers.get("Authorization")

		if not auth_header:
			return None

		if not auth_header.startswith("Bearer "):
			raise exceptions.AuthenticationFailed("Invalid token header")

		token = auth_header.split(" ")[1]
		try:
			# Verify and decode the token
			payload = self.verify_token(token)

			# Get or create user based on Auth0 sub (subject)
			auth0_id = payload["sub"]
			name = payload.get("https://hoagie.io/name", "")
			user, _ = User.objects.get_or_create(
				username=auth0_id.split("|")[2].split("@")[0],
				defaults={
					"email": payload.get("https://hoagie.io/email", ""),
					"first_name": name.split(" ")[0],
					"last_name": name.split(" ")[-1],
				},
			)

			return (user, payload)

		except jwt.ExpiredSignatureError as e:
			raise exceptions.AuthenticationFailed("Token has expired") from e
		except jwt.InvalidTokenError as e:
			raise exceptions.AuthenticationFailed(f"Invalid token: {str(e)}") from e
		except Exception as e:
			raise exceptions.AuthenticationFailed(f"Authentication failed: {str(e)}") from e

	def verify_token(self, token):
		# Get Auth0 public keys
		jwks_url = f"https://{settings.AUTH0_DOMAIN}/.well-known/jwks.json"
		jwks = requests.get(jwks_url).json()

		# Decode token header to get key id
		unverified_header = jwt.get_unverified_header(token)

		# Find the right key
		rsa_key = None
		for key in jwks["keys"]:
			if key["kid"] == unverified_header["kid"]:
				# Convert JWK to PEM format
				rsa_key = RSAAlgorithm.from_jwk(key)
				break

		if rsa_key is None:
			raise exceptions.AuthenticationFailed("Unable to find appropriate key")

		# Verify and decode token
		payload = jwt.decode(
			token,
			rsa_key,
			algorithms=settings.AUTH0_ALGORITHMS,
			audience=settings.AUTH0_AUDIENCE,
			issuer=f"https://{settings.AUTH0_DOMAIN}/",
		)

		return payload
