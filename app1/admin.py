from django.contrib.gis import admin
from app1.models import * #Country,Station,MeteoData
from app2.models import * #DataTypes,Capteurs_Sources, Produits, ResolutionsSpatiales, ResolutionsTemporelles, Variables


class VariablesAdmin(admin.ModelAdmin):
    list_display = ('variable','produits')
    order_with_respect_to = 'produits'
    list_filter = ['produits']
    search_fields = ['variable']

class ProduitsAdmin(admin.ModelAdmin):
    list_display = ('produit','capteurs_sources')
    order_with_respect_to = 'capteurs_sources'


admin.site.register([Country,Station,MeteoData], admin.OSMGeoAdmin)
admin.site.register([DataTypes,Capteurs_Sources, ResolutionsSpatiales, ResolutionsTemporelles])
admin.site.register([Produits], ProduitsAdmin)
admin.site.register([Variables],VariablesAdmin)