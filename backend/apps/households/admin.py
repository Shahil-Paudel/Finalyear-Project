from django.contrib import admin
from .models import Household, HouseholdMember


@admin.register(Household)
class HouseholdAdmin(admin.ModelAdmin):
    list_display = ["id", "name", "address", "created_at"]
    search_fields = ["name"]


@admin.register(HouseholdMember)
class HouseholdMemberAdmin(admin.ModelAdmin):
    list_display = ["id", "user", "household", "role", "joined_at"]
    list_filter = ["role"]
