from django.db import models
from models import User


class CategoryMismatchError(RuntimeError):
    pass

class Category(models.Model):
    class CategoryChoice(models.TextChoices):
        ANYTHING = "AT", "Anything"
        STUDENT_SALE = "SS", "Student Sale"
        LOST_FOUND = "LF", "Lost & Found"
    
    name = models.CharField(max_length=2, choices=CategoryChoice, primary_key=True)

    def __str__(self) -> str:
        return self.name

class Tag(models.Model):
    name = models.CharField(max_length=20)
    category = models.ForeignKey(Category, on_delete=models.DO_NOTHING)

    def __str__(self) -> str:
        return self.name

# idx not needed django automatically inserts a AutoField as primary key.
# unless we want to use BigAutoField for future proofing purposes.
class StuffPost(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    description_text = models.CharField(max_length=300)
    thumbnail_url = models.URLField()
    category = models.ForeignKey(Category, on_delete=models.DO_NOTHING)
    link_url = models.URLField()
    tags = models.ManyToManyField(Tag, related_name="posts", blank=True, db_index=True)
    has_sent = models.BooleanField(default=False)
    created_at = models.DateTimeField()

    class Meta:
        ordering = ("-created_at")
    
    def clean(self) -> None:
        if not all([tag.category == self.category for tag in self.tags.all()]):
            raise CategoryMismatchError
