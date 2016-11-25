# -*- coding: utf-8 -*-
from netCDF4 import *
from osgeo import gdal,gdal_array, ogr, osr
import numpy as np
import datetime
import os
import glob

def netcdf2raster(date):

    ddir="/home/sebastien/dev/web1/datas"
    os.chdir(ddir)
    files = sorted(glob.glob('*9_d.nc'))
    fich = files[0]
    f = Dataset(fich, 'r')
    #name_var = listvar[3]
    name_var = "Lifted_Index"
    annee = int(date[:4])
    mois = int(date[4:6])
    jour = int(date[6:])
    date_couche = datetime.datetime(annee,mois,jour)
    name_out = name_var+'_'+date+'.tif'
    # print variables
    var = f.variables[name_var]
    lat = f.variables['latitude'][:]
    resy= np.abs(np.mean(np.diff(lat)))
    lon = f.variables['longitude'][:]
    resx = np.abs(np.mean(np.diff(lon)))
    temps = f.variables['time']
    idx_couche = np.where(temps[:]==date2num(date_couche,temps.units))[0]
    mat = np.ma.filled(var[idx_couche[0],:,:],-9999)
    
    
    driver2 = gdal.GetDriverByName('GTiff')
    r = driver2.Create(name_out, len(lon), len(lat), 1, gdal.GDT_Float64)
    # top left x, w-e pixel resolution, rotation, top left y, rotation, n-s pixel resolution
    r.SetGeoTransform((np.min(lon[:]), resx, 0.0, np.max(lat[:]), 0.0, -resy))
    rSRS = osr.SpatialReference()
    rSRS.ImportFromEPSG(4326)
    #rSRS.SetWellKnownGeogCS("WGS84")
    r.SetProjection(rSRS.ExportToWkt())
    r.GetRasterBand(1).WriteArray((mat[:]))
    r.GetRasterBand(1).SetNoDataValue(-9999)
    #r.FlushCache()
r = None
