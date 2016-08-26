from django.conf.urls import url
from django.views.generic import TemplateView
from djgeojson.views import GeoJSONLayerView
from django.contrib.auth.decorators import login_required

from app1.models import Station
from . import views

urlpatterns = [
    url(r'^home/$', TemplateView.as_view(template_name='app1/base.html')),
    url(r'^thredds/$', login_required(views.thredds), name='thredds'),
    url(r'^earthquakes/$', views.earthquakes, name='earthquakes'),
    url(r'^stations/$',  login_required(TemplateView.as_view(template_name='app1/stations.html')), name='stations'),
    #url(r'^data.geojson$', GeoJSONLayerView.as_view(model=Station),name='data'),
    url(r'data.geojson$', views.StationLayer.as_view(model=Station),name='data'),
    url(r'^meteo/$', login_required(views.meteo), name='meteo'),
    url(r'^map/$', login_required(views.maps), name='map'),
    url(r'^calval/$', login_required(views.calval), name='calval'),
    url(r'^data_mapping/$', login_required(views.viewer), name='data_mapping'),
    url(r'^point_viewer/$', login_required(views.pointViewer), name='point_viewer'),
]
