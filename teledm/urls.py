from django.conf.urls import url, handler400, handler403, handler404, handler500
from django.views.generic import TemplateView
from django.contrib.auth.decorators import login_required

from . import views




handler500 = 'teledm.views.server_error'


app_name = 'teledm'
urlpatterns = [
    ###pages
    url(r'^$', TemplateView.as_view(template_name='teledm/home.html'), name='home'),#login_required(TemplateView.as_view(template_name='teledm/home.html')), name='home'),
    url(r'^mapViewer/$', views.mapViewer, name='mapViewer'),
    url(r'^mapDist/$', views.mapDist, name='mapDist'),
    url(r'^calval/$', views.calval, name='calval'),
    url(r'^localisation/$', TemplateView.as_view(template_name='teledm/localisation.html'), name='localisation'),
    url(r'^test/$', TemplateView.as_view(template_name='teledm/test.html'), name='test'),
    ###proxy
    url(r'^proxyajax/(?P<path>.*)$', views.proxyAjax, name='mapViewer'),
    url(r'^minmax/(?P<path>.*)$', views.minmax, name='minmax'),
    url(r'^dates/(?P<path>.*)$', views.dates, name='mapViewer'),
    url(r'^proxywms/(?P<path>.*)$', views.proxyWMS, name='mapViewer'),
    url(r'^colorbar/(?P<path>.*)$', views.colorbar, name='colorbar'),
    url(r'^proxyncss/(?P<path>.*)$', views.proxyNCSS, name='mapViewer'),
    ###tuto
    url(r'^DB/$', TemplateView.as_view(template_name='teledm/db.html'), name='DB'),
    url(r'^traitementsData/$', TemplateView.as_view(template_name='teledm/traitementsData.html'), name='traitementsData'),
    url(r'^tutoMap/$', TemplateView.as_view(template_name='teledm/tutoMap.html'), name='tutoMap'),
    url(r'^tutoCalVal/$', TemplateView.as_view(template_name='teledm/tutoCalVal.html'), name='tutoCalVal'),
    url(r'^tutoExtraction/$', TemplateView.as_view(template_name='teledm/tutoExtraction.html'), name='tutoExtraction'),
    url(r'^stationsAeronetTeom/$', TemplateView.as_view(template_name='teledm/stations.html'), name='stations'),
]
