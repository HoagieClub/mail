import logging

from rest_framework import status
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from hoagiemail.api.stuff_user_view import StuffPostSerializer
from hoagiemail.models import StuffPost

logger = logging.getLogger(__name__)


class StuffPostsView(APIView):
	def get(self, request: Request) -> Response:
		limit = request.query_params.get("limit")
		if limit:
			try:
				limit = int(limit)
			except ValueError:
				limit = None

		offset = request.query_params.get("offset")
		if offset:
			try:
				offset = int(offset)
			except ValueError:
				offset = None

		try:
			stuff_posts = StuffPost.objects.all()[offset:limit]
			if not stuff_posts:
				return Response({"mail": None}, status=status.HTTP_200_OK)
			
			seralizer = StuffPostSerializer(stuff_posts, many=True)

			return Response({"mail": seralizer.data})
		except StuffPost.DoesNotExist:
			return Response({"mail": None})
		except Exception as e:
			logger.error(f"Unexpected error retrieving posts: {e}")

			return Response({"error": f"Unexpected error retrieving posts: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
