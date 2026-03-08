import logging

from django.utils import timezone
from rest_framework import serializers, status
from rest_framework.response import Response
from rest_framework.views import APIView

from hoagiemail.models import Category, StuffPost, Tag


class StuffPostSerializer(serializers.ModelSerializer):
	title = serializers.CharField(
		max_length=100,
		min_length=3,
		error_messages={
			"blank": "Title cannot be blank.",
			"min_length": "Title must be at least 3 characters.",
			"max_length": "Title must be at most 100 characters.",
		},
	)
	description_text = serializers.CharField(
		max_length=300,
		min_length=3,
		error_messages={
			"blank": "Description cannot be blank.",
			"min_length": "Description must be at least 3 characters.",
			"max_length": "Description must be at most 300 characters.",
		},
	)
	thumbnail_url = serializers.URLField(
		error_messages={
			"blank": "Thumbnail URL cannot be blank.",
			"invalid": "Invalid thumbnail URL.",
			"required": "Thumbnail URL is required.",
		},
	)
	category = serializers.PrimaryKeyRelatedField(
		queryset=Category.objects.all(),
		error_messages={
			"does_not_exist": "Category does not exist.",
			"incorrect_type": "Category must be a valid ID.",
			"null": "Category cannot be null.",
			"required": "Category is required.",
		},
	)
	link_url = serializers.URLField(
		error_messages={
			"blank": "Link URL cannot be blank.",
			"invalid": "Invalid link URL.",
			"required": "Link URL is required.",
		},
	)
	tags = serializers.PrimaryKeyRelatedField(
		queryset=Tag.objects.all(),
		many=True,
		required=False,
		error_messages={
			"does_not_exist": "One or more tags do not exist.",
			"incorrect_type": "Tags must be provided as valid IDs.",
		},
	)

	class Meta:
		model = StuffPost
		fields = [
			"id",
			"author",
			"title",
			"description_text",
			"thumbnail_url",
			"category",
			"link_url",
			"tags",
			"has_sent",
			"created_at",
		]
		read_only_fields = ["id", "author", "has_sent", "created_at"]

	def validate(self, attrs):
		category = attrs.get("category")
		tags = attrs.get("tags", [])

		invalid_tags = [tag.name for tag in tags if tag.category_id != category.id]
		if invalid_tags:
			raise serializers.ValidationError(
				{"tags": f"Tags must belong to category '{category}'. Invalid tags: {', '.join(invalid_tags)}"}
			)

		return attrs

	def create(self, validated_data):
		category = validated_data.pop("category")
		tags = validated_data.pop("tags", [])
		post = StuffPost.objects.create(
			author=validated_data["author"],
			title=validated_data["title"],
			description_text=validated_data["description_text"],
			thumbnail_url=validated_data["thumbnail_url"],
			category=category,
			link_url=validated_data["link_url"],
			has_sent=False,
			created_at=timezone.now(),
		)

		if tags:
			post.tags.set(tags)

		return post


logger = logging.getLogger(__name__)


class StuffUserView(APIView):
	def get(self, request) -> Response:
		return Response({"status": "OK", "message": "Stuff posts retrieved successfully"}, status=status.HTTP_200_OK)

	def post(self, request) -> Response:
		user = request.user
		try:
			if StuffPost.objects.filter(author=user).exists():
				logger.error(f"Stuff post already exists for {user.email}")
				return Response({"error": "You already have a post."}, status=status.HTTP_400_BAD_REQUEST)
			serializer = StuffPostSerializer(data=request.data)
			# serializer.isvalid() automatically calls the validate function
			if not serializer.is_valid():
				return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
			# serializer.save uses the create method defined in the serializer
			serializer.save(author=user)
			return Response({"status": "OK", "message": "Post made successfully"}, status=status.HTTP_200_OK)
		except Exception as e:
			logger.error(f"Stuff post not created for {user.email}: {e}")
			return Response({"error": "Unexpected error creating stuff post."}, status=status.HTTP_400_BAD_REQUEST)

	def delete(self, request) -> Response:
		user = request.user
		try:
			StuffPost.objects.filter(author=user).delete()
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
