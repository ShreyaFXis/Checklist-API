from django.urls import path
from list.views import ChecklistsApiViews, ChecklistApiViews

urlpatterns = [
    path('api/checklists', ChecklistsApiViews.as_view()),
    path('api/checklist/<int:pk>', ChecklistApiViews.as_view()),
]
