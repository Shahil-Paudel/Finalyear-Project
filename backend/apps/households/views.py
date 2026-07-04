from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Household, HouseholdMember
from .serializers import HouseholdSerializer


class HouseholdViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Read-only: households are created via /api/auth/register/.
    GET /api/households/me/ -> the logged-in user's household + members.
    """
    serializer_class = HouseholdSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Household.objects.all()

    @action(detail=False, methods=["get"])
    def me(self, request):
        member = HouseholdMember.objects.filter(user=request.user).select_related("household").first()
        if not member:
            return Response({"detail": "No household found for this user."}, status=404)
        return Response(HouseholdSerializer(member.household).data)
