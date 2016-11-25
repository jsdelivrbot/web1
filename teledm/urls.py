from django.conf.urls import url
from django.contrib.auth.decorators import login_required

from . import views

app_name = 'teledm'
urlpatterns = [
    url(r'^$', views.home, name='home'),
    url(r'^mapViewer/$', login_required(views.mapViewer), name='mapViewer'),
    url(r'^mapDist/$', login_required(views.mapDist), name='mapDist'),
    url(r'^calval/$', login_required(views.calval), name='calval'),
]
