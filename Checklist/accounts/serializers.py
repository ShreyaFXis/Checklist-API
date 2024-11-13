from rest_framework import serializers
from accounts.models import CustomUser  # Proper import for CustomUser model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.template.loader import render_to_string
from django.core.mail import EmailMessage

from django.core.mail import send_mail
from django.conf import settings
from .models import CustomUser

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):

    def validate(self, attrs):
        # Get the email and password from the request
        email = attrs.get("email", "")
        password = attrs.get("password", "")

        # Check if the email exists
        user = CustomUser.objects.filter(email=email).first()
        if user is None:
            raise serializers.ValidationError({"error": "User not found"})

        # Check if the password is correct
        if not user.check_password(password):
            raise serializers.ValidationError({"error": "Invalid credentials"})

        # If email and password are valid, return the original token data
        return super().validate(attrs)

class UserRegisterSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'password', 'confirm_password', 'profile_photo', 'gender', 'phone_number']
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):

        validated_data.pop('confirm_password')

        user = CustomUser.objects.create_user(
            email=validated_data['email'],
            username=validated_data['username'],
            password=validated_data['password'],
            profile_photo=validated_data.get('profile_photo'),
            gender=validated_data.get('gender'),
            phone_number=validated_data.get('phone_number')
        )

        return user

class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        try:
            user = CustomUser.objects.get(email=value)
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError({"email": "User not found"})
        return value

    def save(self):
        email = self.validated_data['email']
        print(email)
        user = CustomUser.objects.get(email=email)

        # Generate reset token and save it to the user
        token = user.generate_reset_token()

        # Generate reset link (using frontend URL)
        reset_link = f"{settings.FRONTEND_URL}/reset-password?token={token}&email={email}"

        # Render the email template with context
        html_content = render_to_string('password_reset_email.html', {
            'reset_link': reset_link,
            'username': user.username, 
            'email': email
        })

       # Send email with reset link
        email_message = EmailMessage(
            subject='Password Reset Request',
            body=html_content,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[user.email]
        )
        email_message.content_subtype = 'html'  # Important for HTML email
        email_message.send(fail_silently=False)

class PasswordResetConfirmSerializer(serializers.Serializer):
    email = serializers.EmailField()
    token = serializers.CharField()
    new_password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    def validate(self, data):
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError({"password": "Passwords do not match."})
        return data

    def save(self):
        email = self.validated_data['email']
        token = self.validated_data['token']
        new_password = self.validated_data['new_password']

        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError({"email": "User not found"})

        # Check if the token is valid
        if not user.reset_token_is_valid(token):
            raise serializers.ValidationError({"token": "Invalid or expired token"})

        # Set the new password and clear the token
        user.set_password(new_password)
        user.reset_token = None
        user.reset_token_expiry = None
        user.save()

        return user
