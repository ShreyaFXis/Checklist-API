'''from rest_framework import serializers

from django.contrib.auth import CustomUser

User = CustomUser()
class UserRegisterSerializer(serializers.ModelSerializer):

    password = serializers.CharField(required = True, write_only = True)
    password2 = serializers.CharField(required = True, write_only = True)
    class Meta:
        model = User
        fields = [
            'username',
            'email',
            'password',
            'password2',
            'profile_photo',
            'gender',
            'phone_number'

        ]
        extra_kwargs ={
            'password': {'write_only': True},
            'password2': {'write_only': True}
        }

    def create(self,validated_data):
        username = validated_data.get('username')
        email = validated_data.get('email')
        password = validated_data.get('password')
        password2 = validated_data.get('password2')
        profile_photo = validated_data.get('profile_photo')
        gender = validated_data.get('gender')
        phone_number = validated_data.get('phone_number')


        if password == password2:
            #user = User(username=username, email=email)
            user = User(username=username, email=email, profile_photo=profile_photo, gender=gender,
                        phone_number=phone_number)
            user.set_password(password)
            user.save()
            return user
        else:
            raise serializers.ValidationError({
                'error':'Passwords do not match.'
            })
'''

from rest_framework import serializers
from accounts.models import CustomUser  # Proper import for CustomUser model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


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
