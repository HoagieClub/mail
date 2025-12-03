from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView


class StuffPostsView(APIView):
	def get(self, request) -> Response:
		# Logic to get stuff posts
		return Response({"status": "OK", "message": "Posts retrieved successfully"}, status=status.HTTP_200_OK)
