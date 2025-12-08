from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    def __str__(self) -> str:
        return f"{self.get_full_name} ({self.username})"
