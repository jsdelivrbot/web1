from django.conf.urls import url
from django.contrib.auth.decorators import login_required

from . import views

urlpatterns = [
    url(r'^home/$', login_required(views.home), name='home'),
    url(r'^mapViewer/$', login_required(views.mapViewer), name='mapViewer'),
    url(r'^mapDist/$', login_required(views.mapDist), name='mapDist'),
    url(r'^calval/$', login_required(views.calval), name='calval'),
]
