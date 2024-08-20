#from core.views import (TestApiViews, ChecklistsApiViews, ChecklistItemsCreateApiViews, ChecklistApiViews,ChecklistItemsApiViews)
from core.views import (TestApiViews, ChecklistItemsCreateApiViews,ChecklistItemsApiViews)
from django.urls import path

urlpatterns = [

    path('',TestApiViews.as_view()),


    path('api/checklist-items/create',ChecklistItemsCreateApiViews.as_view()),
    path('api/checklist-item/<int:pk>',ChecklistItemsApiViews.as_view()),

]
