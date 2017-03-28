"""
Django 1.8.5
settings for crc project.
"""

import os


DIRDB = "/home/mers/Bureau/teledm"
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
    'djangobower',    
    #'admin_reorder',
    'sendfile',
    'teledm',
    'portailCRC',
]

#BOWER_PATH = '/usr/local/bin/bower'
BOWER_INSTALLED_APPS = (
    'jquery',
    'jquery.cookie',
    'jquery-ui',
    'underscore',
    'bootstrap',
    'highcharts',
    'highcharts-regression',
    'export-csv',
    #'exporting',
    'select2',
    'OpenLayers',
    'html5shiv',
    'respond',
    'moment',
)

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
MEDIA_ROOT = os.path.join(BASE_DIR, 'teledm/tmp')
SENDFILE_BACKEND = 'sendfile.backends.development'
#SENDFILE_BACKEND = 'sendfile.backends.xsendfile'
#SENDFILE_BACKEND = 'sendfile.backends.nginx'
SENDFILE_ROOT = os.path.join(BASE_DIR, 'teledm/tmp')
SENDFILE_URL = os.path.join(BASE_DIR, 'teledm/tmp') #'/tmp'

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
    #'teledm.middleware.filterIP_middleware.FilterIPMiddleware',
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


# secure proxy SSL header and secure cookies
#SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
#SESSION_COOKIE_SECURE = True
#CSRF_COOKIE_SECURE = True
#SECURE_SSL_REDIRECT = True

# session expire at browser close
SESSION_EXPIRE_AT_BROWSER_CLOSE = True

# wsgi scheme
#os.environ['wsgi.url_scheme'] = 'https'
WSGI_APPLICATION = 'crc.wsgi.application'


# Database
SPATIALITE_LIBRARY_PATH = 'mod_spatialite'
DATABASES = {
    'default': {
        #'ENGINE': 'django.contrib.gis.db.backends.spatialite',
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}


# Password validation
AUTH_PASSWORD_VALIDATORS = [{
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },{
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },{
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },{
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format' : "[%(asctime)s] %(levelname)s [%(name)s:%(lineno)s] %(message)s",
            'datefmt' : "%d/%b/%Y %H:%M:%S"
        },
        'simple': {
            'format': '%(levelname)s %(message)s'
        },
    },
    'handlers': {
        'file': {
            'level': 'DEBUG',
            'filename': os.path.join(BASE_DIR, 'log/teledm.log'),
            #'class': 'logging.FileHandler',
            'class': 'logging.handlers.TimedRotatingFileHandler',
            'when': 'midnight',
            'interval': 1,
            'formatter': 'verbose'
        },
    },
    'loggers': {
        'django': {
            'handlers':['file'],
            'propagate': True,
            'level':'DEBUG',
        },
        'django.request': {
            'handlers': ['file'],
            'level': 'INFO',
            'propagate': False,
        },
        'teledm': {
            'handlers': ['file'],
            'level': 'DEBUG',
        },
    }
}



CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
        'LOCATION': os.path.join(BASE_DIR, 'tmp'),
    }
}


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

BOWER_COMPONENTS_ROOT = os.path.join(BASE_DIR, 'components')

STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
    'djangobower.finders.BowerFinder',
 )
