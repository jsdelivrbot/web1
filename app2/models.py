from __future__ import unicode_literals

from django.db import models
from django.forms import ModelForm



class DataTypes(models.Model):
    datatype = models.CharField(max_length=50)
    def __unicode__(self):
        return self.datatype
    class Meta:
        ordering = ('datatype',)
        verbose_name_plural = 'Type de donnees'
#        db_table = 'DataTypes'

class Capteurs_Sources(models.Model):
    capteur_source = models.CharField(max_length=50)
    datatype = models.ForeignKey(DataTypes, on_delete=models.CASCADE)
    def __unicode__(self):
        return self.capteur_source
    class Meta:
        ordering = ('capteur_source',)
        verbose_name_plural = 'Nom du capteur ou de la source'

class Produits(models.Model):
    produit = models.CharField(max_length=50)
    capteurs_sources = models.ForeignKey(Capteurs_Sources, on_delete=models.CASCADE)
    def __unicode__(self):
        return self.produit
    class Meta:
        ordering = ('produit',)
        verbose_name_plural = 'Liste des produits'


class ResolutionsSpatiales(models.Model):
    resolutionspatiale = models.CharField(max_length=50)
    produits = models.ManyToManyField(Produits)
    def __unicode__(self):
        return self.resolutionspatiale
    class Meta:
        ordering = ('resolutionspatiale',)
        verbose_name_plural = 'Resolution spatiale'

class ResolutionsTemporelles(models.Model):
    resolutiontemporelle = models.CharField(max_length=50)
    produits = models.ManyToManyField(Produits)
    def __unicode__(self):
        return self.resolutiontemporelle
    class Meta:
        verbose_name_plural = 'Resolution temporelle'


class Variables(models.Model):
    variable = models.CharField(max_length=50)
    long_name = models.CharField(max_length=50)
    produits = models.ForeignKey(Produits, on_delete=models.CASCADE)
    def __unicode__(self):
        return self.variable
    class Meta:
        verbose_name_plural = 'Liste des variables'

