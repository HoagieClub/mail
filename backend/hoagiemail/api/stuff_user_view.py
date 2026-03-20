import logging

from hoagiemail.serializers import StuffPostSerializer
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from hoagiemail.models import StuffPost

logger = logging.getLogger(__name__)


class StuffUserView(APIView):
	def get(self, request) -> Response:
		# return a user's stuff post, if one exists
		user = request.user
		try:
			post = StuffPost.objects.get(author=user)
			serializer = StuffPostSerializer(post)
			return Response(serializer.data, status=status.HTTP_200_OK)

		except StuffPost.DoesNotExist:
			logger.error(f"No stuff post found for {user.email}")
			return Response(
				{"error": "You do not have a stuff post yet."},
				status=status.HTTP_404_NOT_FOUND,
			)

		except Exception as e:
			logger.error(f"Error retrieving stuff post for {user.email}: {e}")
			return Response(
				{"error": "Unexpected error retrieving stuff post."},
				status=status.HTTP_500_INTERNAL_SERVER_ERROR,
			)

	def post(self, request) -> Response:
		# Logic to make a post
		return Response({"status": "OK", "message": "Post made successfully"}, status=status.HTTP_200_OK)

	def delete(self, request) -> Response:
		# Logic to delete a post
		return Response({"status": "OK", "message": "Post deleted successfully"}, status=status.HTTP_200_OK)
