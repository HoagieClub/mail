"""
URL configuration for hoagiemail project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
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
from django.urls import path

from hoagiemail.api.send_mail_view import SendMailView
from hoagiemail.api.scheduled_mail_view import ScheduledMailView
from hoagiemail.api.stuff_posts_view import StuffPostsView
from hoagiemail.api.stuff_user_view import StuffUserView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("mail/send", SendMailView.as_view(), name="send_mail"),
    path("mail/scheduled/", ScheduledMailView.as_view(), name="scheduled_mail"),
    path("stuff/", StuffPostsView.as_view(), name="stuff"),
    path("stuff/user/", StuffUserView.as_view(), name="stuff_user"),
]
