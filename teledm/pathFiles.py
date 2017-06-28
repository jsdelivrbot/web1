#!/usr/bin/env python2
# -*- coding: utf-8 -*-

import os
from datetime import datetime
from django.conf import settings


class PathFile(object):

    _ddirDB = '/home/mers/Bureau/teledm/donnees'#settings.DIRDB

    def __init__(self, **kwargs):
        for key, value in kwargs.items():
            print key,' ',value
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
    def nc1(self):
        if 'res' in self.resospatiale1:
            self.resospatiale1 = self.resospatiale1[3:]
        if self.produit1 == 'seviri_aerus':
            fichier = 'seviri_r'+self.resospatiale1+'_'+self.pasdetemps1+'.nc'
        else:
            fichier = self.produit1+'_r'+self.resospatiale1+'_'+self.pasdetemps1+'.nc'
        return os.path.join(self._ddirDB, self.type1, self.capteur1, self.produit1, 'res'+self.resospatiale1, fichier)
    
    @property
    def nc2(self):
        if 'res' in self.resospatiale2:
            self.resospatiale2 = self.resospatiale2[3:]
        if self.produit2 == 'seviri_aerus':
            fichier = 'seviri_r'+self.resospatiale2+'_'+self.pasdetemps2+'.nc'
        else:
            fichier = self.produit2+'_r'+self.resospatiale2+'_'+self.pasdetemps2+'.nc'
        return os.path.join(self._ddirDB, self.type2, self.capteur2, self.produit2, 'res'+self.resospatiale2, fichier)
    
    @property
    def csv(self):
        try:
            pathcsv = os.path.join(self._ddirDB, 'in_situ', self.mesure, 'niveau_'+ self.niveau, self.stations+'_aeronet_'+self.niveau+'_'+self.resoTempo+'.csv')
        except AttributeError as e:
            print e
            try:
                pathcsv = os.path.join(self._ddirDB, 'in_situ', self.mesure, self.stations+'_'+self.mesure+'_'+self.resoTempo+'.csv')
            except AttributeError as e:
                print e
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
    kwargs = {u'csrfmiddlewaretoken': [u'u0qvZXhxZrXEJPazBYqQk2wKhAZzwsoPbr0HrEzsjI5RjyWyHLscwSKlHW5ad73p'], u'type1': [u'satellite'], u'capteur1':[u'modis'], u'produit1': [u'MYD07'], u'resospatiale1': [u'res025'], u'pasdetemps1': [u'd'], u'variable1': [u'Total_Ozone'],u'datedebut':[u'2007-01-01'], u'datefin': [u'2007-01-31'], u'buffer':[u'9'], u'uly': [u''], u'ulx': [u''], u'lrx': [u''], u'lry': [u''], u'stationsaeronet': [u'Banizoumbou'], u'niveau': [u'1_5'], u'variablesaeronet': [u'Total_AOD_500nm%5Btau_a%5D'], u'integration': [u'%2B-1h'], u'epidemio': [u'Type'], u'pays': [u'Pays'], u'echelle': [u'Echelle'], u'district': [u'District'], u'variables': [u'Variable'], u'action': [u'scatterTemporel']}
    kwargs = {u'pasdetemps1': [u'd'], u'ulx': [u''], u'uly': [u''], u'buffer': [u'9'], u'resospatiale1': [u'res025'], u'capteur1': [u'modis'], u'produit1': [u'MYD07'], u'integration': [u'+-1h'], u'variable1': [u'Total_Ozone'], u'datefin': [u'2007-01-31'], u'niveau': [u'1_5'], u'action': [u'scatterTemporel'], u'variablesaeronet': [u'Total_AOD_500nm[tau_a]'], u'lry': [u''], u'lrx': [u''], u'csrfmiddlewaretoken': [u'9YusH2Zi4G1BQ1wwqaXGzHvot4Z0xH0gjiuBmSCzfs4vL9JMD75syIr5gEhtM8xW'], u'datedebut': [u'2007-01-01'], u'type1': [u'satellite'], u'stationsaeronet': [u'Banizoumbou']}
    kwargs = {u'pasdetemps1': [u'd'], u'ulx': [u''], u'uly': [u''], u'mesure': [u'aeronet'], u'buffer': [u'9'], u'capteur1': [u'modis'], u'produit1': [u'MYD07'], u'integration': [u'+-1h'], u'variable1': [u'Total_Ozone'], u'resospatiale1': [u'res025'], u'datedebut': [u'2007-01-01'], u'datefin': [u'2007-01-31'], u'niveau': [u'1_5'], u'variablesaeronet': [u'Total_AOD_500nm[tau_a]'], u'action': [u'scatterTemporel'], u'lrx': [u''], u'csrfmiddlewaretoken': [u'yoWMXoEIuk9QLqABlix6HqrxCzRE6yjCPq5j7ZjtdFk58KlCRAQqRegHyhF9lMNs'], u'lry': [u''], u'type1': [u'satellite'], u'stations': [u'Banizoumbou']}
    PathFile(**kwargs).nc1
    os.path.exists(PathFile(**kwargs).nc1)
    PathFile(**kwargs).csv
    PathFile(decoupage=['aire'], shape=['merge2500'], pays=kwargs['pays'], datefin=kwargs['datefin']).carto
    pathcsv = os.path.join(PathFile._ddirDB, 'in_situ', kwargs['mesure'][0], 'niveau_'+ kwargs['niveau'][0], kwargs['stations'][0]+'_aeronet_'+kwargs['niveau'][0]+'_'+kwargs['resoTempo'][0]+'.csv')
