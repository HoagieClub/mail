from django.contrib.auth.models import AbstractUser
from rest_framework import serializers


class User(AbstractUser):
	def __str__(self) -> str:
		return f"{self.get_full_name()} ({self.username})"

	class Meta:
		db_table = "User"


class UserSerializer(serializers.ModelSerializer):
	class Meta:
		model = User
		fields = ["first_name", "last_name", "email"]
