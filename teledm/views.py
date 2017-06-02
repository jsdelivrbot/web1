#-*- coding: utf-8 -*-

from django.shortcuts import HttpResponse, render, redirect
from django.http import Http404
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
from pathFiles import PathFile
from scatterPlots import scatterSatStation, scatter2Sat_Temporel, scatter2Sat_Spatial
from Util import *

import logging
logger = logging.getLogger(__name__)


tmpDir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'teledm/tmp')

def server_error(request):
    response = render('teledm/500.html',context_instance=RequestContext(request))
    response.status_code = 500
    return response

def proxyNCSS(request, path):
    params = '?' + '&'.join(['{}={}'.format(k,v) for k,v in request.GET.iteritems()])
    url = "https://climdata.u-bourgogne.fr/thredds/ncss/{}?{}".format(path,params)
    response = requests.get(url, auth=requests.auth.HTTPBasicAuth(settings.TDS_USER, settings.TDS_PWD), verify=False)
    return HttpResponse(response.content)


def proxyDownload(request, path):
    params = '?' + '&'.join(['{}={}'.format(k,v) for k,v in request.GET.iteritems()])
    url = os.path.join(settings.TDS_URL % (settings.TDS_USER+':'+settings.TDS_PWD+'@'),path+params)
    response = requests.get(url, auth=requests.auth.HTTPBasicAuth(settings.TDS_USER, settings.TDS_PWD), verify=False)
    return HttpResponse(response.content)


def proxyAjax(request, path):    
    url = os.path.join(settings.TDS_URL % (settings.TDS_USER +':'+settings.TDS_PWD+'@'), path)
    try:
        response = requests.get(url, auth=requests.auth.HTTPBasicAuth(settings.TDS_USER, settings.TDS_PWD), verify=False)
    except requests.ConnectionError:
        print(url)
        return render('500.html', {'erreur':'Connexion Impossible'})
    return HttpResponse(response.content)
    

def colorbar(request, path):
    params = '?' + '&'.join(['{}={}'.format(k,v) for k,v in request.GET.iteritems()])
    url = os.path.join(settings.TDS_URL % (''), path+params)
    response = requests.get(url, auth=requests.auth.HTTPBasicAuth(settings.TDS_USER, settings.TDS_PWD), verify=False)
    return HttpResponse(response.content, status=int(response.status_code))

def dates(request, path):
    params = '?' + '&'.join(['{}={}'.format(k,v) for k,v in request.GET.iteritems()])
    url = os.path.join(settings.TDS_URL % (''), path + params)
    response = requests.get(url, auth=requests.auth.HTTPBasicAuth(settings.TDS_USER, settings.TDS_PWD), verify=False)
    return HttpResponse(response.content, status=int(response.status_code))


def minmax(request, path):
    params = '?' + '&'.join(['{}={}'.format(k,v) for k,v in request.GET.iteritems()])
    url = os.path.join(settings.TDS_URL % (''), path + params)
    response = requests.get(url, auth=requests.auth.HTTPBasicAuth(settings.TDS_USER, settings.TDS_PWD), verify=False)
    return HttpResponse(response.content, status=int(response.status_code))


def proxyWMS(request, path):
    params = '?' + '&'.join(['{}={}'.format(k,v) for k,v in request.GET.iteritems()])
    url = os.path.join(settings.TDS_URL % (settings.TDS_USER+':'+settings.TDS_PWD+'@'),path+params)
    response = requests.get(url, auth=requests.auth.HTTPBasicAuth(settings.TDS_USER, settings.TDS_PWD), verify=False)
    return HttpResponse(response.content, status=int(response.status_code))


#@login_required
#@user_passes_test(lambda u: u.groups.filter(name='teledm').exists())
def home(request):
    return render(request, 'teledm/home.html')


#@login_required
#@user_passes_test(lambda u: u.groups.filter(name='teledm').exists())
def mapViewer(request):
    kwargs = request.POST
    print(kwargs)
    if request.is_ajax():
        variable = str(kwargs['variables'])
        logger.debug("Debug message!")
        logger.info("Info message!")
        logger.warning("Warning message!")
        logger.error("Error message!")
        logger.critical("Critical message!")
        if 'mesure' in kwargs.keys():
            fcsv = PathFile(**kwargs).csv
            df = pd.read_csv(fcsv, parse_dates={'datetime':['date']}, header=0, index_col=0, usecols=['date', variable])
            geo = kwargs['stations']
        else:
            fcsv = PathFile(**kwargs).csv
            try:
                geo = kwargs['district']
                csv = pd.read_csv(fcsv, parse_dates={'datetime':['date']}, header=0, index_col=0, usecols=['date', 'district', variable])
                df = csv[csv.district==geo]
            except KeyError:
                geo = kwargs['pays']
                df = pd.read_csv(fcsv, parse_dates={'datetime':['date']}, header=0, index_col=0, usecols=['date', variable])
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
    POST = request.POST
    kwargs = request.POST
    print kwargs
    if request.is_ajax():
        if 'capteur' in POST.keys():
            print 'capteur'
            ddirout = settings.MEDIA_ROOT
            deb = POST['datedebut']
            fin = POST['datefin']
            pays = POST['pays']
            niveau = POST['decoupage'] 
            types = POST['type'] 
            sat = POST['capteur']
            prod = POST['produit']
            res_temp = POST['pasdetemps']
            res = POST['resospatiale']
            varname = POST['variables']
            if 'level1' in POST.keys():
                level = int(POST['level1']) - 1
            else:
                level = -1
            ncfile = PathFile(**kwargs).nc
            fshape = PathFile(**kwargs).carto
            ldf, filename = calc_moy(ddirout,ncfile, fshape, deb,fin,pays,niveau,types,sat,prod,res_temp,res,varname,level)
            val = [traitementDF(x,y) for x,y in [(ldf,z) for z in ldf.keys() if z != 'nbpx']]
            datas = dict(zip([val[i][0] for i in range(4)],[val[i][1] for i in range(4)]))
            list_dates = ldf['vmean'].index.values.tolist()
            geojson = pays+"_"+niveau+"_sante.geojson"
            dictdatas = {'dates':list_dates,'datas':datas,'shape':geojson, 'filename':filename}
            print(filename)
        elif 'mesure' in POST.keys():
            variable = str(kwargs['variables'])
            fcsv = PathFile(**kwargs).csv
            df = pd.read_csv(fcsv, parse_dates={'datetime':['date']}, header=0, index_col=0, usecols=['date', variable])
            geo = kwargs['stations']
        else:
            variable = str(kwargs['variables'])
            fcsv = PathFile(**kwargs).csv
            try:
                geo = kwargs['district']
                csv = pd.read_csv(fcsv, parse_dates={'datetime':['date']}, header=0, index_col=0, usecols=['date', 'district', variable])
                df = csv[csv.district==geo]
            except KeyError:
                geo = kwargs['pays']
                df = pd.read_csv(fcsv, parse_dates={'datetime':['date']}, header=0, index_col=0, usecols=['date', variable])
            dictdatas = {'header':pays, 'varName':variable, 'datas':df[variable].replace(np.nan,'NaN').values.tolist(), 'dates':df.index.tolist()}
        return HttpResponse(json.dumps(dictdatas, cls=DjangoJSONEncoder), content_type='application/json')
    else:
        if 'submit' in POST.keys():
            print(os.path.join(tmpDir, POST['filename']))
            filesend = os.path.join(tmpDir, POST['filename'])
            return sendfile(request, filesend)
        else:
            return render(request, 'teledm/mapDist.html')

#@login_required
#@user_passes_test(lambda u: u.groups.filter(name='teledm').exists())
def calval(request):
    POST = request.POST
    if request.is_ajax():
        if POST['ulx']:
            ulx = float(POST['ulx'][0])
            uly = float(POST['uly'][0])
            lrx = float(POST['lrx'][0])
            lry = float(POST['lry'][0])
            z_buffer = POST['buffer'][0]
        else:
            z_buffer = int(POST['buffer'])
            ulx = POST['ulx'][0]
            uly = POST['uly'][0]
            lrx = POST['lrx'][0]
            lry = POST['lry'][0]
        pas_de_temps1 = POST['pasdetemps1'][0]
        datedebut = POST['datedebut'][0]
        datefin = POST['datefin'][0]
        type1 = POST['type1'][0]
        sat1 = POST['capteur1'][0]
        prd_sat1 = POST['produit1'][0]
        res_sat1 = POST['resospatiale1'][0][3:]
        variable_sat1 = POST['variable1'][0]
        if 'level1' in POST.keys():
            level_sat1 = int(POST['level1'][0]) - 1
        else:
            level_sat1 = -1
        if 'type2' in POST.keys():
            type2 = POST['type2'][0]
            sat2 = POST['capteur2'][0]
            prd_sat2 = POST['produit2'][0]
            res_sat2 = POST['resospatiale2'][0][3:]
            variable_sat2 = POST['variable2'][0]
            if 'level2' in POST.keys():
                level_sat2 = int(POST['level2'][0]) - 1
            else:
                level_sat2 = -1
            if POST['action'][0] == 'scatterTemporel':
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
            periode = POST['integration'][0]
            if 'stationsaeronet' in POST.keys():
                inSitu = "aeronet"
                station = POST['stationsaeronet'][0]
                varStation = POST['variablesaeronet'][0]
                niveau = POST['niveau'][0]
            else:
                inSitu = 'teom'
                station = POST['stationsteom'][0]
                varStation = POST['variablesteom'][0]
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