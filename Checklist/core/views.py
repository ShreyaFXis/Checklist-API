from MySQLdb import IntegrityError
from django.forms import ValidationError
from django.shortcuts import render
from django.http import Http404
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import (ListAPIView, ListCreateAPIView, RetrieveUpdateDestroyAPIView, CreateAPIView)

from .models import *
from core.permissions import isOwner
from .serializers import CheckListSerializer
from .serializers import CheckListItemsSerializer
from rest_framework.pagination import PageNumberPagination
# Create your views here.


class TenPerPagePagination(PageNumberPagination):
    page_size = 10  # Set to 10 checklists per page

class TestApiViews(APIView):
    def get(self, request, format=None):
        return Response({'Name': 'Shreya Panchal'})


class ChecklistsApiViews(ListCreateAPIView):
    serializer_class = CheckListSerializer
    permission_classes = [IsAuthenticated, isOwner]
    pagination_class = TenPerPagePagination
    '''Listing, Creation'''

    def get_queryset(self):
        # Return the filtered queryset directly
        # print("is create ")
        return CheckList.objects.filter(user=self.request.user)
     
    def get_serializer_context(self):
        context = super().get_serializer_context()
        if self.request.query_params.get('titles_only') == 'true':
            context['titles_only'] = True
        return context
    
    def delete(self, request, *args, **kwargs):
        '''
        Handle DELETE for bulk deletion.
        '''
        checklist_ids = request.data.get("checklist_ids", [])

        # Ensure checklist_ids is a list
        if not isinstance(checklist_ids, list):
            return Response(
                {"error": "checklist_ids must be a list of integers."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Filtering the checklists belonging to the current user
        user_checklists = CheckList.objects.filter(id__in=checklist_ids, user=request.user)

        if not user_checklists.exists():
            return Response(
                {"error": "No valid checklists found to deletion."},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Delete counts
        deleted_count, _ = user_checklists.delete()

        return Response(
            {"message": f"{deleted_count} checklists deleted successfully."},
            status=status.HTTP_200_OK,
        )
    


""" @action(detail=True, methods=['patch'], url_path='toggle-starred')
    def toggle_starred(self, request, pk=None):
        try:
            checklist = CheckList.objects.get(id=pk, user=request.user)
            checklist.is_starred = not checklist.is_starred
            checklist.save()
            return Response(
                {"message": f"Checklist {checklist.title} starred status updated."},
                status=status.HTTP_200_OK
            )
        except CheckList.DoesNotExist:
            return Response(
                {"error": "Checklist not found."},
                status=status.HTTP_404_NOT_FOUND
            )"""




class ToggleStarredApiView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, id):
        try:
            checklist = CheckList.objects.get(id=id, user=request.user)
            checklist.is_starred = not checklist.is_starred
            checklist.save()
            return Response(
                {"message": f"Checklist '{checklist.title}' starred status updated.",
                 "is_starred": checklist.is_starred},
                
                status=status.HTTP_200_OK
            )
        except CheckList.DoesNotExist:
            return Response(
                {"error": "Checklist not found."},
                status=status.HTTP_404_NOT_FOUND
            )





# class to check single id of checklist
class ChecklistApiViews(RetrieveUpdateDestroyAPIView):
    serializer_class = CheckListSerializer
    permission_classes = [IsAuthenticated, isOwner]

    '''Retrieve, Update, Delete'''

    def get_queryset(self):
        # Return the filtered queryset directly
        return CheckList.objects.filter(user=self.request.user)


class ChecklistItemsCreateApiViews(CreateAPIView):
    serializer_class = CheckListItemsSerializer
    permission_classes = [IsAuthenticated, isOwner ]


class ChecklistItemsApiViews(RetrieveUpdateDestroyAPIView):
    serializer_class = CheckListItemsSerializer
    permission_classes = [IsAuthenticated, isOwner]
    '''Retrieve, Update, Delete'''

    def get_queryset(self):
        # Retrieve the checklist_id and checklist_item_id from the URL
        checklist_id = self.kwargs.get('checklist_id')
        checklist_item_id = self.kwargs.get('pk')  # pk is for checklist_item_id

        # Filter based on user, checklist_id, and checklist_item_id
        return CheckListItems.objects.filter(
            user=self.request.user,
            checklist_id=checklist_id,
            id=checklist_item_id
        )

class ChecklistItemsListApiViews(ListAPIView):
    serializer_class = CheckListItemsSerializer
    permission_classes = [IsAuthenticated, isOwner]
    pagination_class = TenPerPagePagination
    '''Listing'''

    def get_queryset(self):
        checklist_id = self.kwargs.get('checklist_id')
        # Return the filtered queryset directly
        result=CheckListItems.objects.filter(user=self.request.user, checklist_id=checklist_id)
     #   print("---pagination----")
      #  print(result)
       # print("-----------------")
        return result