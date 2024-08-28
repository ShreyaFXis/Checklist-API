from core.views import (TestApiViews, ChecklistsApiViews, ChecklistItemsCreateApiViews, ChecklistApiViews,ChecklistItemsApiViews)

from django.urls import path

urlpatterns = [

    path('',TestApiViews.as_view()),
    path('checklists', ChecklistsApiViews.as_view()),
    path('checklist/<int:pk>', ChecklistApiViews.as_view()),
    path('checklist-items/create',ChecklistItemsCreateApiViews.as_view()),
    path('checklist-item/<int:pk>',ChecklistItemsApiViews.as_view()),

    #api/checklists/12(checklist Id )/items/8(checklist items ID)

]
