#!/usr/bin/env python2
# -*- coding: utf-8 -*-


# -*- coding: utf-8 -*-

import pandas as pd
import geopandas as gpd
import numpy as np
from netCDF4 import Dataset, num2date, date2num
from scipy.stats import linregress
from datetime import datetime, timedelta
from joblib import Parallel, delayed
from rasterstats import zonal_stats
import subprocess, os
import warnings
warnings.filterwarnings("ignore")


def pxFlag(arr):
    nbpx = arr[-3]
    moy = arr[-2]
    std = arr[-1]
    array = np.zeros(3)
    array[:] = np.nan
    pxvalide = np.where((arr[:-3] > (moy - std*2)) & (arr[:-3] < (moy + std*2)))[0].size
    if (nbpx / arr[:-3].size > 0.33) & (pxvalide > 0):
        array[0] = pxvalide
        if ((pxvalide / float(nbpx)) >= 0.33) & ((pxvalide / float(nbpx)) < 0.66):
            array[1] = moy
            array[2] = 2
        elif pxvalide / nbpx >= 0.66:
            array[1] = moy
            array[2] = 1
        else:
            array[2] = 3
        return array
    else:
        return array


def readNC_box(nc_file, variable, xhg, yhg, xbd, ybd, date1, date2,prd_sat, lev, frequence, h_passage=13,station_lon=[], station_lat=[], buff=[]):
    """
    Fonction permettant d'extraire d un fichier netcdf(nc_file) une 'boite (xhaut gauche, yhg, xbas droite, ybd)' de la date date1 à la date date2
    pour la variable(variable) au 'palier/altitude' lev, la longueur d'onde onde.La fréquence=pas de temps. L'heure de passage est par defaut 13h et est modifiee 
    en fonction de la longitude de la station(cf fonction heure_passage). Les 3 dernieres variables sont par defaut vides et ne 
    sont renseignees que pour une comparaison station aeronet/ image satellite.
    Elle retourne une data frame avec une colonne par pixel, une "pre-moyenne"(sans exclusion de valeurs) par image sat, une moyenne par image sat,
    moyenne aeronet, moyenne teom, nb pixels par image sat, nb pixels "valides" (non nan) par image sat, le px flag pour chaque image sat
    """
    print nc_file
    nc = Dataset(nc_file, 'r')
    temps = nc.variables['time']
    idj1 = np.abs(temps[:]-date2num(date1,temps.units)).argmin()#indice de la date de debut
    idj2 = np.abs(temps[:]-date2num(date2,temps.units)).argmin()#indice de la date de fin
    lat = nc.variables['latitude'][:]
    lon = nc.variables['longitude'][:]
    mat_var = nc.variables[variable]
    try:
        var_units = mat_var.units
    except AttributeError:
        var_units = ""
    #### extraction en fonction du buffer ou des lat/lon
    if not buff:
        lons_idx = np.where((lon > xhg)&(lon < xbd))[0]
        lats_idx = np.where((lat > ybd)&(lat < yhg))[0]
        x_min = lons_idx.min()
        x_max = lons_idx.max()
        y_min = lats_idx.min()
        y_max = lats_idx.max()
        if lev >= 0:
            vals = mat_var[idj1:idj2+1 , lev, y_min:y_max + 1, x_min:x_max + 1]
        else :
            vals = mat_var[idj1:idj2+1 , y_min:y_max + 1, x_min:x_max + 1]
        colpx = vals.shape[1]*vals.shape[2]
    else:
        z = int(np.sqrt(buff))
        idlon = np.abs(lon-station_lon).argmin()
        idlat = np.abs(lat-station_lat).argmin()
        if lev in range(1,6):
            vals = mat_var[idj1:idj2+1, lev, idlat-(z//2):idlat+(z//2)+1,idlon-(z//2):idlon+(z//2)+1]
        else:
            vals = mat_var[idj1:idj2+1, idlat-(z//2):idlat+(z//2)+1,idlon-(z//2):idlon+(z//2)+1]

        colpx = buff
    #######
    vals1 = vals.reshape(vals.shape[0],vals.shape[1]*vals.shape[2])
    index = pd.date_range(num2date(temps[idj1],temps.units),num2date(temps[idj2],temps.units),freq='D') + pd.offsets.Hour(h_passage)
    df = pd.DataFrame(vals1,index=index)
    nc.close()
    df.columns = [(str(df.columns[n])+"_"+prd_sat) for n in range(len(df.columns))]
    df['nbpx_'+prd_sat] = (vals.shape[1]*vals.shape[2])-np.ma.count_masked(vals,axis=(1,2))#calcul du nb de pixels non nuls
    df['pre_moy_'+prd_sat] = np.nanmean(vals.filled(np.nan),axis=(1,2))# moyenne des pixels excluant les px nuls
    df['std_'+prd_sat] = np.nanstd(vals.filled(np.nan),axis=(1,2))# écart-type des pixels excluant les px nuls
    df['nbpxvalide_'+prd_sat] = np.nan
    df['moy_'+prd_sat] = np.nan
    df['px_flag_'+prd_sat] = np.nan
    mpx = df[df.columns[:colpx+3]].values
    lmpx = [np.squeeze(x,0) for x in np.split(mpx,mpx.shape[0], axis=0)]
    df[['nbpxvalide_'+prd_sat, 'moy_'+prd_sat, 'px_flag_'+prd_sat]] = np.vstack([pxFlag(m) for m in lmpx])
    return df, colpx, var_units
    
def count_nb_pixel(x):
    # fonction de comptage du nb de px
    nb = np.count_nonzero(~np.isnan(x))
    return nb
    
def count(x):
    # fonction qui calcule la moyenne si le nb de px non nul/nb px >= 0.7 sinon retourne nan
    try:
        if np.count_nonzero(~np.isnan(x))/float(np.count_nonzero(x)) >= 0.7:
            v = np.nanmean(x)
        else:
            v =  np.nan
    except ZeroDivisionError:
        v =  np.nan
    return v

def scatter_stats(df,prd1,prd2):
    #fonction qui extrait la pente(slope),origine(intercept),coeff corr(r_value), ... de la dataframe(df) pour les valeurs des produits prd1(sat1) et prd2(sat2 ou aeronet ou teom)
    # retourne droite de régression(lregr, r2, pente, origine, valeurs), 
    if 'moy_'+prd2 in df.columns:
        mask = ~pd.isnull(df['moy_'+prd1]) & ~pd.isnull(df['moy_'+prd2])# masque excluant les lignes n'ayant qu'une valeur sur les 2
        slope, intercept, r_value, p_value, std_err = linregress(df[['moy_'+prd2,'moy_'+prd1]][mask])
        r2 = round(r_value**2, 5)
        line = slope*df['moy_'+prd2][mask].values+intercept
        lregr = [list(a) for a in zip(df['moy_'+prd2][mask].values.tolist(), line)]
        scatValues = [list(a) for a in zip(df['moy_'+prd2][mask].values.tolist(), df['moy_'+prd1][mask].values.tolist())]
        return lregr, r2, slope, intercept, scatValues
    else:
        return 0,0,0,0,0
    
def read_csv(csv_file,in_situ,variable_csv, debut, fin,per,df_in):
    # fonction intégrant les données issues du .csv(csv_file) dans le dataframe (df_in), dans l'intervalle de temps debut/fin
    # in_situ = teom ou aeronet, per = périodicité
    print csv_file
    df_in["moy_" + in_situ] = np.nan
    try:
        df_csv = pd.read_csv(csv_file, sep=',', parse_dates={'datetime':['date']}, header=0, index_col=0, usecols=[u'date', variable_csv, u"Solar_Zenith_Angle"])
    except ValueError:
        df_csv = pd.read_csv(csv_file, sep=',', parse_dates={'datetime':['date']}, header=0, index_col=0, usecols=[u'date', variable_csv])
    for i in df_in.index :
        if per == '+-1h':
            # si le nombre de valeurs >=4 dansl'intervalle +-1h
            if (df_csv[variable_csv][i-pd.offsets.Hour(1):i+pd.offsets.Hour(1)].count() >= 4) and (df_csv["Solar_Zenith_Angle"][i] <= 71.):
                df_in["moy_"+in_situ].ix[i] = df_csv[variable_csv][i-pd.offsets.Hour(1):i+pd.offsets.Hour(1)].mean()
        elif per == '+-5h':
            # si le nombre de valeurs >=10 dansl'intervalle +-5h
            if (df_csv[variable_csv][i-pd.offsets.Hour(5):i+pd.offsets.Hour(5)].count() >= 10) and (df_csv["Solar_Zenith_Angle"][i] <= 71.):
                df_in["moy_"+in_situ].ix[i] = df_csv[variable_csv][i-pd.offsets.Hour(5):i+pd.offsets.Hour(5)].mean()
        else:
            df_in["moy_"+in_situ].ix[i] = df_csv[variable_csv].ix[df_csv.index.get_loc(i,method='nearest')]
    return df_in


