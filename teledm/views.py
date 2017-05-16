#-*- coding: utf-8 -*-

from django.shortcuts import HttpResponse, render
from django.contrib.auth.decorators import login_required, user_passes_test
from django.template import RequestContext
from django.core.serializers.json import DjangoJSONEncoder
from django.conf import settings
from sendfile import sendfile
import json, simplejson
from xml.etree import ElementTree as ET
import httplib2, requests
from bs4 import BeautifulSoup
import base64
import os
import pandas as pd
import numpy as np
from datetime import datetime
from owslib.wms import WebMapService
from moy_dist_parallel import calc_moy
from traitement import traitementDF
from scatterPlots import scatterSatStation, scatter2Sat_Temporel, scatter2Sat_Spatial
from Util import *

import logging
logger = logging.getLogger(__name__)


tmpDir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'teledm/tmp')
ddirDB = os.path.expanduser('~') + "/Bureau/teledm"
ddir = ddirDB + "/donnees/in_situ/"

#@login_required
def test2(request, path):
    print('path %s' % path)
    url = 'http://localhost:8080/thredds/wms/satellite/modis/MYD04/res009/MYD04_r009_d.nc?service=WMS'
    wms = WebMapService(url, version='1.3.0')
    layer = wms.contents.keys()[0]
    bbox = wms[layer].boundingBoxWGS84
    args = [[layer], ['boxfill/rainbow'], 'EPSG:4326', bbox, (300, 250), 'image/png', True]
    img = wms.getmap(layers=[layer], styles=['boxfill/rainbow'], srs='EPSG:4326', bbox=bbox, size=(300, 250), format='image/png', transparent=True)
    response = requests.request('GET', url)
    return HttpResponse(img, content_type='teledm/test.html')

def test(request):
    return render(request, "teledm/test.html")


def testProxyNCSS(request):
    url = 
    return HttpResponse()


def testProxyAjax(request, path):    
    username = "se5780me"
    password = "erg54erg55"
    #path  = 're_analyse/ecmwf/era_interim/catalog.xml'
    print(path)
    url = "https://climdata.u-bourgogne.fr:8443/thredds/catalog/" + path
    response = requests.get(url, auth=requests.auth.HTTPBasicAuth(username, password))
    tree = BeautifulSoup(response.text, 'lxml')
    cats = tree.find_all("catalogref")
    ids = [i.attrs['xlink:title'] for i in cats][:2]
    return HttpResponse(json.dumps({'id1': ids[0], 'id2':ids[1]}), content_type='teledm/test.html')

def testProxyWMS(request, path):
    username = "se5780me"
    password = "erg54erg55"
    print(request.GET)
    LAYERS = request.GET['LAYERS']
    CRS = request.GET['CRS']
    elevation = request.GET['elevation']
    service = request.GET['service']
    FORMAT = request.GET['FORMAT']
    req = request.GET['request']
    OPACITY = request.GET['OPACITY']
    HEIGHT = request.GET['HEIGHT']
    STYLES = request.GET['STYLES']
    SRS = request.GET['SRS']
    version = request.GET['version']
    BBOX = request.GET['BBOX']
    NUMCOLORBANDS = request.GET['NUMCOLORBANDS']
    TIME = request.GET['TIME']
    COLORSCALERANGE = request.GET['COLORSCALERANGE']
    TRANSPARENT = request.GET['TRANSPARENT']
    WIDTH =request.GET['WIDTH']
    url = "https://se5780me:erg54erg55@climdata.u-bourgogne.fr/thredds/wms/satellite/modis/MYD07/res009/MYD07_r009_d.nc?service=WMS&version=1.3.0&request=GetMap&CRS=CRS%3A84&LAYERS={}&elevation={}&TRANSPARENT=true&FORMAT=image%2Fpng&SRS=EPSG&STYLES=boxfill%2Frainbow&COLORSCALERANGE=270%2C350&TIME=2007-01-02&NUMCOLORBANDS=250&OPACITY=100&BBOX={}&WIDTH=256&HEIGHT=256".format(LAYERS, elevation, BBOX)
    params = '?service={}&version={}&request={}&CRS=CRS%3A84&LAYERS={}&elevation={}&TRANSPARENT=true&FORMAT=image%2Fpng&SRS=EPSG&STYLES=boxfill%2Frainbow&COLORSCALERANGE={}&TIME={}&NUMCOLORBANDS={}&OPACITY=100&BBOX={}&WIDTH=256&HEIGHT=256'.format(service,version,req,LAYERS,elevation,COLORSCALERANGE.replace(',','%2C'),TIME,NUMCOLORBANDS,BBOX)
    #url = "https://se5780me:erg54erg55@climdata.u-bourgogne.fr:8443/thredds/wms/" + path
    url = "https://se5780me:erg54erg55@climdata.u-bourgogne.fr:8443/thredds/wms/" + path + params
    print('url %s' % url)
    #response, content = conn.request(url, 'GET')
    response = requests.get(url, auth=requests.auth.HTTPBasicAuth(username, password), verify=False)
    print('status: %s' % response.status_code)
    return HttpResponse(response.content, status=int(response.status_code), content_type='teledm/test.html')

def test3(request, path):
    print('path: %s' % request.path)
    print('request: %s' % request.GET)
    if "wms" in path:
        url = 'http://localhost:8080/thredds/wms/satellite/modis/MYD04/res009/MYD04_r009_d.nc?service=WMS'
        wms = WebMapService(url, version='1.3.0')
        layer = wms.contents.keys()[0]
        bbox = wms[layer].boundingBoxWGS84
        img = wms.getmap(layers=[layer], styles=['boxfill/rainbow'], srs='EPSG:4326', bbox=bbox, size=(300, 250), format='image/png', transparent=True)
        print('ok')
    return HttpResponse(img)


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

def DB(request):
    return render(request, 'teledm/db.html')
def traitementsData(request):
    return render(request, 'teledm/traitementsData.html')
def tutoMap(request):
    return render(request, 'teledm/tutoMap.html')
def tutoCalVal(request):
    return render(request, 'teledm/tutoCalVal.html')
def tutoExtraction(request):
    return render(request, 'teledm/tutoExtraction.html')
def stations(request):
    return render(request, 'teledm/stations.html')

#@login_required
#@user_passes_test(lambda u: u.groups.filter(name='teledm').exists())
def mapViewer(request):
    print request.POST
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
                df = pd.read_csv(ddir + mesure + '/niveau_'+niveau+'/'+station+'_aeronet_'+niveau+'_'+resoTempo+'.csv', parse_dates={'datetime':['date']}, header=0, index_col=0, usecols=['date', variable])
            except KeyError:
                df = pd.read_csv(ddir + mesure + '/'+station+'_'+mesure+'_'+resoTempo+'.csv', parse_dates={'datetime':['date']}, header=0, index_col=0, usecols=['date', variable])
            geo = station
        else:
            epidemio = request.POST['epidemio']
            pays = request.POST['pays']
            echelle = request.POST['echelle']
            variable = str(request.POST['variable'])
            try:
                district = request.POST['district']
                csv = pd.read_csv(ddir + epidemio + '/'+pays+'_'+epidemio+'_'+echelle+'.csv', parse_dates={'datetime':['date']}, header=0, index_col=0, usecols=['date', 'district', variable])
                df = csv[csv.district==district]
                geo = district
            except KeyError:
                df = pd.read_csv(ddir + epidemio + '/'+pays+'_'+epidemio+'_'+echelle+'.csv', parse_dates={'datetime':['date']}, header=0, index_col=0, usecols=['date', variable])
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
    print request.POST
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
                df = pd.read_csv(ddir + mesure + '/niveau_'+niveau+'/'+station+'_aeronet_'+niveau+'_'+resoTempo+'.csv', parse_dates={'datetime':['date']}, header=0, index_col=0, usecols=['date', variable])
            except KeyError:
                df = pd.read_csv(ddir + mesure + '/'+station+'_'+mesure+'_'+resoTempo+'.csv', parse_dates={'datetime':['date']}, header=0, index_col=0, usecols=['date', variable])
            dictdatas = {'header':station, 'varName':variable, 'datas':df[variable].replace(np.nan,'NaN').values.tolist(), 'dates':df.index.tolist()}
        else:
            epidemio = request.POST['epidemio']
            pays = request.POST['pays']
            echelle = request.POST['echelle']
            variable = str(request.POST['variable'])
            print variable
            try:
                district = request.POST['district']
                csv = pd.read_csv(ddir + epidemio + '/'+pays+'_'+epidemio+'_'+echelle+'.csv', parse_dates={'datetime':['date']}, header=0, index_col=0, usecols=['date', 'district', variable])
                df = csv[csv.district==district]
            except KeyError:
                print 'keyError'
                df = pd.read_csv(ddir + epidemio + '/'+pays+'_'+epidemio+'_'+echelle+'.csv', parse_dates={'datetime':['date']}, header=0, index_col=0, usecols=['date', variable])
            dictdatas = {'header':pays, 'varName':variable, 'datas':df[variable].replace(np.nan,'NaN').values.tolist(), 'dates':df.index.tolist()}
        return HttpResponse(json.dumps(dictdatas, cls=DjangoJSONEncoder), content_type='application/json')
    else:
        if 'submit' in request.POST.keys():
            filename = request.POST['filename']
            return sendfile(request, tmpDir + '/' + filename)
        else:
            return render(request, 'teledm/mapDist.html')

#@login_required
#@user_passes_test(lambda u: u.groups.filter(name='teledm').exists())
def calval(request):
    if request.is_ajax():
        print sorted(request.POST)
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