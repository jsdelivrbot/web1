from django.contrib.gis import admin
from teledm.models import * #Country,Station,MeteoData


class VariablesAdmin(admin.ModelAdmin):
    list_display = ('variable','produits')
    order_with_respect_to = 'produits'
    list_filter = ['produits']
    search_fields = ['variable']

class ProduitsAdmin(admin.ModelAdmin):
    list_display = ('produit','capteurs_sources')
    order_with_respect_to = 'capteurs_sources'


admin.site.register([Country,Station,MeteoData], admin.OSMGeoAdmin)
