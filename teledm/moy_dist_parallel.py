# -*- coding: utf-8 -*-

from django.conf import settings
from django.core.exceptions import ImproperlyConfigured
import pandas as pd
import geopandas as gpd
import numpy as np
from rasterstats import zonal_stats
from netCDF4 import Dataset, num2date,date2num
from joblib import Parallel, delayed
import time
from datetime import datetime
import os
import warnings
warnings.filterwarnings("ignore")


try:
    ddirDB = getattr(settings, "DIRDB", None)
except ImproperlyConfigured:
    ddirDB = os.path.expanduser('~') + "/Bureau/teledm/donnees"



def calc_stats(rx,ry,gdf,ndist,trsfm,tps):
        # fonction calculant les stats à partir de la géodatabase(gdf). rx,ry = reso spatiale, ndist=nb de districts, trsfm=géométrie de la matrice de la variable, tps=matrice des dates
        # matrices vides aux dimensions du "bloc temporel" (len(tps) correspond à l'axe 0 de la mat tps) et du nombre de districts/aires/pays (ndist)
        nb_px = np.zeros((len(tps),ndist))
        nb_px[:] = np.nan
        v_max = np.zeros((len(tps),ndist))
        v_max[:] = np.nan
        v_mean = np.zeros((len(tps),ndist))
        v_mean[:] = np.nan
        v_med = np.zeros((len(tps),ndist))
        v_med[:] = np.nan
        v_min = np.zeros((len(tps),ndist))
        v_min[:] = np.nan
        v_std = np.zeros((len(tps),ndist))
        v_std[:] = np.nan
        for i in range(len(tps)):
            # "micro-pixelisation" pour obtenir une pseudo-résolution plus fine, adéquate au découpage district/aire
            var1 = np.repeat(tps[i,...],100*ry, axis=0)
            var2 = np.repeat(var1,100*rx, axis=1)
            val_input=np.ma.masked_array(var2, np.isnan(var2))
            stats = zonal_stats(gdf['geometry'],val_input, transform=trsfm, stats=['min', 'max', 'mean', 'count', 'std', 'median'])#fonction stat du module rasterstats
            df = gdf.join(pd.DataFrame(stats))# chargement des stats dans la geodataframe
            # argement des stats dans les différentes matrices
            nb_px[i,:] = np.array(df['count'].ix[:])
            v_max[i,:] = np.array(df['max'].ix[:])
            v_mean[i,:] = np.array(df['mean'].ix[:])
            v_med[i,:] = np.array(df['median'].ix[:])
            v_min[i,:] = np.array(df['min'].ix[:])
            v_std[i,:] = np.array(df['std'].ix[:])
        return nb_px,v_max,v_mean,v_med,v_min,v_std




def calc_moy(ddirout,ncfile,fshape,deb,fin,pays,niveau,types,sat,prod,res_temp,res,varname,level):
    # traitement des dates
    datedeb = datetime.strptime(deb,"%Y-%m-%d")
    datefin = datetime.strptime(fin,"%Y-%m-%d")
    
    
    ddirin = os.path.join(ddirDB, types, sat, prod, res)
    os.chdir(ddirin)
    
    
    geodf = gpd.GeoDataFrame.from_file(fshape)
    
    nbdist = len(geodf[geodf.columns[1]]) # nombre de districts/aires
    listdist='//'.join(geodf[geodf.columns[1]].tolist())# liste des districts/aires de santé qui sera chargée dans le .nc comme attribut de la dimension index   
    
    
    ############################ CREATION NETCDF ##################################################################
    ###############################################################################################################

    output = os.path.join(ddirout, varname + '_' + os.path.basename(ncfile)[:-5] + '_' + niveau + '_' + pays + '_' + deb.replace('-','') + fin.replace('-','')  + '_' + res_temp + '.nc')
    ncnew = Dataset(output, 'w')
    # dimensions#####
    ncnew.createDimension('time', None)
    ncnew.createDimension('index_dist', nbdist)
    # variables#####
    tp = ncnew.createVariable('time','f8',('time',))
    index = ncnew.createVariable('index_dist','f4',('index_dist',))
    index[:] = range(nbdist)
    nbpx = ncnew.createVariable('count','f4',('time','index_dist'))
    vmin = ncnew.createVariable('min','f4',('time','index_dist'))
    vmax = ncnew.createVariable('max','f4',('time','index_dist'))
    vmean = ncnew.createVariable('mean','f4',('time','index_dist'))
    vstd = ncnew.createVariable('std','f4',('time','index_dist'))
    #vmed = ncnew.createVariable('median','f4',('time','index_dist'))
    # attributs#####
    ncnew.Convention ='CF-1.5'
    ncnew.description = 'moyenne districts pour la variable :',varname
    ncnew.history = 'Created ' + time.ctime(time.time())
    ncnew.source = ' '
    index.standard_name = listdist
    tp.standard_name = 'time'
    tp.calendar = 'gregorian'
    #fillvalue = np.nan
    ################################################################################################################
    ################################################################################################################
    
    # initialisation des listes pour les variables, augmentées après chaque tour de boucle
    nbpx_tmp = []
    vmin_tmp = []
    vmax_tmp = []
    vmean_tmp = []
    vstd_tmp = []
    vmed_tmp = []
    nc = Dataset(ncfile, 'r')
    var_in = nc.variables[varname]
    dates = nc.variables['time']
    # definition des dates de début et fin en format numérique, à partir de l'unité de temps du .nc
    ndatedeb = date2num(datedeb,dates.units)
    ndatefin = date2num(datefin,dates.units)
    if datetime.strftime(num2date(dates[0],dates.units),"%H") != "0": # condition qui vérifie l'heure de la donnée(0h, 3h,6h,...)
        ndatedeb += 24-int(datetime.strftime(num2date(dates[0],dates.units),"%H"))
        ndatefin += 24-int(datetime.strftime(num2date(dates[0],dates.units),"%H"))
    # détermination des indices des dates debut et fin dans la matrice
    iddeb = np.abs(dates[:]-ndatedeb).argmin()
    idfin = np.abs(dates[:]-ndatefin).argmin()-1
    # extraction du bloc de dates et ajout à la variable time(tp) du newnc
    serie_dates = dates[iddeb:idfin+1]

    if level == -1:
        var = np.array(var_in[iddeb:idfin+1,...])
    else:
        var = np.array(var_in[iddeb:idfin+1,level,...])
    # traitement de la matrice avec fillvalue, scalefactor et addoffset
    if sat == 'toms':
        var[var==var_in._FillValue]=-999
    else:
    	var[var==var_in._FillValue]=np.nan
    if "scale_factor" in var_in.ncattrs():
        var = (var[:]-var_in.add_offset)*var_in.scale_factor
    # définition des caractéristiques géographiques transform,resolution spatiale, lat max et lon min
    lat = nc.variables['latitude'][:]
    lon = nc.variables['longitude'][:]
    xo = min(lon)
    yo = max(lat)
    resx = np.abs(np.mean(np.diff(lon)))
    resy = np.abs(np.mean(np.diff(lat)))
    transform = [xo, 0.01, 0.0, yo, 0.0, -0.01]

    #############################################################################################################
    #############################################################################################################
    idt = len(serie_dates)//8
    if idt == 0:
        idt = 1
    ndt = range(0,len(serie_dates),idt)
    nb_mat_in = [var[ix:ix+(idt),...] for ix in ndt]# decoupage de la matrice en blocs de 26 jours
    res = Parallel(n_jobs=-1)(delayed(calc_stats)(resx,resy,geodf,nbdist,transform,temps_x) for temps_x in nb_mat_in)# appel de la fonction calc_stats avec parallélisation
    # chargement des calculs dans les variables temporaires
    nbpx_tmp.append(np.concatenate([res[n][0] for n in range(0,len(ndt))], axis=0))
    vmax_tmp.append(np.concatenate([res[n][1] for n in range(0,len(ndt))], axis=0))
    vmean_tmp.append(np.concatenate([res[n][2] for n in range(0,len(ndt))], axis=0))
    vmed_tmp.append(np.concatenate([res[n][3] for n in range(0,len(ndt))], axis=0))
    vmin_tmp.append(np.concatenate([res[n][4] for n in range(0,len(ndt))], axis=0))
    vstd_tmp.append(np.concatenate([res[n][5] for n in range(0,len(ndt))], axis=0))

    # chargement des variables dans le .nc
    tp[:] = np.append(tp[:],serie_dates)
    tp.units = dates.units
    nbpx[:] = np.concatenate([nbpx_tmp[d_t] for d_t in range(0,len(nbpx_tmp))], axis=0)
    vmax[:] = np.concatenate([vmax_tmp[d_t] for d_t in range(0,len(vmax_tmp))], axis=0)
    vmean[:] = np.concatenate([vmean_tmp[d_t] for d_t in range(0,len(vmean_tmp))], axis=0)
    vmin[:] = np.concatenate([vmin_tmp[d_t] for d_t in range(0,len(vmin_tmp))], axis=0)
    vstd[:] = np.concatenate([vstd_tmp[d_t] for d_t in range(0,len(vstd_tmp))], axis=0)
    
    index = [num2date(d,dates.units).date() for d in serie_dates]
    columns_name = geodf.name.values.tolist()
    tmpvar_dict = {"nbpx":nbpx_tmp,"vmax":vmax_tmp,"vmean":vmean_tmp,"vmin":vmin_tmp,"vstd":vstd_tmp}
    list_df = {}
    for n in tmpvar_dict:
        list_df[n] = pd.DataFrame (np.concatenate([tmpvar_dict[n][d_t] for d_t in range(0,len(tmpvar_dict[n]))], axis=0), index=index, columns=columns_name).round(4)
        #df.to_csv(ddirout+'/'+output[:-3]+'_'+n+'.csv', header=True)
    nc.close()
    ncnew.close()
    return list_df, output


if __name__ == "__main__":
    
    ddirout = os.path.join(os.path.expanduser('~'), "dev/crc/teledm/tmp")
    deb = "2007-01-01"     #"1979" a ...
    fin = "2007-01-15"
    pays = "burkina"       #"burkina","mali","niger","senegal"
    niveau = "district"    #"pays","district","aire"
    types = "satellite"    #"satellite","re_analyse"
    sat = "modis"          #"modis","aura_omi","ecmwf","msg"
    prod = "MYD07"         #"MYD04","MYD05","MYD07","omaeruv","seviri_aerus","macc","era_interim"
    res_temp = "w"         #"d","w","m","t"
    res = "res009"            #"003","005","009","025","075","125"
    varname = 'Total_Ozone'
    shape = "merge2500"  # "all_fs" "merge1500" "merge2500"
    
    ldf = calc_moy(ddirout,deb,fin,pays,niveau,types,sat,prod,res_temp,res,varname,shape)
