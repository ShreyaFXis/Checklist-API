from django.shortcuts import render
from django.http import Http404
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import (ListCreateAPIView, RetrieveUpdateDestroyAPIView, CreateAPIView)

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
        return CheckList.objects.filter(user=self.request.user)


    '''def get(self, request, format=None):
        data = CheckList.objects.filter(user = request.user)

        serializer = self.serializer_class(data, many = True)

        serialized_data = serializer.data
        return Response(serialized_data, status= status.HTTP_202_ACCEPTED)

    def post(self, request, format=None):
        # creation code
        serializer = self.serializer_class(data = request.data, context = {'request':request})
        if serializer.is_valid():
            serializer.save()
            serialized_data = serializer.data
            return Response(serialized_data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)'''

# class to check single id of checklist
class ChecklistApiViews(RetrieveUpdateDestroyAPIView):
    serializer_class = CheckListSerializer
    permission_classes = [IsAuthenticated, isOwner]

    '''Retrive, Update, Delete'''

    def get_queryset(self):
        # Return the filtered queryset directly
        return CheckList.objects.filter(user=self.request.user)

    '''def get_obj(self,pk):
        try:
            obj = CheckList.objects.get(pk = pk)
            self.check_object_permissions(self.request,obj)
            return obj
        except:
            raise Http404

    def get(self, request, pk, format = None):
        serializer = self.serializer_class(self.get_obj(pk))
        serialized_data = serializer.data
        return Response(serialized_data, status=statuis.HTTP_200_OK)


    def put(self,request,pk, format = None):
        checklist = self.get_obj(pk)
        serializer = self.serializer_class(checklist, data =request.data, context = {'request':request})
        if serializer.is_valid():
            serializer.save()
            serialized_data = serializer.data
            return Response(serialized_data, status=status.HTTP_202_ACCEPTED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self,request,pk, format= None):
        checklist = self.get_obj(pk)
        checklist.delete()
        return Response(status= status.HTTP_204_NO_CONTENT) 
    '''


class ChecklistItemsCreateApiViews(CreateAPIView):
    serializer_class = CheckListItemsSerializer
    permission_classes = [IsAuthenticated, isOwner ]

    ''' Creation '''
    '''def post(self, request, format=None):
        # creation code
        serializer = self.serializer_class(data = request.data, context = {'request':request})
        if serializer.is_valid():
            serializer.save()
            serialized_data = serializer.data
            return Response(serialized_data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    '''
class ChecklistItemsApiViews(RetrieveUpdateDestroyAPIView):
    serializer_class = CheckListItemsSerializer
    permission_classes = [IsAuthenticated, isOwner]
    '''Retrieve, Update, Delete'''

    def get_queryset(self):
        # Retrieve the checklist_id and checklist_item_id from the URL
        checklist_id = self.kwargs.get('checklist_id')
        checklist_item_id = self.kwargs.get('pk')  # assuming pk is for checklist_item_id

        # Filter based on user, checklist_id, and checklist_item_id
        return CheckListItems.objects.filter(
            user=self.request.user,
            checklist_id=checklist_id,
            id=checklist_item_id
        )
'''
   def get_obj(self,pk):
        try:
            obj = CheckListItems.objects.get(pk = pk)
            self.check_object_permissions(self.request, obj)
            return obj
        except:
            raise Http404

    def get(self, request, pk, format = None):
        checklist_item = self.get_obj(pk)
        serializer = self.serializer_class(checklist_item)
        serialized_data = serializer.data
        return Response(serialized_data, status=status.HTTP_200_OK)


    def put(self,request,pk, format = None):
        checklist_item = self.get_obj(pk)
        serializer = self.serializer_class(checklist_item, data =request.data, context = {'request':request})
        if serializer.is_valid():
            serializer.save()
            serialized_data = serializer.data
            return Response(serialized_data, status=status.HTTP_202_ACCEPTED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self,request,pk, format= None):
        checklist_item = self.get_obj(pk)
        checklist_item.delete()
        return Response(status= status.HTTP_204_NO_CONTENT)
'''