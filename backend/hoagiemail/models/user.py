from django.contrib.auth.models import AbstractUser
from rest_framework import serializers


class User(AbstractUser):
	def __str__(self) -> str:
		return f"{self.get_full_name()} ({self.username})"

	class Meta:
		db_table = "User"


class UserSerializer(serializers.ModelSerializer):
	name = serializers.SerializerMethodField()

	def get_name(self, obj):
		return obj.get_full_name()

	class Meta:
		model = User
		fields = ["name", "email"]
