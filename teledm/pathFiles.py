#!/usr/bin/env python2
# -*- coding: utf-8 -*-

import os
from datetime import datetime
from django.conf import settings


class PathFile(object):

    _ddirDB = '/home/mers/Bureau/teledm/donnees'#settings.DIRDB

    def __init__(self, **kwargs):
        for key, value in kwargs.items():
            if isinstance(value, basestring):
                setattr(self, key, value)
            else:
                setattr(self, key, value[0])

    @property
    def nc(self):
        if 'res' in self.resospatiale:
            self.resospatiale = self.resospatiale[3:]
        if self.produit == 'seviri_aerus':
            fichier = 'seviri_r'+self.resospatiale+'_'+self.pasdetemps+'.nc'
        else:
            fichier = self.produit+'_r'+self.resospatiale+'_'+self.pasdetemps+'.nc'
        return os.path.join(self._ddirDB, self.type, self.capteur, self.produit, 'res'+self.resospatiale, fichier)
    
    @property
    def csv(self):
        try:
            pathcsv = os.path.join(self._ddirDB, 'in_situ', self.mesure, 'niveau_'+ self.niveau, self.stations+'_aeronet_'+self.niveau+'_'+self.resoTempo+'.csv')
        except AttributeError:
            try:
                pathcsv = os.path.join(self._ddirDB, 'in_situ', self.mesure, self.stations+'_'+self.mesure+'_'+self.resoTempo+'.csv')
            except AttributeError:
                pathcsv = os.path.join(self._ddirDB, 'in_situ/epidemiologie', self.epidemio, self.pays+'_'+self.epidemio+'_'+self.echelle+'.csv')
        return pathcsv
    
    @property
    def carto(self):
        print self.datefin
        self.year = datetime.strptime(self.datefin,"%Y-%m-%d").strftime("%Y")
        if self.decoupage == "aire":
            if self.shape == "all_fs":
        		pathshape = os.path.join(self._ddirDB, 'carto/fs_par_annee', self.shape, '150409_BF_FS_'+self.year+'.shp')
        		if not os.path.exists(pathshape):
        			pathshape = os.path.join(self._ddirDB, 'carto/fs_par_annee/all_fs/150409_BF_FS_2015.shp')
            else:
        		pathshape = os.path.join(self._ddirDB, 'carto/fs_par_annee', self.shape, '150409_BF_FS_'+self.shape+'_'+self.year+'.shp')
        		if not os.path.exists(pathshape):
        			pathshape = os.path.join(self._ddirDB, 'carto/fs_par_annee', self.shape, '150409_BF_FS_'+self.shape+'_2015.shp')
        else:
            pathshape = os.path.join(self._ddirDB, 'carto', self.decoupage, self.pays+'_'+self.decoupage+'_sante.shp')
        return pathshape


if __name__ == "__main__":
    kwargs = {u'variable': [u'incidence'], u'pays': [u'Burkina'], u'epidemio': [u'meningite'], u'district': [u'Barsalogo'], u'echelle': [u'district']}
    kwargs = {u'niveau': [u'1_5'], u'variables': [u'Total_AOD_500nm[tau_a]'], u'stations': [u'Banizoumbou'], u'resoTempo': [u'diurne_d'], u'mesure': [u'aeronet']}
    kwargs = {u'pays': [u'Burkina'], u'epidemio': [u'meningite'], u'variables': [u'population'], u'echelle': [u'pays']}
    kwargs = {u'produit': [u'MYD07'], u'decoupage': [u'district'], u'pays': [u'burkina'], u'variables': [u'Total_Ozone'], u'resospatiale': [u'res025'], u'pasdetemps': [u'd'], u'capteur': [u'modis'], u'datefin': [u'2002-07-31'], u'csrfmiddlewaretoken': [u'CaXUu2ppIRIr8D2Xz58fEhADbNWBvtGZqvm5l9FNFDXo8FdpYz9HNZW41o9usaoB'], u'datedebut': [u'2002-07-09'], u'type': [u'satellite']}
    PathFile(**kwargs).nc
    os.path.exists(PathFile(**kwargs).nc)
    PathFile(decoupage=['aire'], shape=['merge2500'], pays=kwargs['pays'], datefin=kwargs['datefin']).carto
