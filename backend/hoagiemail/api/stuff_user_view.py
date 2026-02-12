from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from hoagiemail.models import StuffPost


class StuffUserView(APIView):
	def get(self, request) -> Response:
		return Response({"status": "OK", "message": "Stuff posts retrieved successfully"}, status=status.HTTP_200_OK)
		
	def post(self, request) -> Response:
		# Logic to make a post
		user = request.user
		try:
			if StuffPost.objects.filter(author=user).exists():
				return Response(
					{"error": "You already have a post."},
					status=status.HTTP_400_BAD_REQUEST
				)	
			StuffPost.objects.create(author=user, title=request.data.get("title"), description=request.data.get("description"), thumbnail_url=request.data.get("thumbnail_url"), category=request.data.get("category"), link_url=request.data.get("link_url"), tags=request.data.get("tags"), has_sent=False, created_at=timezone.now())
			return Response({"status": "OK", "message": "Post made successfully"}, status=status.HTTP_200_OK)
		except ValidationError as e:
			return Response({"error": "Unexpected error creating stuff post."}, status=status.HTTP_400_BAD_REQUEST)

	def delete(self, request) -> Response:
		user = request.user
		try:
			StuffPost.objects.filter(author=user).delete();
			return Response({"Status": "OK"}, status=status.HTTP_200_OK)
		except StuffPost.DoesNotExist:	
			logger.error(f"Stuff post not found for user {user.email}")
			return Response(
				{"error": "You do not have an existing digest message. Please create one first."},
				status=status.HTTP_400_BAD_REQUEST,
			)
		except Exception as e:
			logger.error(f"Unexpected error deleting scheduled post: {str(e)}")
			return Response(
				{"error": "Unexpected error deleting scheduled mail"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
			)