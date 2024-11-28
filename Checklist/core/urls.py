from core.views import (TestApiViews, ChecklistsApiViews, ChecklistItemsCreateApiViews, ChecklistApiViews,ChecklistItemsApiViews, ChecklistItemsListApiViews)

from django.urls import path

urlpatterns = [

    path('',TestApiViews.as_view()),
    path('checklists', ChecklistsApiViews.as_view()), #to get and create checklists and to delete multiple ids []
    path('checklists/<int:pk>', ChecklistApiViews.as_view()),  #for Retrieve/Update/Delete single checklist
    path('checklists/items',ChecklistItemsCreateApiViews.as_view()), # to create new item
    path('checklists/<int:checklist_id>/items/<int:pk>', ChecklistItemsApiViews.as_view()), #for Retrieve/Update/Delete single items
    path('checklists/<int:checklist_id>/items', ChecklistItemsListApiViews.as_view(), name='checklist-items-list'), #to retrieve all the items from particular checklist ID

    #api/checklists/{checklist Id}/items/{checklist items ID}

]


  