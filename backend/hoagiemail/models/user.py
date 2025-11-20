from django.db import models

class User(models.Model):
    name = models.CharField()
    email = models.CharField(db_index=True)

    def __str__(self) -> str:
        return self.name
