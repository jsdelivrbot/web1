from __future__ import unicode_literals

from django.db import models
from django.contrib.gis.db import models as gismodels


class Country(models.Model):
    country_id = models.IntegerField(primary_key=True)
    country = models.CharField(max_length=50)
    def __unicode__(self):
        return self.country

class Station(gismodels.Model):
    station_id = models.IntegerField(primary_key=True)
    station = models.CharField(max_length=50)
    country = gismodels.ForeignKey(Country, on_delete=models.CASCADE)
    geom = gismodels.PointField()
    objects = gismodels.GeoManager()
    def __unicode__(self):
        return self.station
        
class MeteoData(models.Model):
    date = models.DateTimeField()
    wind = models.FloatField()
    wind_dir = models.FloatField()
    temp = models.FloatField()
    relh = models.FloatField()
    rain = models.FloatField()
    station = models.ForeignKey(Station, on_delete=models.CASCADE)
    def __unicode__(self):
        return self.date.strftime('%Y-%m-%d')

class Villes(models.Model):
    villes = models.CharField(max_length=50)
    country = models.ForeignKey(Country, on_delete=models.CASCADE)