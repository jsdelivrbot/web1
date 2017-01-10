# -*- coding: utf-8 -*-

import pandas as pd
import numpy as np
from netCDF4 import Dataset, num2date, date2num
from scipy.stats import linregress
from datetime import datetime, timedelta
import subprocess, os
import warnings
warnings.filterwarnings("ignore")

ddirDB = os.path.expanduser('~') + "/Bureau/teledm/donnees/"


def skipRows(debut,fin, filename):
    start = datetime.strftime(debut, format="%Y-%m-%d %H:%M:%S")
    end = datetime.strftime(fin + timedelta(days=1), format="%Y-%m-%d %H:%M:%S")
    grep1 = subprocess.check_output(['grep', '-n', '^'+start, filename]).splitlines()
    id1 = [int(s[:s.index(':')]) for s in grep1][0]
    grep2 = subprocess.check_output(['grep', '-n', '^'+end, filename]).splitlines()
    id2 = [int(s[:s.index(':')]) -1 for s in grep2][0]
    grep3 = subprocess.check_output(['wc', '-l', filename]).split('/')
    id3 = int(grep3[0])
    bad_lines = range(1,id1) + range(id2,id3)
    return bad_lines


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
    var_units = mat_var.units
    #### extraction en fonction du buffer ou des lat/lon
    if not buff:
        lons_idx = np.where((lon > xhg)&(lon < xbd))[0]
        lats_idx = np.where((lat > ybd)&(lat < yhg))[0]
        x_min = lons_idx.min()
        x_max = lons_idx.max()
        y_min = lats_idx.min()
        y_max = lats_idx.max()
        if lev in range(1,6):
            vals = mat_var[idj1:idj2+1 , lev-1, y_min:y_max + 1, x_min:x_max + 1]
        else :
            vals = mat_var[idj1:idj2+1 , y_min:y_max + 1, x_min:x_max + 1]
        colpx = vals.shape[1]*vals.shape[2]
    else:
        z = int(np.sqrt(buff))
        idlon = np.abs(lon-station_lon).argmin()
        idlat = np.abs(lat-station_lat).argmin()
        if lev in range(1,6):
            vals = mat_var[idj1:idj2+1, lev-1, idlat-(z//2):idlat+(z//2)+1,idlon-(z//2):idlon+(z//2)+1]
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
    # retourne droite de régression(line), 
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
    bad_lines = skipRows(debut, fin, csv_file)
    df_csv = pd.read_csv(csv_file, sep=',', parse_dates={'datetime':['date']}, header=0, index_col=0, usecols=['date', variable_csv, "Solar_Zenith_Angle"], skiprows=bad_lines)
    for i in df_in.index :
        if per == '+-1h':
            # si le nombre de valeurs >=4 dansl'intervalle +-1h
            if (df_csv[variable_csv][i-pd.offsets.Hour(1):i+pd.offsets.Hour(1)].count() >= 4) and (df_csv["Solar_Zenith_Angle"][i] <= 71.):
                df_in["moy_"+in_situ].ix[i] = df_csv[variable_csv][i-pd.offsets.Hour(1):i+pd.offsets.Hour(1)].mean()
        elif per == '+-5h':
            # si le nombre de valeurs >=10 dansl'intervalle +-5h
            if (df_csv[variable_csv][i-pd.offsets.Hour(5):i+pd.offsets.Hour(5)].count() >= 10) and (df_csv["Solar_Zenith_Angle"][i] <= 71.):
                df_in["moy_"+in_situ].ix[i] = df_csv[variable_csv][i-pd.offsets.Hour(5):i+pd.offsets.Hour(5)].mean()
    return df_in

def tempo(freq,debut,fin,df_in,prdsat1, insitu, prdsat2):
        # fonction recalculant la période considérée(debut/fin) au pas de temps hebdo ou mensuel(freq) et intégrant les données méningite(path_mening) pour le district considéré(dist) pour les produits (prdsat1,prdsat2) de la dataframe df_in
    # freq = pas de temps, 
    df_out = pd.DataFrame(df_in['pre_moy_'+prdsat1].resample(freq[0], lambda x: count(x)), columns=['pre_moy_'+prdsat1])
    df_out['nb_px_'+prdsat1] = df_in['moy_'+prdsat1].resample(freq[0], lambda x: count_nb_pixel(x)).values
    df_out['moy_'+prdsat1] = df_in['moy_'+prdsat1].resample(freq[0], lambda x: count(x)).values
    if prdsat2:
        df_out['moy_'+prdsat2] = df_in['moy_'+prdsat2].resample(freq[0], lambda x: count(x)).values
        df_out['pre_moy_'+prdsat2] = df_in['pre_moy_'+prdsat2].resample(freq[0], lambda x: count(x)).values
    if insitu:
        df_out['moy_'+insitu] = df_in['moy_'+insitu].resample(freq[0], lambda x: count(x)).values
    return df_out

def heure_passage(station_aeronet):
    # calcul de l'heure de passage du satellite en fonction de la staton aeronet étudiée
    coord_st=pd.read_csv(ddirDB+'in_situ/aeronet/carto_aeronet/coord_aeronet.csv')
    latst=np.asarray(coord_st[coord_st['nom'].isin([station_aeronet])].lat)
    lonst=np.asarray(coord_st[coord_st['nom'].isin([station_aeronet])].lon)
    if np.round(lonst[0]) in np.arange(-25.,-8.):
        heure = 14
    if np.round(lonst[0]) in np.arange(-8.,20.):
        heure = 13
    if np.round(lonst[0]) in np.arange(20.,40.):
        heure = 12
    return heure,lonst,latst

#################################
def scatterSatStation(ulx,uly,lrx,lry,z_buffer,pas_de_temps,periode,datedeb, datefin,
                 type1,sat1,prd_sat1,res_sat1,variable_sat1,level_sat1, 
                 inSitu, station,variable_station,niveau,
                 ):


    start = datetime.strptime(datedeb, "%Y-%m-%d")
    end = datetime.strptime(datefin, "%Y-%m-%d")

    #############################image satellite 1 ####################################
    if sat1 == "toms":
        fichier_sat1 = sat1+'_r'+res_sat1+'_d.nc'
        path_sat1 = ddirDB+type1+'/'+sat1+'/'+'res'+res_sat1+'/'+fichier_sat1
    elif prd_sat1 in ["chimere01","chimere02"]:
        fichier_sat1 = prd_sat1+'_r'+res_sat1+'_d.nc'
        path_sat1 = ddirDB+type1+'/'+sat1+'/'+prd_sat1[:-2]+'/'+'res'+res_sat1+'/'+fichier_sat1
    elif prd_sat1 == 'seviri_aerus':
        fichier_sat1 = 'seviri_r'+res_sat1+'_d.nc'
        path_sat1 = ddirDB+type1+'/'+sat1+'/'+prd_sat1+'/'+'res'+res_sat1+'/'+fichier_sat1
    else:
        fichier_sat1 = prd_sat1+'_r'+res_sat1+'_d.nc'
        path_sat1 = ddirDB+type1+'/'+sat1+'/'+prd_sat1+'/'+'res'+res_sat1+'/'+fichier_sat1

    ########################### donnees in situ 1 ######################################
    if niveau:
        path_station = ddirDB+'in_situ/'+inSitu+'/niveau_'+niveau+'/'+station+'_'+inSitu+'_'+niveau+'_h24_15min.csv'
    else:
        path_station = ddirDB+'in_situ/'+inSitu+'/'+station+'_'+inSitu+'_h24_h.csv'
    ####################################################################################

    hours1,long_st1, lat_st1 = heure_passage(station)
    df_sat1, npx, sat1_units = readNC_box(path_sat1,variable_sat1,ulx,uly,lrx,lry, start, end,prd_sat1, level_sat1,pas_de_temps, hours1, long_st1, lat_st1, z_buffer)
    #chargement des mesures in situ
    df_sat1 = read_csv(path_station, inSitu , variable_station,start, end,periode,df_sat1)
    
    if pas_de_temps == 'd':
        dfout = df_sat1
    else:
        dfout = tempo(pas_de_temps,start,end,df_sat1,prd_sat1, inSitu, "")
    line_station1, rCarre_1, a1,b1, scatterValues1 = scatter_stats(dfout,prd_sat1, inSitu)

    mat = {}
    mat["sat"] = prd_sat1
    mat["satVar"] = variable_sat1
    mat["satVar_units"] = sat1_units
    if z_buffer:
        mat["zone"] = "buffer %d px" % z_buffer
    else:
        mat["zone"] = "zone %.2f, %.2f, %.2f, %.2f " % (ulx, uly, lrx, lry)
    mat["prd"] = inSitu
    mat["station"] = station
    mat["prdVar"] = variable_station
    mat["prdVar_units"] = ""
    mat["dates"] = [str(d.date()) for d in dfout.index[:].to_datetime()]
    mat["periode"] = pas_de_temps
    for c in dfout.columns:
        mat[c] = dfout[c].values.tolist()
    mat["scatterValues"] = scatterValues1      # liste des valeurs sat1/aeronet
    mat["line"] = line_station1                # droite de regression sat1/aeronet
    mat["rCarre"] = rCarre_1                   # rCarre scatterplot sat1/aeronet
    mat["a"] = a1                              # pente de la droite de regr
    mat["b"] = b1                              # intersection
    return mat


def scatter2Sat(ulx,uly,lrx,lry,z_buffer,pas_de_temps,datedeb, datefin,
                 type1,sat1,prd_sat1,res_sat1,variable_sat1,level_sat1, 
                 type2,sat2,prd_sat2,res_sat2,variable_sat2,level_sat2,
                 ):


    start = datetime.strptime(datedeb, "%Y-%m-%d")
    end = datetime.strptime(datefin, "%Y-%m-%d")

    #############################image satellite 1 ####################################
    if sat1 == "toms":
        fichier_sat1 = sat1+'_r'+res_sat1+'_d.nc'
        path_sat1 = ddirDB+type1+'/'+sat1+'/'+'res'+res_sat1+'/'+fichier_sat1
    elif prd_sat1 in ["chimere01","chimere02"]:
        fichier_sat1 = prd_sat1+'_r'+res_sat1+'_d.nc'
        path_sat1 = ddirDB+type1+'/'+sat1+'/'+prd_sat1[:-2]+'/'+'res'+res_sat1+'/'+fichier_sat1
    elif prd_sat1 == 'seviri_aerus':
        fichier_sat1 = 'seviri_r'+res_sat1+'_d.nc'
        path_sat1 = ddirDB+type1+'/'+sat1+'/'+prd_sat1+'/'+'res'+res_sat1+'/'+fichier_sat1
    else:
        fichier_sat1 = prd_sat1+'_r'+res_sat1+'_d.nc'
        path_sat1 = ddirDB+type1+'/'+sat1+'/'+prd_sat1+'/'+'res'+res_sat1+'/'+fichier_sat1
    ############################ image satellite 2 ####################################
    if sat2 == "toms":
        fichier_sat2 = sat2+'_r'+res_sat2+'_d.nc'
        path_sat2 = ddirDB+type2+'/'+sat2+'/'+'res'+res_sat2+'/'+fichier_sat2
    elif prd_sat2 in ["chimere01","chimere02"]:
        fichier_sat2 = prd_sat2+'_r'+res_sat2+'_d.nc'
        path_sat1 = ddirDB+type2+'/'+sat2+'/'+prd_sat2[:-2]+'/'+'res'+res_sat2+'/'+fichier_sat2
    elif prd_sat2 == 'seviri_aerus':
        fichier_sat2 = 'seviri_r'+res_sat2+'_d.nc'
        path_sat2 = ddirDB+type2+'/'+sat2+'/'+prd_sat2+'/'+'res'+res_sat2+'/'+fichier_sat2
    else:
        fichier_sat2 = prd_sat2+'_r'+res_sat2+'_d.nc'
        path_sat2 = ddirDB+type2+'/'+sat2+'/'+prd_sat2+'/'+'res'+res_sat2+'/'+fichier_sat2
    ###################################################################################
        
        
    df_sat1, npx1, sat1_units = readNC_box(path_sat1,variable_sat1,ulx,uly,lrx,lry, start,end, prd_sat1, level_sat1, pas_de_temps)
    df_sat2, npx2, sat2_units = readNC_box(path_sat2,variable_sat2,ulx,uly,lrx,lry, start,end, prd_sat2, level_sat2, pas_de_temps)
    df_sat1_2 = df_sat1.join(df_sat2, how='outer')
    if pas_de_temps == 'd':
        dfout = df_sat1_2
    else:
        dfout = tempo(pas_de_temps,start,end,df_sat1_2,prd_sat1, '' , prd_sat2)
    line_sat, rCarre_sat,a1,b1, scatterValues = scatter_stats(dfout,prd_sat1, prd_sat2)
    mat = {}
    mat["sat"] = prd_sat1
    mat["satVar"] = variable_sat1
    mat["satVar_units"] = sat1_units
    mat["zone"] = "zone %.2f, %.2f, %.2f, %.2f " % (ulx, uly, lrx, lry)
    mat["prd"] = prd_sat2
    mat["prdVar"] = variable_sat2
    mat["prdVar_units"] = sat2_units
    mat["dates"] = [str(d.date()) for d in dfout.index[:].to_datetime()]
    for c in dfout.columns:
        mat[c] = dfout[c].values.tolist()
    mat["scatterValues"] = scatterValues          # liste des valeurs sat1 (nan enleves) / sat2
    mat["line"] = line_sat                        # droite de regression sat1/sat2
    mat["rCarre"] = rCarre_sat                    # rCarre scatterplot sat1/sat2
    mat["a"] = a1                                 # pente de la droite de regr
    mat["b"] = b1                                 # intersection
    return mat

if __name__ == '__main__':

###################### test #########################################################
#####################################################################################

    ddirDB = "/home/sebastien/Bureau/teledm/donnees/"
    ddirout = "/home/sebastien/Bureau/"
    ulx = 0.5
    uly = 20
    lrx = 1.7
    lry = 18.3
    z_buffer = 9
    pas_de_temps = "d"
    periode = "+-5h"
    datedebut = "2007-01-01"
    datefin = "2007-01-31"
    log = ""#'ok'
    ##############################image satellite 1 ####################################
    type1 = "satellite"
    sat1 = "modis"
    prd_sat1 = "MYD04"
    res_sat1 = "009"
    variable_sat1 = "Deep_Blue_Aerosol_Optical_Depth_550_Land"
    level_sat1 = ""
    ############################# image satellite 2 ####################################
    type2 = "satellite"
    sat2 = "aura_omi"
    prd_sat2 = "omaeruv"
    res_sat2 = "025"
    variable_sat2 = "UVAerosolIndex"
    level_sat2 = ""
    ############################ donnees in situ 1 ######################################
    type0 = 'in_situ'
    prd_station1 = 'aeronet'
    niveau = "1_5"
    nom_station1 = "Banizoumbou"
    variable_station1 = "FineModeFraction_500nm[eta]"
    ########################### donnees in situ 2 #######################################
    prd_station2 = 'teom'
    nom_station2 = "Banizoumbou"
    variable_station2 = "concentration"
    ######################################################################################
    ######################################################################################
    aeronet = scatterSatStation(ulx,uly,lrx,lry,z_buffer,pas_de_temps,periode,datedebut, datefin,type1,sat1,prd_sat1,res_sat1,variable_sat1,level_sat1,prd_station1,nom_station1,variable_station1,niveau)
    
    teom = scatterSatStation(ulx,uly,lrx,lry,z_buffer, pas_de_temps,periode,datedebut, datefin,type1,sat1,prd_sat1,res_sat1,variable_sat1,level_sat1,prd_station2,nom_station2,variable_station2,'')
    
    satellite = scatter2Sat(ulx,uly,lrx,lry,z_buffer, pas_de_temps,periode,datedebut, datefin,type1,sat1,prd_sat1,res_sat1,variable_sat1,level_sat1,type2,sat2,prd_sat2,res_sat2,variable_sat2,level_sat2)
    #resultats["matrice"].to_csv(ddirout+"qlt_flag.csv")
    #print resultats[0]
    print "fichier traite"
