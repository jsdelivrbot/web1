# -*- coding: utf-8 -*-

import pandas as pd
import numpy as np
from netCDF4 import Dataset, num2date, date2num
from scipy.stats import linregress
from datetime import datetime
import sys
import warnings
warnings.filterwarnings("ignore")

pd.set_option('display.width',120)
pd.set_option('display.max_columns', 50)
pd.set_option('display.max_rows', 150)


ddir = "/home/sebastien/Bureau/teledm/donnees/"

def pxFlag(arr):
    nbpx = arr[-3]
    moy = arr[-2]
    std = arr[-1]
    array = np.zeros(3)
    array[:] = np.nan
    pxvalide = np.where((arr[:-3] > (moy - std*2)) & (arr[:-3] < (moy + std*2)))[0].size
    if nbpx != 0:
        pct = (pxvalide / float(nbpx))*100
    else:
        pct = np.nan
    print('array {}'.format(arr))
    print('{} px valides, nb pixels {}, pourcentage: {}'.format(pxvalide, nbpx, pct))
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
        print np.round(nbpx,1),'  ',pxvalide,'  ',np.round(pxvalide / float(nbpx),1),'  ',array[2]
        return array
    else:
        print 'nan'
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
    #### extraction en fonction du buffer ou des lat/lon
    if not buff:
        lons_idx = np.where((lon > xhg)&(lon < xbd))[0]
        lats_idx = np.where((lat > ybd)&(lat < yhg))[0]
        x_min = lons_idx.min()
        x_max = lons_idx.max()
        y_min = lats_idx.min()
        y_max = lats_idx.max()
        if lev in range(1,6):
            vals = nc.variables[variable][idj1:idj2+1 , lev-1, y_min:y_max + 1, x_min:x_max + 1]
        else :
            vals = nc.variables[variable][idj1:idj2+1 , y_min:y_max + 1, x_min:x_max + 1]
        colpx = vals.shape[1]*vals.shape[2]
    else:
        z = int(np.sqrt(buff))
        idlon = np.abs(lon-station_lon).argmin()
        idlat = np.abs(lat-station_lat).argmin()
        if lev in range(1,6):
            vals = nc.variables[variable][idj1:idj2+1, lev-1, idlat-(z//2):idlat+(z//2)+1,idlon-(z//2):idlon+(z//2)+1]
        else:
            vals = nc.variables[variable][idj1:idj2+1, idlat-(z//2):idlat+(z//2)+1,idlon-(z//2):idlon+(z//2)+1]

        colpx = buff
    #######
    vals1 = vals.reshape(vals.shape[0],vals.shape[1]*vals.shape[2])
    df = pd.DataFrame(vals1,index=pd.date_range(num2date(temps[idj1],temps.units),num2date(temps[idj2],temps.units),freq='D') + pd.offsets.Hour(h_passage))
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

    return df, colpx
    
def count_nb_pixel(x):
    # fonction de comptage du nb de px
    nb = np.count_nonzero(~np.isnan(x))
    return nb
    
def count(x):
    # fonction qui calcule la moyenne si le nb de px non nul/nb px > 0.7 sinon retourne nan
    try:
        if np.count_nonzero(~np.isnan(x))/float(np.count_nonzero(x)) > 0.7:
            v = np.nanmean(x)
        else:
            v =  np.nan
    except ZeroDivisionError:
        v =  np.nan
    return v

def scatter_stats(df,prd1,prd2):
    #fonction qui extrait la pente(slope),origine(intercept),coeff corr(r_value), ... de la dataframe(df) pour les valeurs des produits prd1 et prd2
    # retourne droite de régression(line), 
    if 'moy_'+prd2 in df.columns:
        mask = ~pd.isnull(df['moy_'+prd1]) & ~pd.isnull(df['moy_'+prd2])# masque excluant les lignes n'ayant qu'une valeur sur les 2
        slope, intercept, r_value, p_value, std_err = linregress(df[['moy_'+prd2,'moy_'+prd1]][mask])
        r2 = round(r_value**2, 5)
        line = slope*df['moy_'+prd2].values+intercept
        print "slope ",slope
        print "intercept ",intercept
        return line, r2, mask,slope,intercept
    else:
        return 0,0,0,0,0
    
def read_csv(csv_file,in_situ,variable_csv, debut, fin,per,df_in):
    # fonction intégrant les données issues du .csv(csv_file) dans le dataframe (df_in), dans l'intervalle de temps debut/fin
    # in_situ = teom ou aeronet, per = périodicité
    datas = pd.read_csv(csv_file, sep=',', parse_dates={'datetime':['date']}, header=0, index_col=0)
    var = [variable_csv]+["Solar_Zenith_Angle"]
    if datas.index[0] <= debut and debut <= datas.index[-1]:
        df_in["moy_"+in_situ] = np.nan
        index = pd.date_range(debut,fin+pd.offsets.Day(1))
        df_csv = pd.DataFrame(datas[str(debut):str(fin+pd.offsets.Day(1))][var])
        for i in df_in.index :
                    if per == '+-1h':
			# si le nombre de valeurs >=4 dansl'intervalle +-1h
                        if (df_csv[variable_csv][i-pd.offsets.Hour(1):i+pd.offsets.Hour(1)].count() >=4) and (df_csv["Solar_Zenith_Angle"][i] <= 71.):
                            df_in["moy_"+in_situ].ix[i] = df_csv[variable_csv][i-pd.offsets.Hour(1):i+pd.offsets.Hour(1)].mean()
                    elif per == '+-5h':
			# si le nombre de valeurs >=4 dansl'intervalle +-1h
                        if (df_csv[variable_csv][i-pd.offsets.Hour(5):i+pd.offsets.Hour(5)].count() >=10) and (df_csv["Solar_Zenith_Angle"][i] <= 71.):
                            df_in["moy_"+in_situ].ix[i] = df_csv[variable_csv][i-pd.offsets.Hour(5):i+pd.offsets.Hour(5)].mean()
    return df_in

def tempo(path_mening,dist,freq,debut,ydeb,fin,df_in,prdsat1,prdsat2=[]):
        # fonction recalculant la période considérée(debut/fin, ydeb) au pas de temps hebdo ou mensuel(freq) et intégrant les données méningite(path_mening) pour le district considéré(dist) pour les produits (prdsat1,prdsat2) de la dataframe df_in
	# freq = pas de temps, 
    index = pd.date_range(start=debut,end=fin, freq=freq[0])
    df_out = pd.DataFrame(df_in['pre_moy_'+prdsat1].resample(freq[0], lambda x: count(x)),index=index,columns=['pre_moy_'+prdsat1])
    df_out['nb_px_'+prdsat1] = df_in['moy_'+prdsat1].resample(freq[0], lambda x: count_nb_pixel(x))[index]
    df_out['moy_'+prdsat1] = df_in['moy_'+prdsat1].resample(freq[0], lambda x: count(x))[index]
    if len(prdsat2):
        df_out['moy_'+prdsat2] = df_in['moy_'+prdsat2].resample(freq[0], lambda x: count(x))[index]
        df_out['pre_moy_'+prdsat2] = df_in['pre_moy_'+prdsat2].resample(freq[0], lambda x: count(x))[index]
    if "moy_aeronet" in df_in.columns:
        df_out['moy_aeronet'] = df_in['moy_aeronet'].resample(freq[0], lambda x: count(x))[index]
    if "moy_teom" in df_in.columns:
        df_out['moy_teom'] = df_in['moy_teom'].resample(freq[0], lambda x: count(x))[index]
        df_out.insert(0,'semaine',df_out.index.weekofyear)
    if path_mening:
        df_meningite = pd.read_csv(path_mening,parse_dates={'datetime':['date']},header=0,index_col=0)
        if ydeb in df_meningite.index.year:
            if freq[0] =="w":
                df_mening = df_meningite[(df_meningite['district']== dist) & (df_meningite['semaine'].isin(df_out['semaine']))][str(ydeb)]       
                df_out = pd.merge(df_out,df_mening[['semaine','cas','population','incidence']],right_index=True,on='semaine')
            else:
                df_meningite.insert(1,'month',df_meningite.index.month)
                df_mening = df_meningite[(df_meningite['district']== dist) & (np.in1d(df_meningite.index.month,df_out.index.month))][str(ydeb)]
                df_out['population'] = df_mening.population.resample('M',how=max)[index]
                df_out['cas'] = df_mening.cas.resample('M',how=sum)[index]
                df_out['incidence'] = 100000*df_out.cas.div(df_out.population, axis=0)
    return df_out

def heure_passage(station_aeronet):
    # calcul de l'heure de passage du satellite en fonction de la staton aeronet étudiée
    coord_st=pd.read_csv(ddir+'in_situ/aeronet/carto_aeronet/coord_aeronet.csv')
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
def scatter_plot(ulx,uly,lrx,lry,z_buffer,pas_de_temps,periode,datedeb, datefin,
                 type1,sat1,prd_sat1,res_sat1,variable_sat1,level_sat1, 
                 type2,sat2,prd_sat2,res_sat2,variable_sat2,level_sat2,
                 nom_station1,variable_station1,niveau,
                 nom_station2,variable_station2,
                 pays,district,variable_meningite):
    start = datetime.strptime(datedeb, "%Y-%m-%d")
    end = datetime.strptime(datefin, "%Y-%m-%d")

    #############################image satellite 1 ####################################
    if sat1 == "toms":
        fichier_sat1 = sat1+'_r'+res_sat1+'_d.nc'
        path_sat1 = ddir+type1+'/'+sat1+'/'+'res'+res_sat1+'/'+fichier_sat1
    elif prd_sat1 in ["chimere01","chimere02"]:
        fichier_sat1 = prd_sat1+'_r'+res_sat1+'_d.nc'
        path_sat1 = ddir+type1+'/'+sat1+'/'+prd_sat1[:-2]+'/'+'res'+res_sat1+'/'+fichier_sat1
    else:
        fichier_sat1 = prd_sat1+'_r'+res_sat1+'_d.nc'
        path_sat1 = ddir+type1+'/'+sat1+'/'+prd_sat1+'/'+'res'+res_sat1+'/'+fichier_sat1
#        print path_sat1
    ############################ image satellite 2 ####################################
    if sat2 == "toms":
        fichier_sat2 = sat2+'_r'+res_sat2+'_d.nc'
        path_sat2 = ddir+type2+'/'+sat2+'/'+'res'+res_sat2+'/'+fichier_sat2
    elif prd_sat2 in ["chimere01","chimere02"]:
        fichier_sat2 = prd_sat2+'_r'+res_sat2+'_d.nc'
        path_sat1 = ddir+type2+'/'+sat2+'/'+prd_sat2[:-2]+'/'+'res'+res_sat2+'/'+fichier_sat2
    else:
        fichier_sat2 = prd_sat2+'_r'+res_sat2+'_d.nc'
        path_sat2 = ddir+type2+'/'+sat2+'/'+prd_sat2+'/'+'res'+res_sat2+'/'+fichier_sat2
    ########################### donnees in situ 1 ######################################
    path_station1 = ddir+'in_situ/aeronet/niveau_'+niveau+'/'+nom_station1+'_aeronet_'+niveau+'_h24_15min.csv'
    ########################## donnees in situ 2 #######################################
    if nom_station2 == "Dedougou":
        path_station2 = ddir+'in_situ/teom/'+nom_station2+'_teom_h24_15min.csv'
    else:
        path_station2 = ddir+'in_situ/teom/'+nom_station2+'_teom_h24_h.csv'
    ########################## donnees in situ 3 #######################################
    path_meningite = ""
    if pays and district and variable_meningite:
        path_meningite = ddir+'in_situ/meningite/'+pays+'_meningite.csv'
    ####################################################################################
    #type_station1 = "moy_aeronet"
    #type_station2 = "moy_teom"    
    if nom_station1:
        nom_station = nom_station1
    else:
        nom_station = nom_station2
        
    if not sat2:
        hours1,long_st1, lat_st1 = heure_passage(nom_station)
        df_sat1, npx = readNC_box(path_sat1,variable_sat1,ulx,uly,lrx,lry, start, end,prd_sat1, level_sat1,pas_de_temps, hours1, long_st1, lat_st1, z_buffer)
        #chargement des donnees aeronet
        if nom_station1:
            df_sat1 = read_csv(path_station1,"aeronet", variable_station1,start, end,periode,df_sat1)
        #chargement des donnees teom
        if nom_station2:
            df_sat1 = read_csv(path_station2,"teom", variable_station2, start, end,periode,df_sat1)
        if pas_de_temps == 'day':
            dfout = df_sat1
        else:
            dfout = tempo(path_meningite,district,pas_de_temps,start,ystart,end,df_sat1,prd_sat1)
        if nom_station1:
            line_station1, coef_r2_1, mask01,a01,b01 = scatter_stats(dfout,prd_sat1, "aeronet")
        else:
            line_station1, coef_r2_1, mask01,a01,b01 = 0,0,0,0,0
        if nom_station2:
            line_station2, coef_r2_2, mask02,a02,b02 = scatter_stats(dfout,prd_sat1,"teom")
        else:
            line_station2, coef_r2_2, mask02,a02,b02 = 0,0,0,0,0
        return dfout, line_station1, coef_r2_1, mask01,a01,b01,line_station2, coef_r2_2,mask02,a02,b02

    
    else:
        df_sat1, npx1 = readNC_box(path_sat1,variable_sat1,ulx,uly,lrx,lry, start,end, prd_sat1, level_sat1, pas_de_temps)
        df_sat2, npx2 = readNC_box(path_sat2,variable_sat2,ulx,uly,lrx,lry, start,end, prd_sat2, level_sat2, pas_de_temps)
        #df_sat1_2 = df_sat1[df_sat1.columns[-6:]].join(df_sat2[df_sat2.columns[-6:]], how='outer')
        df_sat1_2 = df_sat1.join(df_sat2, how='outer')
        #chargement des donnees aeronet
        if nom_station1:      
            df_sat1_2 = read_csv(path_station1,"aeronet", variable_station1,start, end, periode,df_sat1_2)
        #chargement des donnees teom
        if nom_station2:
            df_sat1_2 = read_csv(path_station2,"teom", variable_station2, start, end,periode,df_sat1_2)
        if pas_de_temps == 'day':
            dfout = df_sat1_2
        else:
            dfout = tempo(path_meningite,district,pas_de_temps,start,ystart,end,df_sat1_2,prd_sat1,prd_sat2)
        line_sat, coef_r2_sat, mask_sat,a,b = scatter_stats(dfout,prd_sat1, prd_sat2)
        return dfout,line_sat, coef_r2_sat, mask_sat,a,b

if __name__ == '__main__':

###################### test #########################################################
#####################################################################################

	args = sys.argv[1]
	lines = []
	with open(args,'r') as param:
	    for l in param:
		lines += [l]

	ddir = "/home/sebastien/Bureau/teledm/donnees/"
	ddirout = "/home/sebastien/Bureau/"
	ulx = lines[1][:-1]
	if ulx: ulx = float(ulx)
	uly = lines[3][:-1]
	if uly: uly = float(uly)
	lrx = lines[5][:-1]
	if lrx: lrx = float(lrx)
	lry = lines[7][:-1]
	if lry: lry = float(lry)
	z_buffer = int(lines[9][:-1])
	pas_de_temps = lines[11][:-1]
	periode = lines[13][:-1]
	ystart = int(lines[15][:-1])
	mstart= int(lines[17][:-1])
	dstart = int(lines[19][:-1])
	yend = int(lines[21][:-1])
	mend = int(lines[23][:-1])
	dend = int(lines[25][:-1])
	log = ""#'ok'
	##############################image satellite 1 ####################################
	type1 = lines[27][:-1]
	sat1 = lines[29][:-1]
	prd_sat1 = lines[31][:-1]
	res_sat1 = lines[33][:-1]
	variable_sat1 = lines[35][:-1]
	level_sat1 = int(lines[37][:-1])
	if level_sat1 == -1: level_sat1 = ''
	############################# image satellite 2 ####################################
	type2 = lines[41][:-1]
	sat2 = lines[43][:-1]
	prd_sat2 =lines[45][:-1]
	res_sat2 = lines[47][:-1]
	variable_sat2 = lines[49][:-1]
	level_sat2 = int(lines[51][:-1])
	if level_sat2 == -1: level_sat2 = ''
	############################ donnees in situ 1 ######################################
	type0 = 'in_situ'
	prd_station1 = 'aeronet'
	niveau = lines[57][:-1]
	nom_station1 =lines[53][:-1]
	variable_station1 = lines[55][:-1]
	########################### donnees in situ 2 #######################################
	prd_station2 = 'teom'
	nom_station2 = lines[59][:-1]
	variable_station2 = lines[61][:-1]
	########################### donnees in situ 3 #######################################
	pays = lines[63][:-1]
	district = lines[65][:-1]
	variable_meningite = lines[69][:-1]
	######################################################################################
	######################################################################################
	print nom_station1, nom_station2
	resultats = scatter_plot(ulx,uly,lrx,lry,z_buffer,pas_de_temps,periode,ystart,mstart,dstart,yend,mend,dend, type1,sat1,prd_sat1,res_sat1,variable_sat1,level_sat1,type2,sat2,prd_sat2,res_sat2,variable_sat2,level_sat2, nom_station1,variable_station1,niveau,nom_station2,variable_station2,pays,district,variable_meningite)
	resultats[0].to_csv(ddirout+"qlt_flag.csv")
	print "fichier traite"
