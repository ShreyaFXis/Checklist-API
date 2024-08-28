from django.urls import path

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from accounts.views import RegisterAPIViews
urlpatterns = [
    path('login/', TokenObtainPairView.as_view(), name='login_view'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh_view'),
    path('register',RegisterAPIViews.as_view())
]