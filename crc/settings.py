"""
Django 1.8.5
settings for crc project.
"""

import os
#from django.core.urlresolvers import reverse_lazy
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'fo9r1bxde8io8jz_9fr3*%93m3zf+p^)acos)9#@%(oe1+@a@z'
# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = []

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    #'django_extensions',
    #'django.contrib.gis',
    #'django_ftpserver',
    'admin_reorder',
    'usermanagement',
    #'bootstrap3',
    #'bootstrap3_datetime',
    #'djangojs',
    #'wms',
    'sendfile',
    #'leaflet',
    #'djgeojson',
    'teledm',
    'portailCRC',
]

#LEAFLET_CONFIG = {
#        'SPATIAL_EXTEND': [-15.0,0,57,52],
#        'DEFAULT_CENTER': [20.0, 15.0],
#        'DEFAULT_ZOOM': 4,
#}



## smtp config
EMAIL_USE_TLS = True
DEFAULT_FROM_EMAIL = 'test@gmail.com'
SERVER_EMAIL = 'test@gmail.com'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_HOST_USER = ''
EMAIL_HOST_PASSWORD = ''
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'



## SENDFILE settings
SENDFILE_BACKEND = 'sendfile.backends.development'
#SENDFILE_BACKEND = 'sendfile.backends.xsendfile'
#SENDFILE_BACKEND = 'sendfile.backends.nginx'
SENDFILE_ROOT = os.path.join(BASE_DIR, 'teledm/tmp')
SENDFILE_URL = '/teledm/tmp'

#NC_SERVICE_DATA_ROOT = BASE_DIR+'/datas'
#NC_TEMPORARY_FILE_LOCATION = BASE_DIR+'/tmp'


MIDDLEWARE_CLASSES = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.auth.middleware.SessionAuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'admin_reorder.middleware.ModelAdminReorder',
]

ROOT_URLCONF = 'crc.urls'
LOGIN_REDIRECT_URL = '/crc/teledm'

ADMIN_REORDER = (
    'crc',
    #{'app': 'teledm', 'models': ('teledm.Country','teledm.Station','teledm.MeteoData')},
    {'app': 'auth', 'models': ('auth.User',)},
)

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'crc.wsgi.application'


# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.contrib.gis.db.backends.spatialite',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}
#SERIALIZATION_MODULES = {
#    'geojson': 'djgeojson.serializers'
#}

#FTPSERVER_AUTHORIZER = 'django_ftpserver.authorizers.FTPAccountAuthorizer'
#FTPSERVER_HANDLER = 'pyftpdlib.handlers.FTPHandler'
#FTPSERVER_TLSHANDLER = 'pyftpdlib.handlers.TLS_FTPHandler'

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
LANGUAGE_CODE = 'fr-fr'
TIME_ZONE = 'Europe/Paris'
USE_I18N = True
USE_L10N = True
USE_TZ = False


# Static files (CSS, JavaScript, Images)
#PROJECT_ROOT = os.path.normpath(os.path.dirname(__file__))
#STATICFILES_DIRS = ( os.path.join(PROJECT_ROOT, "static"), )
STATIC_ROOT = BASE_DIR + "/static/"
STATIC_URL = '/static/'
STATICFILES_DIRS = ()
STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
 )