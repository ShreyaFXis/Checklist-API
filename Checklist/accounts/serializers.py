from rest_framework import serializers

from django.contrib.auth import get_user_model

User = get_user_model()
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
