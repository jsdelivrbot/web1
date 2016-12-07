from django.conf.urls import url
from django.contrib.auth.decorators import login_required

from . import views

app_name = 'teledm'
urlpatterns = [
    url(r'^$', views.home, name='home'),
    url(r'^mapViewer/$', views.mapViewer, name='mapViewer'),#login_required(views.mapViewer), name='mapViewer'),
    url(r'^mapDist/$', views.mapDist, name='mapDist'),#login_required(views.mapDist), name='mapDist'),
    url(r'^calval/$', views.calval, name='calval'),#login_required(views.calval), name='calval'),
]
