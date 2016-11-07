#-*- coding: utf-8 -*-

from django.shortcuts import render_to_response
from django.contrib.auth.decorators import login_required
from django.template import RequestContext
from django.core.serializers.json import DjangoJSONEncoder
from sendfile import sendfile
import json

from moy_dist_parallel import calc_moy
from traitement import traitementDF
from scatter_plot import scatter_plot

def test(request):
    return render_to_response('app1/test.html')

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
        return render_to_response('app1/mapViewer.html',{'Info': info},context_instance=RequestContext(request))
    else:
    	info = json.dumps({"date": "2007-01-01"}, cls=DjangoJSONEncoder)
        return render_to_response('app1/mapViewer.html',{'deb': info},context_instance=RequestContext(request))

def mapDist(request):
    print request.POST
    fileName = ''
    if request.method == 'POST':
        if request.POST.get('submit') == "SUBMIT":
            ddirout = "/home/dev/web1/app1/protected"
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
            dictdatas = {'dates':list_dates,'datas':datas,'shape':geojson}
            jsdatas = json.dumps(dictdatas, cls=DjangoJSONEncoder)
            fileName = varname + '_r' + res + '_' + niveau + '_' + shape + '_' + pays + '_' + deb.replace('-','') + fin.replace('-','') + res_temp + '.nc'
            #print fileName
            return render_to_response('app1/mapDistPlot.html',{'jsdatas':jsdatas},context_instance=RequestContext(request))
        elif request.POST.get('submit') == "Download":
            print fileName            
            return sendfile(request, '/home/sebastien/dev/web1/app1/protected/Deep_Blue_Surface_Reflectance_Land_412_nm_MYD04_r009_district_merge2500_burkina_2007010120070131w.nc')

    else:
        return render_to_response('app1/mapDist.html',{},context_instance=RequestContext(request))

def calval(request):
    if request.method == 'POST':
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
        pas_de_temps = request.POST['pasdetemps']
        datedebut = request.POST['datedebut']
        datefin = request.POST['datefin']
        type1 = request.POST['type1']
        sat1 = request.POST['capteur1']
        prd_sat1 = request.POST['produit1']
        res_sat1 = request.POST['resospatiale1']
        variable_sat1 = request.POST['variable1']
        level_sat1 = request.POST['level1']
        if 'type2' in request.POST:
            type2 = request.POST['type2']
            sat2 = request.POST['capteur2']
            prd_sat2 = request.POST['produit2']
            res_sat2 = request.POST['resospatiale2']
            variable_sat2 = request.POST['variable2']
            level_sat2 = request.POST['level2']
        else:
            type2 = ""
            sat2 = ""
            prd_sat2 = ""
            res_sat2 = ""
            variable_sat2 = ""
            level_sat2 = ""
        nom_station1 = request.POST['stationsaeronet']
        variable_station1 = request.POST['variablesaeronet']
        niveau = request.POST['niveau']
        nom_station2 = request.POST['stationsteom']
        variable_station2 = request.POST['variablesteom']
        periode = request.POST['integration']
        if request.POST['pays'] == "Pays":
            pays = ""
            district = ""
            variable_meningite = ""
        else:
            pays = request.POST['pays']
            district = request.POST['district']
            variable_meningite = request.POST['variablesepidemio']
        df = scatter_plot(ulx,uly,lrx,lry,z_buffer,
                     pas_de_temps,periode,datedebut, datefin,
                     type1,sat1,prd_sat1,res_sat1,variable_sat1,level_sat1,
                     type2,sat2,prd_sat2,res_sat2,variable_sat2,level_sat2,
                     nom_station1,variable_station1,niveau,
                     nom_station2,variable_station2,
                     pays,district,variable_meningite)
        jsdatas = json.dumps(df, cls=DjangoJSONEncoder)
        
        return render_to_response('app1/calvalPlot.html', {'jsdatas': jsdatas}, context_instance=RequestContext(request))
    else:
        return render_to_response('app1/calval.html',{},context_instance=RequestContext(request))
