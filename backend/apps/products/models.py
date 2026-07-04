from django.conf import settings
from django.db import models
from django.utils import timezone
from apps.households.models import Household


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    parent = models.ForeignKey("self", null=True, blank=True, on_delete=models.CASCADE, related_name="children")

    def __str__(self):
        return self.name


class Product(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    tags = models.CharField(max_length=255, blank=True, help_text="comma-separated keywords")
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name="products")
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField(default=0)
    image = models.ImageField(upload_to="products/", blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    @property
    def content_text(self):
        """Combined text used for TF-IDF vectorization in the recommender."""
        return f"{self.name} {self.category.name if self.category else ''} {self.tags} {self.description}"


class Order(models.Model):
    STATUS_CHOICES = [("pending", "Pending"), ("paid", "Paid"), ("shipped", "Shipped"), ("delivered", "Delivered")]

    household = models.ForeignKey(Household, on_delete=models.CASCADE, related_name="orders")
    placed_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)


class Interaction(models.Model):
    """Every meaningful user action — the raw fuel for the recommendation engine."""
    ACTION_CHOICES = [("view", "View"), ("cart", "Add to Cart"), ("purchase", "Purchase"), ("rating", "Rating")]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="interactions")
    household = models.ForeignKey(Household, on_delete=models.CASCADE, related_name="interactions")
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="interactions")
    action = models.CharField(max_length=10, choices=ACTION_CHOICES)
    rating = models.PositiveSmallIntegerField(null=True, blank=True)  # 1-5, only for 'rating' action
    # default=now (not auto_now_add) so the seed script can backdate realistic purchase history
    timestamp = models.DateTimeField(default=timezone.now)

    class Meta:
        indexes = [models.Index(fields=["household", "product"]), models.Index(fields=["user", "action"])]
