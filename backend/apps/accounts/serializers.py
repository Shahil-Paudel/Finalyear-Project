from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

from apps.households.models import Household, HouseholdMember

User = get_user_model()


class RegisterSerializer(serializers.Serializer):
    """
    Registers a new user AND creates a brand-new household for them
    (as admin) in one step — simplest onboarding flow for a demo app.
    """
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, validators=[validate_password])
    household_name = serializers.CharField(max_length=120)

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("That username is already taken.")
        return value

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
        )
        household = Household.objects.create(name=validated_data["household_name"])
        HouseholdMember.objects.create(household=household, user=user, role="admin")
        return user
