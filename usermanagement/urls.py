from django.conf.urls import url
from django.views.generic import TemplateView
from . import views

urlpatterns = [
    url(r'^succes/$', TemplateView.as_view(template_name="usermanagement/succes.html")),
    url(r'^create_account/$', views.create_account),
]