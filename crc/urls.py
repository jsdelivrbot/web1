"""crc URL Configuration"""

from django.conf.urls import include, url
from django.contrib import admin
from django.contrib.auth.decorators import login_required
from django.contrib.auth.views import login, logout, password_reset, password_reset_confirm, password_reset_complete, password_reset_done
from django.views.generic import TemplateView

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^crc/', include('portailCRC.urls', namespace='portailCRC', app_name='portailCRC')),
    url(r'^crc/teledm/', include('teledm.urls', namespace='teledm', app_name='teledm')),
    #url(r'^user/', include('usermanagement.urls')),
    url(r'^accounts/password_reset/$', password_reset, {'template_name': 'registration/password_reset_form.html'}, name='password_reset'),
    url(r'^accounts/password_reset_complete/$', password_reset_complete, {'template_name': 'registration/password_reset_complete.html'}, name='password_reset_complete'),
    url(r'^accounts/password_reset_done/$', password_reset_done, {'template_name': 'registration/password_reset_done.html'}, name='password_reset_done'),
    url(r'^accounts/password_reset_confirm/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})/$', password_reset_confirm, {'template_name': 'registration/password_reset_confirm.html'}, name="password_reset_confirm"),
    url(r'^accounts/login/$', login, {'template_name': 'registration/login.html'}, name="login"),
    url(r'^accounts/logout/$', logout, {'template_name': 'registration/logout.html', 'next_page':'/accounts/login/'}, name="logout"),
    url(r'^accounts/profile/$', login_required(TemplateView.as_view(template_name="registration/profile.html"))),
]
