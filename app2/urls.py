from django.conf.urls import url

from . import views

urlpatterns = [
#    url(r'^test/\d+(.\d{2})/$', views.test, name='test'),
    url(r'^test/([01]{1}[\.][0-9][0-9])/$', views.test, name='test'),
    url(r'^accueil/$', views.accueil, name='accueil'),
#    url(r'^test/$', views.test, name='test'),
]