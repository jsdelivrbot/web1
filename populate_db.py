# -*- coding: utf-8 -*-

import os
import pandas as pd
from glob import glob
from django.contrib.gis.geos import Point

from app1.models import Country, Station, MeteoData



ddir = '/home/sebastien/Bureau/teledm/donnees/'
os.chdir(ddir)
csv_stations = 'stations_meteo1.csv'
csv = pd.read_csv(csv_stations, header=0)
files = sorted(glob('meteo/*_h.csv'))

def loadcountry():
    for c in csv.CountryArea.unique().tolist():
        country_idx = csv.CountryCode[csv.CountryArea==c].unique()[0]
        Country(idx=country_idx, countryname=c).save()
        

def loadstations():
    for i in csv.index:
        lat = csv.Latitude.ix[i]
        lon = csv.Longitude.ix[i]
        st_id = csv.StationId.ix[i]
        st_name = csv.StationName.ix[i]
        country = csv.CountryCode.ix[i]
        Station(stationid=st_id, stationname=st_name, country=country, geom=Point(lon, lat)).save()

def loaddatas():
    l = [168,192,216]
    li = 0
    for f in files:
        csv1 = pd.read_csv(f,header=0)
        id_station = l[li]
        li += 1
        for d in csv1.index:
            dates = csv1.date.ix[d].astype('datetime64[ns]')
            wind = csv1.wind.ix[d]
            wind_dir = csv1.wind_dir.ix[d]
            temp = csv1.temp.ix[d]
            relh = csv1.relh.ix[d]
            rain = csv1.rain.ix[d]
            MeteoData(date=dates, wind=wind, wind_dir=wind_dir, temp=temp, relh=relh, rain=rain,station=id_station ).save()