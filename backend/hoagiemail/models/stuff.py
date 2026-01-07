from django.core.exceptions import ValidationError
from django.db import models
from django.db.models.signals import m2m_changed
from django.dispatch import receiver

from .user import User


class Category(models.Model):
	name = models.CharField(max_length=20)

	def __str__(self) -> str:
		return self.name

	class Meta:
		db_table = "Category"


class Tag(models.Model):
	name = models.CharField(max_length=20)
	category = models.ForeignKey(Category, on_delete=models.DO_NOTHING)

	def __str__(self) -> str:
		return self.name

	class Meta:
		unique_together = ("name", "category")
		db_table = "Tag"


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
		ordering = ["-created_at"]
		db_table = "StuffPost"


@receiver(m2m_changed, sender=StuffPost.tags.through)
def validate_tag_category(sender, instance, action, pk_set, **kwargs):
	if action == "pre_add" and pk_set:
		invalid_tags = Tag.objects.filter(pk__in=pk_set).exclude(category=instance.category)

		if invalid_tags.exists():
			tag_names = ", ".join(tag.name for tag in invalid_tags)
			raise ValidationError(f"Tags must belong to category '{instance.category}'. Invalid tags: {tag_names}")
