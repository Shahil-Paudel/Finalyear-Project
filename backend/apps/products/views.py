from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Product, Category, Order, Interaction
from .serializers import (
    ProductSerializer, CategorySerializer, OrderSerializer, InteractionSerializer,
)
from .algorithms import merge_sort, binary_search, binary_search_prefix
from apps.recommendations.engine import HybridRecommender


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filterset_fields = ["category"]
    search_fields = ["name", "tags", "description"]

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        if request.user.is_authenticated:
            member = getattr(request.user, "householdmember", None)
            if member:
                Interaction.objects.create(
                    user=request.user, household=member.household,
                    product=instance, action="view",
                )
        return super().retrieve(request, *args, **kwargs)

    @action(detail=False, methods=["get"])
    def sorted(self, request):
        """
        GET /api/products/sorted/?by=price|name
        Sorts the full catalog using our own merge sort implementation
        (no built-in sort()) and returns the ordered list.
        """
        by = request.query_params.get("by", "price")
        key_fn = (lambda p: p.name.lower()) if by == "name" else (lambda p: float(p.price))

        products = list(Product.objects.all())
        ordered = merge_sort(products, key=key_fn)
        return Response(ProductSerializer(ordered, many=True, context={"request": request}).data)

    @action(detail=False, methods=["get"])
    def search(self, request):
        """
        GET /api/products/search/?name=milk
        Sorts the catalog by name with merge sort, then uses binary
        search (prefix variant) to find matches in O(log n + k).
        """
        query = request.query_params.get("name", "").strip()
        if not query:
            return Response([])

        products = list(Product.objects.all())
        sorted_products = merge_sort(products, key=lambda p: p.name.lower())
        matches = binary_search_prefix(sorted_products, query, key=lambda p: p.name)
        return Response(ProductSerializer(matches, many=True, context={"request": request}).data)


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        member = getattr(self.request.user, "householdmember", None)
        if not member:
            return Order.objects.none()
        return Order.objects.filter(household=member.household).order_by("-created_at")


class InteractionViewSet(viewsets.ModelViewSet):
    serializer_class = InteractionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Interaction.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        member = getattr(self.request.user, "householdmember", None)
        serializer.save(user=self.request.user, household=member.household if member else None)


class RecommendationViewSet(viewsets.ViewSet):
    """
    GET /api/recommendations/ -> Hybrid recommendations
    GET /api/recommendations/content/ -> Content-based recommendations
    """
    permission_classes = [permissions.IsAuthenticated]

    # Hybrid Recommendation
    def list(self, request):
        member = getattr(request.user, "householdmember", None)
        if not member:
            return Response({"detail": "User has no household."}, status=400)

        top_n = int(request.query_params.get("limit", 10))

        products = HybridRecommender().recommend_for_household(
            member.household_id,
            top_n=top_n,
        )

        data = ProductSerializer(
            products,
            many=True,
            context={"request": request},
        ).data

        return Response(data)

    # Content-Based Recommendation
    @action(detail=False, methods=["get"])
    def content(self, request):
        member = getattr(request.user, "householdmember", None)
        if not member:
            return Response({"detail": "User has no household."}, status=400)

        top_n = int(request.query_params.get("limit", 5))

        products = HybridRecommender().content_recommend_for_household(
            member.household_id,
            top_n=top_n,
        )

        data = ProductSerializer(
            products,
            many=True,
            context={"request": request},
        ).data

        return Response(data)