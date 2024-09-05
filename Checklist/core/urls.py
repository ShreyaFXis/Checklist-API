from core.views import (TestApiViews, ChecklistsApiViews, ChecklistItemsCreateApiViews, ChecklistApiViews,ChecklistItemsApiViews)

from django.urls import path

urlpatterns = [

    path('',TestApiViews.as_view()),
    path('checklists', ChecklistsApiViews.as_view()), #to get and create checklists
    path('checklists/<int:pk>', ChecklistApiViews.as_view()),  #for Retrieve/Update/Delete single checklist
    path('checklists/items',ChecklistItemsCreateApiViews.as_view()), # to create new item
    path('checklists/<int:checklist_id>/items/<int:pk>', ChecklistItemsApiViews.as_view()), #for Retrieve/Update/Delete single items

    #api/checklists/{checklist Id}/items/{checklist items ID}

]
