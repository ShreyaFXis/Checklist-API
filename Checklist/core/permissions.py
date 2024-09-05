from rest_framework.permissions import BasePermission

class isOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        if obj.user:
            return request.user == obj.user
        return False