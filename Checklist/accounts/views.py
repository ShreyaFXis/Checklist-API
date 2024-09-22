from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView

from accounts.serializers import *
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


@method_decorator(csrf_exempt, name='dispatch')
class RegisterAPIViews(APIView):
    serializer_class = UserRegisterSerializer

    def post(self, request, format=None):
        # creation code
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            user = serializer.save()

            refresh = RefreshToken.for_user(user)

            response_data = {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': serializer.data,
            }

            return Response(response_data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LogOutAPIViews(APIView):
    def post(self,request,format=None):
        try:
            refresh_token = request.data.get('refresh_token')
            token_obj = RefreshToken(refresh_token)
            token_obj.blacklist()
            return Response( status=status.HTTP_200_OK)
        except Exception as e:
            return Response( status=status.HTTP_400_BAD_REQUEST)


# Exempt CSRF check for Password Reset Request
@method_decorator(csrf_exempt, name='dispatch')
class PasswordResetRequestView(APIView):
    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Password reset link sent"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Exempt CSRF check for Password Reset Confirm
@method_decorator(csrf_exempt, name='dispatch')
class PasswordResetConfirmView(APIView):

    # def get(self, request):
    #     print("inside password confirm get")
    #     email = request.query_params.get('email')
    #     token = request.query_params.get('token')

    #     try:
    #         user = CustomUser.objects.get(email=email)
    #     except CustomUser.DoesNotExist:
    #         return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    #     # Validate the token
    #     if user.reset_token_is_valid(token):
    #         return Response(render(request,template_name="reset.html"))
    #     return Response({"error": "Invalid or expired token"}, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Password reset successful"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
