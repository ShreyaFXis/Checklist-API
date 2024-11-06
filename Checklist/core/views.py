from django.shortcuts import render
from django.http import Http404

from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import (ListAPIView, ListCreateAPIView, RetrieveUpdateDestroyAPIView, CreateAPIView)

from .models import *
from core.permissions import isOwner
from .serializers import CheckListSerializer
from .serializers import CheckListItemsSerializer

# Create your views here.


class TestApiViews(APIView):
    def get(self, request, format=None):
        return Response({'Name': 'Shreya Panchal'})


class ChecklistsApiViews(ListCreateAPIView):
    serializer_class = CheckListSerializer
    permission_classes = [IsAuthenticated, isOwner]
    '''Listing, Creation'''

    def get_queryset(self):
        # Return the filtered queryset directly
        data=CheckList.objects.filter(user=self.request.user)
        result=[]
        for elm in data:
            result.append(str(elm.title))
        
        print(result)
        return CheckList.objects.filter(user=self.request.user)


# class to check single id of checklist
class ChecklistApiViews(RetrieveUpdateDestroyAPIView):
    serializer_class = CheckListSerializer
    permission_classes = [IsAuthenticated, isOwner]

    '''Retrive, Update, Delete'''

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
    '''Listing'''

    def get_queryset(self):
        checklist_id = self.kwargs.get('checklist_id')
        # Return the filtered queryset directly
        return CheckListItems.objects.filter(user=self.request.user, checklist_id=checklist_id)