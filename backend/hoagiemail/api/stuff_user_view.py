import logging
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from hoagiemail.models import StuffPost

class ModelSerializer(serializers.ModelSerializer):
	title = serializers.CharField(
		max_length=100,
		min_length=3,
		error_messages={
			"blank": "Title cannot be blank.",
			"min_length": "Title must be at least 3 characters.",
			"max_length": "Title must be at most 100 characters.",
		},
	)
	description = serializers.CharField(
		max_length=1000,
		min_length=3,
		error_messages={
			"blank": "Description cannot be blank.",
			"min_length": "Description must be at least 3 characters.",
			"max_length": "Description must be at most 1000 characters.",
		},
	)
	thumbnail_url = serializers.URLField(
		required=False,
		allow_blank=True,
		error_messages={
			"invalid": "Invalid thumbnail URL.",
		},
	)
	category = serializers.CharField(
		max_length=100,
		error_messages={
			"blank": "Category cannot be blank.",
			"max_length": "Category must be at most 100 characters."
		},
	)
	link_url = serializers.URLField(
		required=False,
		allow_blank=True,
		error_messages={
			"invalid": "Invalid link URL.",
		},
	)
	tags = serializers.CharField(
		max_length=200,
		required=False,
		allow_blank=True,
		error_messages={
			"max_length": "Tags must be at most 200 characters.",
		},
	)
	class Meta:
		model = StuffPost
		fields = [
			'id', 'author', 'title', 'description', 'thumbnail_url',
			'category', 'link_url', 'tags', 'has_sent', 'created_at'
		]
		read_only_fields = ['id', 'author', 'has_sent', 'created_at']
		
logger = logging.getLogger(__name__)

class StuffUserView(APIView):
	def get(self, request) -> Response:
		return Response({"status": "OK", "message": "Stuff posts retrieved successfully"}, status=status.HTTP_200_OK)
		
	def post(self, request) -> Response:
		# Logic to make a post
		user = request.user
		try:
			if StuffPost.objects.filter(author=user).exists():
				logger.error(f"Stuff post already exists for {user.email}")
				return Response(
					{"error": "You already have a post."},
					status=status.HTTP_400_BAD_REQUEST
				)	
			StuffPost.objects.create(author=user, title=request.data.get("title"), description=request.data.get("description"), thumbnail_url=request.data.get("thumbnail_url"), category=request.data.get("category"), link_url=request.data.get("link_url"), tags=request.data.get("tags"), has_sent=False, created_at=timezone.now())
			return Response({"status": "OK", "message": "Post made successfully"}, status=status.HTTP_200_OK)
		except ValidationError as e:
			logger.error(f"Stuff post not created for {user.email}")
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