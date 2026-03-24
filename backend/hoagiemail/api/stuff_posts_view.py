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

		category = request.query_params.get("category")

		try:
			queryset = StuffPost.objects.filter(category__name=category) if category else StuffPost.objects.all()
			stuff_posts = queryset[offset : offset + limit] if offset and limit else queryset[:limit]
			if not stuff_posts:
				return Response([], status=status.HTTP_200_OK)

			serializer = StuffPostSerializer(stuff_posts, many=True)

			return Response(serializer.data, status=status.HTTP_200_OK)
		except StuffPost.DoesNotExist:
			return Response([], status=status.HTTP_200_OK)
		except Exception as e:
			logger.error(f"Unexpected error retrieving posts: {e}")

			return Response(
				{"error": f"Unexpected error retrieving posts: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
			)
