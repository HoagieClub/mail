from django.db import models
from models.user import User

class Tag(models.Model):
    # Important: Once deployed, the two letter-code cannot be changed as they are what's stored in DB.
    # The human friendly name after it can be changed.
    class Kind(models.TextChoices):
        ANNOUCEMENT = "AN", "Announcement"
        OPPORTURNITY = "OP", "Opporturnity"
        REQUEST = "RQ", "Request"
        ACCESSORIES = "AC", "Accessories"
        CLOTHING = "CT", "Clothing"
        TECH = "TE", "Tech"
        FURNITURE = "FR", "Furniture"
        SCHOOL = "SC", "School"
        TICKETS = "TK", "Tickets"
        OTHERS = "OT", "Others"

    kind = models.CharField(max_length=4, choices=Kind)

    def __str__(self) -> str:
        return self.kind

class StuffPost(models.Model):
    class Category(models.TextChoices):
        ANYTHING = "AT", "Anything"
        STUDENT_SALE = "SS", "Student Sale"
        LOST_FOUND = "LF", "Lost & Found"

    author = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField()
    description_text = models.CharField()
    thumbnail_url = models.URLField()
    category = models.CharField(max_length=2, choices=Category, db_index=True)
    link_url = models.URLField()
    tags = models.ManyToManyField(Tag, related_name="posts", blank=True, db_index=True)
    has_sent = models.BooleanField(default=False)
    created_at = models.DateTimeField()
