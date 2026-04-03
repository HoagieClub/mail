import logging

from rest_framework import serializers, status
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView

from hoagiemail.models import Category, StuffPost, Tag
from hoagiemail.models.user import UserSerializer


class TagNameField(serializers.ListField):
	child = serializers.CharField()

	def to_representation(self, data):
		return [tag.name for tag in data.all()]


class StuffPostSerializer(serializers.ModelSerializer):
	user = UserSerializer(read_only=True)
	title = serializers.CharField(
		max_length=100,
		required=False,
		allow_blank=True,
		error_messages={
			"max_length": "Title must be at most 100 characters.",
		},
	)
	description = serializers.CharField(
		max_length=200,
		min_length=3,
		error_messages={
			"blank": "Description cannot be blank.",
			"min_length": "Description must be at least 3 characters.",
			"max_length": "Description must be at most 200 characters.",
		},
	)
	thumbnail = serializers.URLField(
		required=False,
		allow_blank=True,
		error_messages={
			"invalid": "Invalid thumbnail URL.",
		},
	)
	category = serializers.SlugRelatedField(
		queryset=Category.objects.all(),
		slug_field="name",
		error_messages={
			"does_not_exist": "Category does not exist.",
			"incorrect_type": "Category must be a valid ID.",
			"null": "Category cannot be null.",
			"required": "Category is required.",
		},
	)
	link = serializers.URLField(
		required=False,
		allow_blank=True,
		error_messages={
			"invalid": "Invalid link URL.",
		},
	)
	tags = TagNameField()

	class Meta:
		model = StuffPost
		fields = [
			"id",
			"user",
			"title",
			"description",
			"thumbnail",
			"category",
			"link",
			"tags",
			"has_sent",
			"created_at",
		]
		read_only_fields = ["id", "user", "has_sent", "created_at"]

	def validate_title(self, value):
		if value and len(value) < 3:
			raise serializers.ValidationError("Title must be at least 3 characters.")
		return value

	def validate(self, attrs):
		category = attrs.get("category")
		tag_names = attrs.get("tags", [])

		resolved_tags = []
		for name in tag_names:
			try:
				resolved_tags.append(Tag.objects.get(name=name, category=category))
			except Tag.DoesNotExist as err:
				raise serializers.ValidationError(
					{"tags": f"Tag '{name}' does not exist in category '{category.name}'."}
				) from err

		attrs["tags"] = resolved_tags
		return attrs


logger = logging.getLogger(__name__)


class StuffUserView(APIView):
	def get(self, request) -> Response:
		# return a user's stuff post, if one exists
		user = request.user
		try:
			post = StuffPost.objects.get(user=user)
			serializer = StuffPostSerializer(post)
			return Response({"status": "used", **serializer.data}, status=status.HTTP_200_OK)

		except StuffPost.DoesNotExist:
			logger.error(f"No stuff post found for {user.email}")
			return Response(
				{"status": "empty"},
				status=status.HTTP_200_OK,
			)

		except Exception as e:
			logger.error(f"Error retrieving stuff post for {user.email}: {e}")
			return Response(
				{"error": "Unexpected error retrieving stuff post."},
				status=status.HTTP_500_INTERNAL_SERVER_ERROR,
			)

	def post(self, request) -> Response:
		user = request.user
		try:
			if StuffPost.objects.filter(user=user).exists():
				logger.error(f"Stuff post already exists for {user.email}")
				return Response({"error": "You already have a post."}, status=status.HTTP_400_BAD_REQUEST)
			serializer = StuffPostSerializer(data=request.data)
			serializer.is_valid(raise_exception=True)
			serializer.save(user=user)
			return Response({"status": "OK", "message": "Post made successfully"}, status=status.HTTP_200_OK)
		except ValidationError:
			raise
		except Exception as e:
			logger.error(f"Stuff post not created for {user.email}: {e}")
			return Response({"error": "Unexpected error creating stuff post."}, status=status.HTTP_400_BAD_REQUEST)

	def delete(self, request) -> Response:
		user = request.user
		try:
			StuffPost.objects.filter(user=user).delete()
			return Response({"Status": "OK"}, status=status.HTTP_200_OK)
		except Exception as e:
			logger.error(f"Unexpected error deleting scheduled post: {str(e)}")
			return Response(
				{"error": "Unexpected error deleting scheduled mail"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
			)
