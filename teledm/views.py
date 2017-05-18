#-*- coding: utf-8 -*-

from django.shortcuts import HttpResponse, render
from django.contrib.auth.decorators import login_required, user_passes_test
from django.template import RequestContext
from django.core.serializers.json import DjangoJSONEncoder
from django.conf import settings
from sendfile import sendfile
import json, simplejson
import requests
from StringIO import StringIO
import os
import pandas as pd
import numpy as np
from datetime import datetime
from moy_dist_parallel import calc_moy
from traitement import traitementDF
from scatterPlots import scatterSatStation, scatter2Sat_Temporel, scatter2Sat_Spatial
from Util import *

import logging
logger = logging.getLogger(__name__)


tmpDir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'teledm/tmp')



def proxyNCSS(request, path):
    elevation = request.GET['elevation']
    time_end = request.GET['time_end']
    longitude = request.GET['longitude']
    latitude = request.GET['latitude']
    accept = request.GET['accept']
    var = request.GET['var']
    time_start = request.GET['time_start']
    param = 'time_start={}&time_end={}&var={}&elevation={}&latitude={}&longitude={}&accept={}'.format(time_start,time_end,var,elevation,latitude,longitude,accept)
    url = "https://climdata.u-bourgogne.fr:8443/thredds/{}?{}".format(path,param)
    print url
    #url = 'https://climdata.u-bourgogne.fr:8443/thredds/ncss/satellite/modis/MYD07/res009/MYD07_r009_d.nc?time_start=2006-07-06&time_end=2006-07-06&var=Surface_Temperature&elevation=Layer&latitude=25.6&longitude=10.266674804688&accept=csv'
    response = requests.get(url, auth=requests.auth.HTTPBasicAuth(settings.TDS_USER, settings.TDS_PWD))
    csv = pd.read_csv(StringIO(response.content), parse_dates={'datetime':['time']})
    print(csv)
    return HttpResponse(json.dumps({'date':csv.datetime.ix[0],'lon':csv['longitude[unit="degrees_east"]'].ix[0],'lat':csv['latitude[unit="degrees_north"]'].ix[0], 'val':csv['Surface_Temperature[unit="K"]'].ix[0], 'name': csv.columns[-1]}, cls=DjangoJSONEncoder))


#def proxyAjax1(request, path):    
#    #path  = 're_analyse/ecmwf/era_interim/catalog.xml'
#    url =  os.path.join(settings.TDS_URL + "catalog" + path)
#    response = requests.get(url, auth=requests.auth.HTTPBasicAuth(settings.TDS_USER, settings.TDS_PWD))
#    tree = BeautifulSoup(response.text, 'lxml')
#    cats = tree.find_all("catalogref")
#    ids = [i.attrs['xlink:title'] for i in cats][:2]
#    return HttpResponse(json.dumps({'id1': ids[0], 'id2':ids[1]}), content_type='teledm/test.html')


def proxyAjax(request, path):    
    #path  = 're_analyse/ecmwf/era_interim/catalog.xml'
    #print(path)
    
    url = os.path.join(settings.TDS_URL % (''), path)
    response = requests.get(url, auth=requests.auth.HTTPBasicAuth(settings.TDS_USER, settings.TDS_PWD))
    #print url
    #print response.content
    return HttpResponse(response.content)


def colorbar(request, path):
    #COLORBARONLY': [u'true'], u'LAYER': [u'Surface_Temperature'], u'REQUEST': [u'GetLegendGraphic'], u'PALETTE': [u'rainbow'], u'NUMCOLORBANDS': [u'10']
    params = "?REQUEST={}&LAYER={}&NUMCOLORBANDS={}&PALETTE={}&COLORBARONLY={}".format(request.GET['REQUEST'],request.GET['LAYER'],request.GET['NUMCOLORBANDS'],request.GET['PALETTE'],request.GET['COLORBARONLY'])
    url = os.path.join(settings.TDS_URL % (''), path+params)
    response = requests.get(url, auth=requests.auth.HTTPBasicAuth(settings.TDS_USER, settings.TDS_PWD), verify=False)
    return HttpResponse(response.content, status=int(response.status_code))

def dates(request, path):
    params = "?service={}&version={}&request={}".format(request.GET['service'], request.GET['version'], request.GET['request'])
    url = os.path.join(settings.TDS_URL % (''), path + params)
    response = requests.get(url, auth=requests.auth.HTTPBasicAuth(settings.TDS_USER, settings.TDS_PWD), verify=False)
    return HttpResponse(response.content, status=int(response.status_code))


def minmax(request, path):
    print request.GET
    LAYER = request.GET['LAYERS']
    CRS = request.GET['CRS']
    elevation = request.GET['elevation']
    service = request.GET['service']
    REQUEST = request.GET['REQUEST']
    HEIGHT = request.GET['HEIGHT']
    SRS = request.GET['SRS']
    version = request.GET['version']
    BBOX = request.GET['BBOX']
    TIME = request.GET['TIME']
    WIDTH =request.GET['WIDTH']
    params = '?item=minmax&LAYERS={}&elevation={}&TIME={}&SRS={}&CRS={}&REQUEST={}&service={}&version={}&BBOX={}&WIDTH={}&HEIGHT={}'.format(LAYER,elevation,TIME,SRS,CRS,REQUEST,service,version,BBOX,WIDTH,HEIGHT)
    url = os.path.join(settings.TDS_URL % (''), path + params)
    print url
    response = requests.get(url, auth=requests.auth.HTTPBasicAuth(settings.TDS_USER, settings.TDS_PWD), verify=False)
    return HttpResponse(response.content, status=int(response.status_code))


def proxyWMS(request, path):
    LAYER = request.GET['LAYERS']
    #CRS = request.GET['CRS']
    elevation = request.GET['elevation']
    service = request.GET['service']
    #FORMAT = request.GET['FORMAT']
    req = request.GET['request']
    HEIGHT = request.GET['HEIGHT']
    #STYLES = request.GET['STYLES']
    #SRS = request.GET['SRS']
    version = request.GET['version']
    BBOX = request.GET['BBOX']
    NUMCOLORBANDS = request.GET['NUMCOLORBANDS']
    TIME = request.GET['TIME']
    COLORSCALERANGE = request.GET['COLORSCALERANGE']
    #TRANSPARENT = request.GET['TRANSPARENT']
    WIDTH =request.GET['WIDTH']
    params = '?service={}&version={}&request={}&CRS=CRS%3A84&LAYERS={}&elevation={}&TRANSPARENT=true&FORMAT=image%2Fpng&SRS=EPSG&STYLES=boxfill%2Frainbow&COLORSCALERANGE={}&TIME={}&NUMCOLORBANDS={}&OPACITY=100&BBOX={}&WIDTH={}&HEIGHT={}'.format(service,version,req,LAYER,elevation,COLORSCALERANGE.replace(',','%2C'),TIME,NUMCOLORBANDS,BBOX,WIDTH,HEIGHT)
    #url = "https://{}:{}@climdata.u-bourgogne.fr:8443/thredds/wms/{}/{}".format(settings.TDS_USER, settings.TDS_PWD,path,params)
    url = os.path.join(settings.TDS_URL % (settings.TDS_USER+':'+settings.TDS_PWD+'@'),path+params)
    #response, content = conn.request(url, 'GET')
    #url = 'https://climdata.u-bourgogne.fr:8443/thredds/ncss/satellite/modis/MYD07/res009/MYD07_r009_d.nc?time_start=2006-07-06&time_end=2006-07-06&var=Surface_Temperature&elevation=Layer&latitude=25.6&longitude=10.266674804688&accept=csv'
    response = requests.get(url, auth=requests.auth.HTTPBasicAuth(settings.TDS_USER, settings.TDS_PWD), verify=False)
    return HttpResponse(response.content, status=int(response.status_code))


#@login_required
#@user_passes_test(lambda u: u.groups.filter(name='teledm').exists())
def home(request):
    if request.is_ajax():
        dates = [d.strftime('%Y-%m-%d') for d in pd.date_range('2014-01-01','2014-01-31', freq='D')]
        datas = np.random.randint(0,3,31).tolist()
        datas = {'dates':dates, 'datas':datas}
        logger.debug("Debug message!")
        logger.info("Info message!")
        logger.warning("Warning message!")
        logger.error("Error message!")
        logger.critical("Critical message!")
        return HttpResponse(json.dumps(datas), content_type='teledm/home.html')
    else:
        logger.debug("this is a debug message!")
        return render(request, 'teledm/home.html')


#@login_required
#@user_passes_test(lambda u: u.groups.filter(name='teledm').exists())
def mapViewer(request):
    if request.is_ajax():
        logger.debug("Debug message!")
        logger.info("Info message!")
        logger.warning("Warning message!")
        logger.error("Error message!")
        logger.critical("Critical message!")
        if 'mesure' in request.POST.keys():
            mesure = request.POST['mesure']
            station = request.POST['stations']
            variable = str(request.POST['variables'])
            resoTempo = request.POST['resoTempo']
            try:
                niveau = request.POST['niveau']
                fcsv = os.path.join(settings.DIRDB, mesure + '/niveau_'+niveau+'/'+station+'_aeronet_'+niveau+'_'+resoTempo+'.csv')
                df = pd.read_csv(fcsv, parse_dates={'datetime':['date']}, header=0, index_col=0, usecols=['date', variable])
            except KeyError:
                fcsv = os.path.join(settings.DIRDB, mesure + '/'+station+'_'+mesure+'_'+resoTempo+'.csv')
                df = pd.read_csv(fcsv, parse_dates={'datetime':['date']}, header=0, index_col=0, usecols=['date', variable])
            geo = station
        else:
            epidemio = request.POST['epidemio']
            pays = request.POST['pays']
            echelle = request.POST['echelle']
            variable = str(request.POST['variable'])
            try:
                district = request.POST['district']
                fcsv = os.path.join(settings.DIRDB, epidemio + '/'+pays+'_'+epidemio+'_'+echelle+'.csv')
                csv = pd.read_csv(fcsv, parse_dates={'datetime':['date']}, header=0, index_col=0, usecols=['date', 'district', variable])
                df = csv[csv.district==district]
                geo = district
            except KeyError:
                fcsv = os.path.join(settings.DIRDB, epidemio + '/'+pays+'_'+epidemio+'_'+echelle+'.csv')
                df = pd.read_csv(fcsv, parse_dates={'datetime':['date']}, header=0, index_col=0, usecols=['date', variable])
                geo = pays
        dictdatas = {'header':geo, 'varName':variable, 'datas':df[variable].replace(np.nan,'NaN').values.tolist(), 'dates':df.index.tolist()}        
        return HttpResponse(json.dumps(dictdatas, cls=DjangoJSONEncoder), content_type='text/json')
    else:
        logger.debug("Debug message!")
        logger.info("Info message!")
        logger.warning("Warning message!")
        logger.error("Error message!")
        logger.critical("Critical message!")
        return render(request, 'teledm/mapViewer.html')

#@login_required
#@user_passes_test(lambda u: u.groups.filter(name='teledm').exists())
def mapDist(request):
    if request.is_ajax():
        if 'capteur' in request.POST.keys():
            ddirout = settings.MEDIA_ROOT
            deb = request.POST['datedebut'] 
            fin = request.POST['datefin'] 
            pays = request.POST['pays']  
            niveau = request.POST['decoupage'] 
            types = request.POST['type'] 
            sat = request.POST['capteur']  
            prod = request.POST['produit']
            res_temp = request.POST['pasdetemps']
            res = request.POST['resospatiale']
            varname = request.POST['variable']
            if 'level1' in request.POST.keys():
                level = int(request.POST['level1']) - 1
            else:
                level = -1
            shape = "merge2500"  # "all_fs" "merge1500" "merge2500"
            ldf = calc_moy(ddirout,deb,fin,pays,niveau,types,sat,prod,res_temp,res,varname,level,shape)
            val = [traitementDF(x,y) for x,y in [(ldf,z) for z in ldf.keys() if z != 'nbpx']]
            datas = dict(zip([val[i][0] for i in range(4)],[val[i][1] for i in range(4)]))
            list_dates = ldf['vmean'].index.values.tolist()
            geojson = pays+"_"+niveau+"_sante.geojson"
            filename = varname + '_' + prod + '_r' + res[3:] + '_' + niveau + '_' + shape + '_' + pays + '_' + deb.replace('-','') + fin.replace('-','') + res_temp + '.nc'
            dictdatas = {'dates':list_dates,'datas':datas,'shape':geojson, 'filename':filename}
        elif 'mesure' in request.POST.keys():
            mesure = request.POST['mesure']
            station = request.POST['stations']
            variable = str(request.POST['variables'])
            resoTempo = request.POST['resoTempo']
            try:
                niveau = request.POST['niveau']
                fcsv = os.path.join(settings.DIRDB, mesure + '/niveau_'+niveau+'/'+station+'_aeronet_'+niveau+'_'+resoTempo+'.csv')
                df = pd.read_csv(fcsv, parse_dates={'datetime':['date']}, header=0, index_col=0, usecols=['date', variable])
            except KeyError:
                fcsv = os.path.join(settings.DIRDB, mesure + '/'+station+'_'+mesure+'_'+resoTempo+'.csv')
                df = pd.read_csv(fcsv, parse_dates={'datetime':['date']}, header=0, index_col=0, usecols=['date', variable])
            dictdatas = {'header':station, 'varName':variable, 'datas':df[variable].replace(np.nan,'NaN').values.tolist(), 'dates':df.index.tolist()}
        else:
            epidemio = request.POST['epidemio']
            pays = request.POST['pays']
            echelle = request.POST['echelle']
            variable = str(request.POST['variable'])
            try:
                district = request.POST['district']
                fcsv = os.path.join(settings.DIRDB, epidemio + '/'+pays+'_'+epidemio+'_'+echelle+'.csv')
                csv = pd.read_csv(fcsv, parse_dates={'datetime':['date']}, header=0, index_col=0, usecols=['date', 'district', variable])
                df = csv[csv.district==district]
            except KeyError:
                fcsv = os.path.join(settings.DIRDB, epidemio + '/'+pays+'_'+epidemio+'_'+echelle+'.csv')
                df = pd.read_csv(fcsv, parse_dates={'datetime':['date']}, header=0, index_col=0, usecols=['date', variable])
            dictdatas = {'header':pays, 'varName':variable, 'datas':df[variable].replace(np.nan,'NaN').values.tolist(), 'dates':df.index.tolist()}
        return HttpResponse(json.dumps(dictdatas, cls=DjangoJSONEncoder), content_type='application/json')
    else:
        if 'submit' in request.POST.keys():
            filesend = os.path.join(tmpDir, request.POST['filename'])
            return sendfile(request, filesend)
        else:
            return render(request, 'teledm/mapDist.html')

#@login_required
#@user_passes_test(lambda u: u.groups.filter(name='teledm').exists())
def calval(request):
    if request.is_ajax():
        if request.POST['ulx']:
            ulx = float(request.POST['ulx'])
            uly = float(request.POST['uly'])
            lrx = float(request.POST['lrx'])
            lry = float(request.POST['lry'])
            z_buffer = request.POST['buffer']
        else:
            z_buffer = int(request.POST['buffer'])
            ulx = request.POST['ulx']
            uly = request.POST['uly']
            lrx = request.POST['lrx']
            lry = request.POST['lry']
        pas_de_temps1 = request.POST['pasdetemps1']
        datedebut = request.POST['datedebut']
        datefin = request.POST['datefin']
        type1 = request.POST['type1']
        sat1 = request.POST['capteur1']
        prd_sat1 = request.POST['produit1']
        res_sat1 = request.POST['resospatiale1'][3:]
        variable_sat1 = request.POST['variable1']
        if 'level1' in request.POST:
            level_sat1 = int(request.POST['level1']) - 1
        else:
            level_sat1 = -1
        if 'type2' in request.POST:
            type2 = request.POST['type2']
            sat2 = request.POST['capteur2']
            prd_sat2 = request.POST['produit2']
            res_sat2 = request.POST['resospatiale2'][3:]
            variable_sat2 = request.POST['variable2']
            if 'level2' in request.POST:
                level_sat2 = int(request.POST['level2']) - 1
            else:
                level_sat2 = -1
            if request.POST['action'] == 'scatterTemporel':
                print 'scatter plot temporel'
                df = scatter2Sat_Temporel(ulx,uly,lrx,lry,z_buffer,pas_de_temps1,datedebut, datefin,
                                 type1,sat1,prd_sat1,res_sat1,variable_sat1,level_sat1,
                                 type2,sat2,prd_sat2,res_sat2,variable_sat2,level_sat2
                                 )
            else:
                print 'scatter plot spatial'
                df = scatter2Sat_Spatial(ulx,uly,lrx,lry,z_buffer,pas_de_temps1,datedebut, datefin,
                                 type1,sat1,prd_sat1,res_sat1,variable_sat1,level_sat1,
                                 type2,sat2,prd_sat2,res_sat2,variable_sat2,level_sat2
                                 )
        else:
            print 'integration'
            periode = request.POST['integration']
            if 'stationsaeronet' in request.POST:
                inSitu = "aeronet"
                station = request.POST['stationsaeronet']
                varStation = request.POST['variablesaeronet']
                niveau = request.POST['niveau']
            else:
                inSitu = 'teom'
                station = request.POST['stationsteom']
                varStation = request.POST['variablesteom']
                niveau = ''
            print ulx,uly,lrx,lry,z_buffer,pas_de_temps1,periode,datedebut, datefin,type1,sat1,prd_sat1,res_sat1,variable_sat1,level_sat1, inSitu, station, varStation, niveau
            df = scatterSatStation(ulx,uly,lrx,lry,z_buffer,pas_de_temps1,periode,datedebut, datefin,
                                   type1,sat1,prd_sat1,res_sat1,variable_sat1,level_sat1,
                                   inSitu, station, varStation, niveau
                                   )
            
        for k in ['a', 'prd', 'dates', 'b', 'prdVar_units', 'zone', 'satVar', 'prdVar', 'satVar_units', 'line', 'rCarre', 'sat']:
            print('%s, %s' % (k,df[k]))
        print type(df['dates'])
        print type(df['scatterValues'])
        return HttpResponse(simplejson.dumps(df, ignore_nan=True,default=datetime.isoformat), content_type='text/json')
    else:
        return render(request,'teledm/calval.html')

def localisation(request):
    return render(request, 'teledm/localisation.html')