#-*- coding: utf-8 -*-

from django.shortcuts import render_to_response, HttpResponse
#from django.contrib.auth.decorators import login_required
from django.template import RequestContext
from django.core.serializers.json import DjangoJSONEncoder
from sendfile import sendfile
import json, simplejson
import os
import pandas as pd
import numpy as np

from moy_dist_parallel import calc_moy
from traitement import traitementDF
from scatterPlots import scatterSatStation, scatter2Sat
from Util import *

tmpDir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'teledm/tmp')
ddir = "/home/sebastien/Bureau/teledm/donnees/"

def home(request):
    print request.POST
    if request.is_ajax():
        dates = [d.strftime('%Y-%m-%d') for d in pd.date_range('2014-01-01','2014-01-31', freq='D')]
        datas = np.random.randint(0,3,31).tolist()
        datas = {'dates':dates, 'datas':datas}
        return HttpResponse(json.dumps(datas), content_type='teledm/home.html')
    else:
        return render_to_response('teledm/home.html', context_instance=RequestContext(request))
    

def mapViewer(request):
    if request.method == "POST":
        deb = request.POST['datedebut']
        types = request.POST['type'] 
        sat = request.POST['capteur']  
        prod = request.POST['produit']
        res_temp = request.POST['pasdetemps']
        res = request.POST['resospatiale']
        varname = request.POST['variable']
        ncfile = prod + '_r' + res + '_' + res_temp + '.nc'
        URL = "http://localhost:8080/thredds/wms/" + types + "/" + sat + "/" + prod + "/res" + res + "/"+ ncfile + "?service=ncWMS"
        dictdatas = {'URL': URL,'ncfile': ncfile, 'variable': varname, 'date': deb}
        info = json.dumps(dictdatas, cls=DjangoJSONEncoder)
        return render_to_response('teledm/mapViewer.html',{'Info': info},context_instance=RequestContext(request))
    else:
        info = json.dumps({"date": "2007-01-01"}, cls=DjangoJSONEncoder)
        return render_to_response('teledm/mapViewer.html',{'deb': info},context_instance=RequestContext(request))

def mapDist(request):
    
#    if request.method == 'POST':
#        if request.POST.get('submit') == "SUBMIT":
#            ddirout = "/home/dev/web1/teledm/protected"
#            deb = request.POST['datedebut'] #"2007-01-01"
#            fin = request.POST['datefin'] #"2007-06-30"
#            pays = request.POST['pays']  
#            niveau = request.POST['decoupage'] 
#            types = request.POST['type'] 
#            sat = request.POST['capteur']  
#            prod = request.POST['produit']
#            res_temp = request.POST['pasdetemps']
#            res = request.POST['resospatiale']
#            varname = request.POST['variable'] #'Deep_Blue_Aerosol_Optical_Depth_550_Land'
#            shape = "merge2500"  # "all_fs" "merge1500" "merge2500"
#            ldf = calc_moy(ddirout,deb,fin,pays,niveau,types,sat,prod,res_temp,res,varname,shape)        
#            val = [traitementDF(x,y) for x,y in [(ldf,z) for z in ldf.keys() if z != 'nbpx']]
#            datas = dict(zip([val[i][0] for i in range(4)],[val[i][1] for i in range(4)]))
#            list_dates = ldf['vmean'].index.values.tolist()
#            geojson = pays+"_"+niveau+"_sante.geojson"
#            filename = varname + '_' + prod + '_r' + res + '_' + niveau + '_' + shape + '_' + pays + '_' + deb.replace('-','') + fin.replace('-','') + res_temp + '.nc'
#            dictdatas = {'dates':list_dates,'datas':datas,'shape':geojson, 'filename':filename}
#            jsdatas = json.dumps(dictdatas, cls=DjangoJSONEncoder)
#            return render_to_response('teledm/mapDist.html',{'jsdatas':jsdatas},context_instance=RequestContext(request))
#        elif request.POST.get('submit') == "Download":
#            filename = os.path.join(tmpDir, request.POST['filename'])
#            print filename
#            return sendfile(request, filename)
    if request.is_ajax():
        print request.POST
        ddirout = "/home/dev/web1/teledm/protected"
        deb = request.POST['datedebut'] #"2007-01-01"
        fin = request.POST['datefin'] #"2007-06-30"
        pays = request.POST['pays']  
        niveau = request.POST['decoupage'] 
        types = request.POST['type'] 
        sat = request.POST['capteur']  
        prod = request.POST['produit']
        res_temp = request.POST['pasdetemps']
        res = request.POST['resospatiale']
        varname = request.POST['variable'] #'Deep_Blue_Aerosol_Optical_Depth_550_Land'
        shape = "merge2500"  # "all_fs" "merge1500" "merge2500"
        ldf = calc_moy(ddirout,deb,fin,pays,niveau,types,sat,prod,res_temp,res,varname,shape)
        val = [traitementDF(x,y) for x,y in [(ldf,z) for z in ldf.keys() if z != 'nbpx']]
        datas = dict(zip([val[i][0] for i in range(4)],[val[i][1] for i in range(4)]))
        list_dates = ldf['vmean'].index.values.tolist()
        geojson = pays+"_"+niveau+"_sante.geojson"
        filename = varname + '_' + prod + '_r' + res + '_' + niveau + '_' + shape + '_' + pays + '_' + deb.replace('-','') + fin.replace('-','') + res_temp + '.nc'
        dictdatas = {'dates':list_dates,'datas':datas,'shape':geojson, 'filename':filename}
        print dictdatas
        return HttpResponse(json.dumps(dictdatas, cls=DjangoJSONEncoder), content_type='application/json')
    else:
        jsdatas = json.dumps({'form':''}, cls=DjangoJSONEncoder)
        return render_to_response('teledm/mapDist.html',{'jsdatas':jsdatas},context_instance=RequestContext(request))

def calval(request):
    if request.is_ajax():
        print request.POST
        if request.POST['action'] == 'scatter':
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
            level_sat1 = request.POST['level1']
            if request.POST['level1'] == 'Layer':
                level_sat1 = ''
            else:
                level_sat1 = np.float(request.POST['level1'])
            if 'type2' in request.POST:
                type2 = request.POST['type2']
                sat2 = request.POST['capteur2']
                prd_sat2 = request.POST['produit2']
                res_sat2 = request.POST['resospatiale2'][3:]
                variable_sat2 = request.POST['variable2']
                if request.POST['level2'] == 'Layer':
                    level_sat2 = ''
                else:
                    level_sat2 = np.float(request.POST['level2'])
                df = scatter2Sat(ulx,uly,lrx,lry,z_buffer,pas_de_temps1,datedebut, datefin,
                                 type1,sat1,prd_sat1,res_sat1,variable_sat1,level_sat1,
                                 type2,sat2,prd_sat2,res_sat2,variable_sat2,level_sat2
                                 )
            else:
                periode = request.POST['integration']
                if 'stationsaeronet' in request.POST:
                    inSitu = "aeronet"
                    station = request.POST['stationsaeronet']
                    varStation = request.POST['variablesaeronet']
                    niveau = request.POST['niveau']
                else:
                    inSitu = 'Teom'
                    station = request.POST['stationsteom']
                    varStation = request.POST['variablesteom']
                    niveau = ''
                df = scatterSatStation(ulx,uly,lrx,lry,z_buffer,pas_de_temps1,periode,datedebut, datefin,
                                       type1,sat1,prd_sat1,res_sat1,variable_sat1,level_sat1,
                                       inSitu, station, varStation, niveau
                                       )
            print df
            return HttpResponse(simplejson.dumps(df, ignore_nan=True,default=datetime.isoformat), content_type='text/json')
        else:
            vals = np.random.random_sample(10)
            vals[3:6] = np.nan
            dic = {"sat":"MYD04","dates":[datetime(2007,01,01),datetime(2007,01,02)], "satVar":"AOT", "set":vals.tolist()}
            
            return HttpResponse(simplejson.dumps(dic, ignore_nan=True,default=datetime.isoformat), content_type='text/json')
    else:
        return render_to_response('teledm/calval.html',{},context_instance=RequestContext(request))
