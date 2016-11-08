# -*- coding: utf-8 -*-


import pandas as pd
import geopandas as gpd
import numpy as np
from rasterstats import raster_stats
from netCDF4 import Dataset, num2date,date2num
from joblib import Parallel, delayed
import time
from datetime import datetime
import os
import glob
import warnings
warnings.filterwarnings("ignore")
######################################################################################################################
######################################################################################################################
######################################################################################################################
######################################################################################################################
################### liste des variables

### prod: omaeruv
#5d 'AerosolOpticalDepthVsHeight','AerosolSingleScattAlbVsHeight','AerosolAbsOpticalDepthVsHeight'
#4d 'SurfaceAlbedo','Reflectivity','NormRadiance','FinalAerosolSingleScattAlb','FinalAerosolAbsOpticalDepth','FinalAerosolOpticalDepth']
#3d 'UVAerosolIndex','AIRSL3COvalue', 'FinalAerosolLayerHeight'

### prod: MYD04
#3d 'Deep_Blue_Aerosol_Optical_Depth_550_Land','Deep_Blue_Angstrom_Exponent_Land'

### prod: MYD05
#3d 'Water_Vapor_Infrared'

### prod: MYD07
#3d 'Total_Ozone','Lifted_Index','Skin_Temperature'

### prod: seviri_aerus
#3d 'ANGS_06_16','AOD_VIS06','CK_VIS06'

### prod: macc
#3d 'tcw','bld','blh','ewss','nsss','gtco3','aod550','ssaod550','duaod550','omaod550','bcaod550','suaod550','aod469','aod670','aod865','aod1240','skt','fal','fsr','aerdep'

### prod: era_interim
#3d 'sp','tcw','tcwv','bld','sshf','slhf','blh','u10','v10','t2m','ewss','nsss','tco3','iews','inss','ishf','ie','fg10','uvb','tclw'


######################################################################################################################
######################################################################################################################
######################################################################################################################
######################################################################################################################

#deb = sys.argv[1]
#fin = sys.argv[2]
#varname = sys.argv[3]
#
#niveau = "aire"    #"pays","district","aire"
#shape = "merge2500"  # "all_fs" "merge1500" "merge2500"
#pays = "burkina"       #"burkina","mali","niger","senegal"
##deb = "2003-07-01"     #"1979" a ...
##fin = "2004-06-30"
#res_temp = "t"         #"d","w","m","t"
#types = "re_analyse"    #"satellite","re_analyse"
#sat = "ecmwf"          #"modis","aura_omi","ecmwf","msg"
#prod = "era_interim"         #"MYD04","MYD05","MYD07","omaeruv","seviri_aerus","macc","era_interim"
#res = "075"            #"003","005","009","025","075","125"
##varname = 'Deep_Blue_Aerosol_Optical_Depth_550_Land'
#level = ''             #"","0","1","2","3","4" levels ou paliers à renseigner pour les variables 5d du produit omaeruv
#onde = ''              #"","0","1","2" longueur d'onde (1=354nm, 2=358nm, 3=500nm) à renseigner pour les variables 4d et 5d du produit omaeruv
#ddirout = "/work/crct/se5780me/calculs_aires_sante_burkina/"+shape+"/"
######################################################################################################################
######################################################################################################################
######################################################################################################################
######################################################################################################################

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
            stats = raster_stats(gdf['geometry'],val_input, transform=trsfm, stats=['min', 'max', 'mean', 'count', 'std', 'median'])#fonction stat du module rasterstats
            df = gdf.join(pd.DataFrame(stats))# chargement des stats dans la geodataframe
    	#chargement des stats dans les différentes matrices
            nb_px[i,:] = np.array(df['count'].ix[:])
            v_max[i,:] = np.array(df['max'].ix[:])
            v_mean[i,:] = np.array(df['mean'].ix[:])
            v_med[i,:] = np.array(df['median'].ix[:])
            v_min[i,:] = np.array(df['min'].ix[:])
            v_std[i,:] = np.array(df['std'].ix[:])
        return nb_px,v_max,v_mean,v_med,v_min,v_std




def calc_moy(ddirout,deb,fin,pays,niveau,types,sat,prod,res_temp,res,varname,shape):
    # traitement des dates
    datedeb = datetime.strptime(deb,"%Y-%m-%d")
    datefin = datetime.strptime(fin,"%Y-%m-%d")
    anfin = datetime.strptime(fin,"%Y-%m-%d").strftime("%Y")
    
    
    ddirin = "/home/sebastien/Bureau/teledm/donnees/"+types+"/"+sat+"/"+prod+"/res"+res
    os.chdir(ddirin)
    
    files = sorted(glob.glob(prod+'*'+res_temp+'.nc'))#liste des fichiers .nc
    
    print "\n#########################################################################################################################"
    print "############################################## PERIODE "+deb+" "+fin+" ############################################"
    
    ################ import shapefile #############################################################################
    if niveau == "aire":
        if shape == "all_fs":
    		try:
    			#fshape = '/work/crct/se5780me/carto/fs_par_annee/'+shape+'/150409_BF_FS_2015.shp'
    			fshape = '/home/sebastien/Bureau/teledm/carto/fs_par_annee/'+shape+'/150409_BF_FS_'+anfin+'.shp'
    			geodf = gpd.GeoDataFrame.from_file(fshape)
    		except:
    			fshape = '/home/sebastien/Bureau/teledm/carto/fs_par_annee/all_fs/150409_BF_FS_2015.shp'
    			geodf = gpd.GeoDataFrame.from_file(fshape)
        else:
    		try:
    			fshape = '/home/sebastien/Bureau/teledm/carto/fs_par_annee/'+shape+'/150409_BF_FS_'+shape+'_'+anfin+'.shp'
    			#fshape = '/work/crct/se5780me/carto/fs_par_annee/'+shape+'/150409_BF_FS_'+shape+'2015.shp'
    			geodf = gpd.GeoDataFrame.from_file(fshape)
    		except:
    			fshape = '/home/sebastien/Bureau/teledm/carto/fs_par_annee/'+shape+'/150409_BF_FS_'+shape+'_2015.shp'
    			geodf = gpd.GeoDataFrame.from_file(fshape)  
    else:
        fshape = '/home/sebastien/Bureau/teledm/carto/'+niveau+'/'+pays+'_'+niveau+'_sante.shp'
        geodf = gpd.GeoDataFrame.from_file(fshape)
    
    nbdist = len(geodf[geodf.columns[1]]) # nombre de districts/aires
    listdist='//'.join(geodf[geodf.columns[1]].tolist())# liste des districts/aires de santé qui sera chargée dans le .nc comme attribut de la dimension index
    print "shapefile utilise: ",fshape.split("/")[-1]
    print "nombre de districts/aires de sante: ",nbdist
    ###############################################################################################################
    
    
    
    ############################ CREATION NETCDF ##################################################################
    ###############################################################################################################
    if varname == "Deep_Blue_Aerosol_Optical_Depth_550_Land":
        varname1 = "AOT"
    else:
        varname1 = varname
    output = varname1+'_'+files[0][:-5]+'_'+niveau+'_'+shape+'_'+pays+'_'+ deb.replace('-','') + fin.replace('-','')  + res_temp + '.nc'
#    ncnew = Dataset(ddirout+ '/' + output, 'w')
#    # dimensions#####
#    ncnew.createDimension('time', None)
#    ncnew.createDimension('index_dist', nbdist)
#    # variables#####
#    tp = ncnew.createVariable('time','f8',('time',))
#    index = ncnew.createVariable('index_dist','f4',('index_dist',))
#    index[:] = range(nbdist)
#    nbpx = ncnew.createVariable('count','f4',('time','index_dist'))
#    vmin = ncnew.createVariable('min','f4',('time','index_dist'))
#    vmax = ncnew.createVariable('max','f4',('time','index_dist'))
#    vmean = ncnew.createVariable('mean','f4',('time','index_dist'))
#    vstd = ncnew.createVariable('std','f4',('time','index_dist'))
#    #vmed = ncnew.createVariable('median','f4',('time','index_dist'))
#    # attributs#####
#    ncnew.Convention ='CF-1.5'
#    ncnew.description = 'moyenne districts pour la variable :',varname
#    ncnew.history = 'Created ' + time.ctime(time.time())
#    ncnew.source = ' '
#    index.standard_name = listdist
#    tp.standard_name = 'time'
#    tp.calendar = 'gregorian'
#    #fillvalue = np.nan
    ################################################################################################################
    ################################################################################################################
    
    # initialisation des listes pour les variables, augmentées après chaque tour de boucle
    nbpx_tmp = []
    vmin_tmp = []
    vmax_tmp = []
    vmean_tmp = []
    vstd_tmp = []
    vmed_tmp = []
    t0 = time.time() # démarrage du temps de calcul
    print "\nfichier en traitement: ",files[0]
    nc = Dataset(files[0], 'r')
    var_in = nc.variables[varname]
    dates = nc.variables['time']
    # definition des dates de début et fin en format numérique, à partir de l'unité de temps du .nc
    ndatedeb = date2num(datedeb,dates.units)
    ndatefin = date2num(datefin,dates.units)
    if datetime.strftime(num2date(dates[0],dates.units),"%H") != "0": # condition qui vérifie l'heure de la donnée(0h, 3h,6h,...)
        ndatedeb += 24-int(datetime.strftime(num2date(dates[0],dates.units),"%H"))
        ndatefin += 24-int(datetime.strftime(num2date(dates[0],dates.units),"%H"))
    # détermination des indices des dates debut et fin dans la matrice
#    if ndatedeb >= dates[0] and ndatedeb <= dates[-1]:
    iddeb = np.abs(dates[:]-ndatedeb).argmin()
#    else:
#        iddeb = 0
#    if ndatefin >= dates[0] and ndatefin <= dates[-1]:
    idfin = np.abs(dates[:]-ndatefin).argmin()-1
#    else:
#        idfin = len(dates[:])-1
    # extraction du bloc de dates et ajout à la variable time(tp) du newnc
    serie_dates = dates[iddeb:idfin+1]
    print "date de debut: ",num2date(serie_dates[0], dates.units)
    print "date de fin: ",num2date(serie_dates[-1], dates.units)

    var = np.array(var_in[iddeb:idfin+1,...])
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
        
    t1 = time.time()-t0
    print "\nelapsed time: ",t1,"sec"
    print "fichier en sortie: ",output
    print "rep de sortie: ",ddirout
    print "#########################################################################################################################"
    print "#########################################################################################################################"
    print "#########################################################################################################################\n\n"
    # chargement des variables dans le .nc
#    tp[:] = np.append(tp[:],serie_dates)
#    tp.units = dates.units
#    nbpx[:] = np.concatenate([nbpx_tmp[d_t] for d_t in range(0,len(nbpx_tmp))], axis=0)
#    vmax[:] = np.concatenate([vmax_tmp[d_t] for d_t in range(0,len(vmax_tmp))], axis=0)
#    vmean[:] = np.concatenate([vmean_tmp[d_t] for d_t in range(0,len(vmean_tmp))], axis=0)
#    vmin[:] = np.concatenate([vmin_tmp[d_t] for d_t in range(0,len(vmin_tmp))], axis=0)
#    vstd[:] = np.concatenate([vstd_tmp[d_t] for d_t in range(0,len(vstd_tmp))], axis=0)
    
    index = [num2date(d,dates.units).date() for d in serie_dates]
    columns_name = geodf.name.values.tolist()
    tmpvar_dict = {"nbpx":nbpx_tmp,"vmax":vmax_tmp,"vmean":vmean_tmp,"vmin":vmin_tmp,"vstd":vstd_tmp}
#    writer = pd.ExcelWriter(ddirout+output[:-3]+'.xlsx')
    list_df = {}
    for n in tmpvar_dict:
        df = n+'_df'
        df = pd.DataFrame (np.concatenate([tmpvar_dict[n][d_t] for d_t in range(0,len(tmpvar_dict[n]))], axis=0), index=index, columns=columns_name).round(4)
#        df.T.to_excel(writer, sheet_name=name)
        list_df[n] = df
        
    nc.close()
#    ncnew.close()
    return list_df


if __name__ == "__main__":
    
    ddirout = "/home/sebastien/dev/web1/teledm/tmp"
    deb = "2007-01-01"     #"1979" a ...
    fin = "2007-05-31"
    pays = "burkina"       #"burkina","mali","niger","senegal"
    niveau = "district"    #"pays","district","aire"
    types = "satellite"    #"satellite","re_analyse"
    sat = "modis"          #"modis","aura_omi","ecmwf","msg"
    prod = "MYD04"         #"MYD04","MYD05","MYD07","omaeruv","seviri_aerus","macc","era_interim"
    res_temp = "w"         #"d","w","m","t"
    res = "009"            #"003","005","009","025","075","125"
    varname = 'Deep_Blue_Surface_Reflectance_Land_412_nm'
    shape = "merge2500"  # "all_fs" "merge1500" "merge2500"
    
    ldf = calc_moy(ddirout,deb,fin,pays,niveau,types,sat,prod,res_temp,res,varname,shape)
