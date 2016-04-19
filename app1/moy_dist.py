# -*- coding: utf-8 -*-


import pandas as pd
import geopandas as gpd
import numpy as np
from rasterstats import raster_stats
from netCDF4 import Dataset, num2date
import time
import os
import glob
#import warnings
#warnings.filterwarnings("ignore")




def calc_moy(dirout,country,level,year,rtmp,typ, satell, product,reso,vname):
    """

    """
    if product in ["chimere01","chimere02"]:
        ddirin = "/home/sebastien/Bureau/teledm/donnees/"+typ+"/"+satell+"/"+product[:-2]+"/res"+reso.replace(".","")
    else:
        ddirin = "/home/sebastien/Bureau/teledm/donnees/"+typ+"/"+satell+"/"+product+"/res"+reso.replace(".","")
    ddirout = dirout
    country = country[0].lower() +country[1:]
    if ddirout[-1] != "/":
        ddirout += "/"
    if not os.path.isdir(ddirout):
        return "CHEMIN DE SORTIE INEXISTANT",""
    os.chdir(ddirin)
    files = sorted(glob.glob(product+'*'+rtmp+'.nc'))
    print "files list ",files
    if not len(files):
        return "LE FICHIER DEMANDE N EXISTE PAS DANS LA BASE",""
    else:
        ################ import shapefile #############################################################################
        fshape = '/home/sebastien/Bureau/teledm/carto/'+level+'/'+country+'_'+level+'_sante.shp'
        geodf = gpd.GeoDataFrame.from_file(fshape)
        
        nbdist = len(geodf[geodf.columns[0]])
        dist = geodf[geodf.columns[0]].tolist()
        listdist='//'.join(geodf[geodf.columns[0]].tolist())
        ###############################################################################################################
        print files[0]
        nc = Dataset(files[0], 'r')
        print nc.variables.keys()
        var_in = nc.variables[vname]
        var = np.array(var_in[:])
        if satell == 'toms':
            var[var==var_in._FillValue]=-999
        else:
            var[var==var_in._FillValue]=np.nan
        lat = nc.variables['latitude'][:]
        lon = nc.variables['longitude'][:]
        temps = nc.variables['time']
        xo = min(lon)
        yo = max(lat)
        resx = np.abs(np.mean(np.diff(lon)))
        resy = np.abs(np.mean(np.diff(lat)))
        transform= [xo, 0.01, 0.0, yo, 0.0, -0.01]
        
#        ############################ CREATION NETCDF ##################################################################
#        ###############################################################################################################
#        file_name = files[0][:-3]+'_'+level+'_'+country+'_'+vname+'.nc'
#        output = ddirout+file_name
#        ncnew = Dataset(output, 'w')
#        # dimensions#####
#        ncnew.createDimension('time', len(temps[:]))
#        ncnew.createDimension('index_dist', nbdist)
#        # variables#####
#        tp = ncnew.createVariable('time','f8',('time',))
#        tp[:] = temps[:]
#        index = ncnew.createVariable('index_dist','f4',('index_dist',))
#        index[:] = range(nbdist)
#        nbpx = ncnew.createVariable('count','f4',('time','index_dist'))
#
#        vmin = ncnew.createVariable('min','f4',('time','index_dist'))
#        vmax = ncnew.createVariable('max','f4',('time','index_dist'))
#        vmean = ncnew.createVariable('mean','f4',('time','index_dist'))
#        vstd = ncnew.createVariable('std','f4',('time','index_dist'))
#        vmed = ncnew.createVariable('median','f4',('time','index_dist'))
#        # attributs#####
#        ncnew.Convention ='CF-1.5'
#        ncnew.description = 'moyenne districts pour la variable :'
#        ncnew.history = 'Created ' + time.ctime(time.time())
#        ncnew.source = ' '
#        index.standard_name = listdist
#        tp.units = temps.units
#        tp.standard_name = 'time'
#        tp.calendar = 'gregorian'
#        #############################################################################################################
        #############################################################################################################
        dfout = pd.DataFrame()
        for i in range(len(temps[:])):
            var1 = np.repeat(var[i,:,:],100*resy, axis=0)
            var2 = np.repeat(var1,100*resx, axis=1)
            val_input=np.ma.masked_array(var2, np.isnan(var2))
            stats = raster_stats(geodf['geometry'],val_input, transform=transform, stats=['min', 'max', 'mean', 'count', 'std', 'median'])
            df = geodf.join(pd.DataFrame(stats))
#            nbpx[i,:] = np.array(df['count'].ix[:])
#            vmax[i,:] = np.array(df['max'].ix[:])
#            vmean[i,:] = np.array(df['mean'].ix[:])
#            vmed[i,:] = np.array(df['median'].ix[:])
#            vmin[i,:] = np.array(df['min'].ix[:])
#            vstd[i,:] = np.array(df['std'].ix[:])
            dfout = dfout.append(df)
        dates=pd.date_range(num2date(temps[0],temps.units), num2date(temps[-1],temps.units), freq = 'W-MON')
        iterables = [dates,dist]
        index = pd.MultiIndex.from_product(iterables, names=['date','districts'])
        dfout.set_index(index, inplace=True)
#        ncnew.close()
        nc.close()
        print dfout
        return dfout

if __name__ == '__main__':
    dirout,country,level,year,rtmp,typ, satell, product,reso,vname = "/home/sebastien/Bureau","burkina","district",2007,"d3","satellite","modis","MYD04","009","Deep_Blue_Aerosol_Optical_Depth_550_Land"
    print dirout
    calc_moy(dirout,country,level,year,rtmp,typ, satell, product,reso,vname)

