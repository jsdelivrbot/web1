from django.conf.urls import url
from django.views.generic import TemplateView
from django.views.generic.base import RedirectView
from django.contrib.auth.decorators import login_required

from . import views

app_name = 'teledm'
urlpatterns = [
    url(r'^$', views.home, name='home'),
    url(r'^DB/$', views.DB, name='DB'),
    url(r'^tutoMap/$', views.tutoMap, name='tutoMap'),
    url(r'^tutoCalVal/$', views.tutoCalVal, name='tutoCalVal'),
    url(r'^tutoExtraction/$', views.tutoExtraction, name='tutoExtraction'),
     url(r'^stationsAeronetTeom/$', views.stations, name='stations'),
    url(r'^mapViewer/$', views.mapViewer, name='mapViewer'),#login_required(views.mapViewer), name='mapViewer'),
    url(r'^mapDist/$', views.mapDist, name='mapDist'),#login_required(views.mapDist), name='mapDist'),
    url(r'^calval/$', views.calval, name='calval'),#login_required(views.calval), name='calval'),
]
