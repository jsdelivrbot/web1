"""crc URL Configuration"""

from django.conf.urls import include, url
from django.contrib import admin
from django.contrib.auth.views import login, logout
from django.views.generic import TemplateView

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^crc/', include('portailCRC.urls', namespace='portailCRC', app_name='portailCRC')),
    url(r'^crc/teledm/', include('teledm.urls', namespace='teledm', app_name='teledm')),
    url(r'^user/', include('usermanagement.urls')),
    url(r'^accounts/login/$', login, {'template_name': 'registration/login.html'}, name="login"),
    url(r'^accounts/logout/$', logout, {'template_name': 'registration/logout.html', 'next_page':'/accounts/login/'}, name="logout"),
    url(r'^accounts/profile/$', TemplateView.as_view(template_name="registration/profile.html")),
]
