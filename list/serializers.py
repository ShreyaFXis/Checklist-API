from rest_framework import serializers
from core.models import *


class CheckListItemsSerializer(serializers.ModelSerializer):
    class Meta:
        model = CheckListItems
        fields = '__all__'


class CheckListSerializer(serializers.ModelSerializer):
    items = CheckListItemsSerializer(source ='checklistitems_set', many = True, read_only = True)
    class Meta:
        model = CheckList
        fields = '__all__'

