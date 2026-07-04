from rest_framework import serializers
from .models import Product, Category, Order, OrderItem, Interaction


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "parent"]


class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "description",
            "tags",
            "category",
            "price",
            "stock",
            "image",
        ]


class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)

    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(),
        source="product",
        write_only=True,
    )

    class Meta:
        model = OrderItem
        fields = [
            "id",
            "product",
            "product_id",
            "quantity",
            "unit_price",
        ]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "household",
            "status",
            "total",
            "items",
            "created_at",
        ]

    def create(self, validated_data):
        items_data = validated_data.pop("items")

        # Create order and save the logged-in user
        order = Order.objects.create(
            placed_by=self.context["request"].user,
            **validated_data
        )

        total = 0

        for item in items_data:
            order_item = OrderItem.objects.create(
                order=order,
                **item
            )

            total += order_item.quantity * order_item.unit_price

            # Log purchase interaction for recommendation engine
            Interaction.objects.create(
                user=self.context["request"].user,
                household=order.household,
                product=item["product"],
                action="purchase",
            )

        order.total = total
        order.save()

        return order


class InteractionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Interaction
        fields = [
            "id",
            "user",
            "household",
            "product",
            "action",
            "rating",
            "timestamp",
        ]
        read_only_fields = [
            "user",
            "household",
            "timestamp",
        ]