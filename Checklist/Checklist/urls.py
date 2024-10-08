"""
URL configuration for Checklist project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView
from rest_framework.schemas import get_schema_view
from django.conf import settings

from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('core.urls')),
    path('api/', include('accounts.urls')),


    path('openapi/', get_schema_view(
        title="CheckList API",
        description="API for all things …",
        version="1.0.0"
    ), name='openapi-schema'),

    path('', TemplateView.as_view(
        template_name='doc.html',
        extra_context={'schema_url':'openapi-schema'}
    ), name='api_doc'),

    path('confirm-forget-password', TemplateView.as_view(
        template_name='reset.html',
        extra_context={'schema_url':'openapi-schema'}
    ), name='api_doc'),
]

# Used to access media files from Database.
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

