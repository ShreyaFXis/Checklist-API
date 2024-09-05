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

class UserRegisterSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'password', 'password2', 'profile_photo', 'gender', 'phone_number']
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        print("enter into create---------------------")
        validated_data.pop('password2')
        print("validated_data-------------- ",validated_data)
        user = CustomUser.objects.create_user(
            email=validated_data['email'],
            username=validated_data['username'],
            password=validated_data['password'],
            profile_photo=validated_data.get('profile_photo'),
            gender=validated_data.get('gender'),
            phone_number=validated_data.get('phone_number')
        )
        print("user---------- ",user)
        return user
