from rest_framework import serializers
from .models import Household, HouseholdMember


class HouseholdMemberSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = HouseholdMember
        fields = ["id", "username", "role", "joined_at"]


class HouseholdSerializer(serializers.ModelSerializer):
    members = HouseholdMemberSerializer(many=True, read_only=True)

    class Meta:
        model = Household
        fields = ["id", "name", "address", "members", "created_at"]
