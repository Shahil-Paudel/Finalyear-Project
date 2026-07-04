from django.conf import settings
from django.db import models


class Household(models.Model):
    """A family/household group that shares recommendations and orders."""
    name = models.CharField(max_length=120)
    address = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class HouseholdMember(models.Model):
    ROLE_CHOICES = [("admin", "Admin"), ("member", "Member")]

    household = models.ForeignKey(Household, on_delete=models.CASCADE, related_name="members")
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default="member")
    joined_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user} ({self.household})"
