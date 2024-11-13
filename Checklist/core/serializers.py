from MySQLdb import IntegrityError
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
    checklist = serializers.PrimaryKeyRelatedField(queryset=CheckList.objects.all())  # Allow checklist to be writable
    class Meta:
        model = CheckListItems
        fields = '__all__'


class CheckListSerializer(serializers.ModelSerializer):
    items = CheckListItemsSerializer(source ='checklistitems_set', many = True, read_only = True)
    user = serializers.HiddenField(default = serializers.CurrentUserDefault())
 
    class Meta:
        model = CheckList
        fields = '__all__'

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # Check if the 'titles_only' context is set to only return 'id' and 'title'
        if self.context.get('titles_only'):
            return {'id': representation['id'], 'title': representation['title']}
        return representation
    
    def validate(self, data):
        print("Running validate method")  # Debugging line
        user = self.context['request'].user
        title = data.get('title')
        checklist_id = self.instance.id if self.instance else None

        if CheckList.objects.filter(user=user, title=title).exclude(id=checklist_id).exists():
            raise serializers.ValidationError({
                'title': 'You already have a checklist with this title.'
            })
        return data


        