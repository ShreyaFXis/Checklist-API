from rest_framework import serializers
from core.models import *
'''
class CheckListSerializer(serializers.Serializer):
    title = serializers.CharField()
    is_deleted = serializers.BooleanField()
    is_archived = serializers.BooleanField()
    created_on = serializers.DateTimeField()
    updated_on = serializers.DateTimeField()'''


class CheckListItemsSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    class Meta:
        model = CheckListItems
        fields = '__all__'


class CheckListSerializer(serializers.ModelSerializer):
    items = CheckListItemsSerializer(source ='checklistitems_set', many = True, read_only = True)
    user = serializers.HiddenField(default = serializers.CurrentUserDefault())
    class Meta:
        model = CheckList
        fields = '__all__'