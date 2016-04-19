"""web1 URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.9/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import include, url
from django.contrib import admin
from django.contrib.auth.views import login, logout
from django.views.generic import TemplateView

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^app1/', include('app1.urls')),
    url(r'^user/', include('usermanagement.urls')),
    url(r'^accounts/login/$', login),
    url(r'^accounts/logout/$', logout, {'next_page':'/accounts/login/'}),
    url(r'^accounts/profile/$', TemplateView.as_view(template_name="registration/profile.html")),
#    url(r'tiles/', include('raster.urls')),
]
