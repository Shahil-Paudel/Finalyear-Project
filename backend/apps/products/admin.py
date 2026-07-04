from django.contrib import admin
from .models import Category, Product, Order, OrderItem, Interaction


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ["id", "name", "parent"]


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ["id", "name", "category", "price", "stock"]
    list_filter = ["category"]
    search_fields = ["name", "tags"]


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ["id", "household", "status", "total", "created_at"]
    list_filter = ["status"]
    inlines = [OrderItemInline]


@admin.register(Interaction)
class InteractionAdmin(admin.ModelAdmin):
    list_display = ["id", "user", "household", "product", "action", "rating", "timestamp"]
    list_filter = ["action"]
