from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import RegisterSerializer


# Create your views here.
class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer


class LogoutView(generics.GenericAPIView):
    permission_classes = [AllowAny]

    def post(self, request):
        refresh = request.data.get("refresh")
        if not refresh:
            return Response(
                {"refresh": ["A refresh token is required."]},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            RefreshToken(refresh).blacklist()
        except (TokenError, AttributeError):
            # Already blacklisted, expired or malformed — the session is
            # effectively already revoked, so logout is still successful.
            pass

        return Response(status=status.HTTP_204_NO_CONTENT)
