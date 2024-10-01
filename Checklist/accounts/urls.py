'''from django.urls import path

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from accounts.views import RegisterAPIViews
urlpatterns = [
    path('login/', TokenObtainPairView.as_view(), name='login_view'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh_view'),
    path('register',RegisterAPIViews.as_view())
]'''

from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from accounts.views import RegisterAPIViews, CustomTokenObtainPairView,PasswordResetRequestView,PasswordResetConfirmView

urlpatterns = [

    path('login', CustomTokenObtainPairView.as_view(), name='login_view'),
    path('token/refresh', TokenRefreshView.as_view(), name='token_refresh_view'),
    path('register', RegisterAPIViews.as_view(), name='register_view'),
    path('forget-password', PasswordResetRequestView.as_view(), name='password_reset'),
    path('confirm-forget-password', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),

]
