# -*- coding: utf-8 -*-

from __future__ import unicode_literals


def populate():
    for i in csv.index:
        pays = addcountry(csv.CountryCode.ix[i], csv.CountryArea.ix[i])
        station = addstation(pays, csv.StationId.ix[i], csv.StationName.ix[i], Point(csv.Longitude.ix[i],csv.Latitude.ix[i]))
        st_id = csv.StationId.ix[i]
        if st_id == 168:
            print 'niamey'
            csv1 = pd.read_csv(files[0], header=0)
            csv1.date = csv1.date.astype('datetime64[ns]')
            t1 = csv1.index[csv1.date==pd.Timestamp('2007-01-01 11:00:00')][0]
            t2 = csv1.index[csv1.date==pd.Timestamp('2007-12-31 23:00:00')][0]
            for j in csv1.index[t1:t2]:
                addmeteo(station,csv1.date.ix[j], csv1.wind.ix[j], csv1.wind_dir.ix[j],csv1.temp.ix[j], csv1.relh.ix[j], csv1.rain.ix[j])
        elif st_id == 178:
            print 'tombouctou'
            csv1 = pd.read_csv(files[2], header=0)
            csv1.date = csv1.date.astype('datetime64[ns]')
            t1 = csv1.index[csv1.date==pd.Timestamp('2007-01-01 11:00:00')][0]
            t2 = csv1.index[csv1.date==pd.Timestamp('2007-12-31 23:00:00')][0]
            for j in csv1.index[t1:t2]:
                addmeteo(station,csv1.date.ix[j], csv1.wind.ix[j], csv1.wind_dir.ix[j],csv1.temp.ix[j], csv1.relh.ix[j], csv1.rain.ix[j])
        elif st_id == 193:
            print 'koutiala'
            csv1 = pd.read_csv(files[1], header=0)
            csv1.date = csv1.date.astype('datetime64[ns]')
            t1 = csv1.index[csv1.date==pd.Timestamp('2007-01-01 11:00:00')][0]
            t2 = csv1.index[csv1.date==pd.Timestamp('2007-12-31 23:00:00')][0]
            for j in csv1.index[t1:t2]:
                addmeteo(station,csv1.date.ix[j], csv1.wind.ix[j], csv1.wind_dir.ix[j],csv1.temp.ix[j], csv1.relh.ix[j], csv1.rain.ix[j])
        elif st_id == 216:
            print 'mbour'
            csv1 = pd.read_csv(files[2], header=0)
            csv1.date = csv1.date.astype('datetime64[ns]')
            t1 = csv1.index[csv1.date==pd.Timestamp('2007-01-01 11:00:00')][0]
            t2 = csv1.index[csv1.date==pd.Timestamp('2007-12-31 23:00:00')][0]
            for j in csv1.index[t1:t2]:
                addmeteo(station,csv1.date.ix[j], csv1.wind.ix[j], csv1.wind_dir.ix[j],csv1.temp.ix[j], csv1.relh.ix[j], csv1.rain.ix[j])


def addcountry(country_idx,country_name):
    c = Country.objects.get_or_create(country_id=country_idx, country=country_name)[0]
    return c

def addstation(country_idx,station_id,station_name,geom):
    s = Station.objects.get_or_create(country=country_idx, station_id=station_id, station=station_name, geom=geom)[0]
    return s

def addmeteo(station_id,date,wind,wind_dir,temp,relh,rain):
    m = MeteoData.objects.get_or_create(station=station_id,date=date, wind=wind, wind_dir=wind_dir,temp=temp, relh=relh, rain=rain)[0]
    return m

if __name__ == '__main__':
    import os
    os.environ['DJANGO_SETTINGS_MODULE'] = 'web1.settings'
    import django
    django.setup()
    import pandas as pd
    from glob import glob
    
    from django.contrib.gis.geos import Point
    from app1.models import Country, Station, MeteoData
    
    ddir = "/home/sebastien/Bureau/teledm/donnees/"
    os.chdir(ddir)
    
    csv_stations = 'stations_meteo1.csv'
    csv = pd.read_csv(csv_stations, header=0)
    files = sorted(glob('meteo/*_12h.csv'))
populate()
