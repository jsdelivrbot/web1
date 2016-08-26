#-*- coding: utf-8 -*-

from django.shortcuts import render_to_response
from djgeojson.views import GeoJSONLayerView
from django.contrib.auth.decorators import login_required
from django.template import RequestContext
from django.core.serializers.json import DjangoJSONEncoder
import json

from app1.models import Station, Country, MeteoData
#from app1.form import FormDatas
from moy_dist_parallel import calc_moy
from traitement import traitementDF


def thredds(request):
    print request.POST
    return render_to_response('app1/thredds.html')

def viewer(request):
    return render_to_response('app1/data_mapping.html')

def pointViewer(request):
    return render_to_response('app1/point_viewer.html')

@login_required
def earthquakes(request):
    return render_to_response('app1/earthquakes.html')


class StationLayer(GeoJSONLayerView):
    def get_queryset(self):
        cty = Country.objects.get(country='BURKINAFASO').country_id
        context = Station.objects.all().filter(country=cty)
        return context

def meteo(request):
    if request.method == "POST":
        st = request.POST['stations']
        var = request.POST['variables']
        vals = MeteoData.objects.filter(date__range=(['2007-01-01','2007-01-31']), station__station=st).values('date',var)
        dictdatas = {'dates':[v['date'] for v in vals], 'valeurs':[v[var] for v in vals], 'station_name':st, 'variable_name':var}
        weatherdatas = json.dumps(dictdatas, cls=DjangoJSONEncoder)
        print weatherdatas
        return render_to_response('app1/meteo.html',{'weatherdatas':weatherdatas}, context_instance=RequestContext(request))
    else:
        return render_to_response('app1/meteo.html',{}, context_instance=RequestContext(request))        

def maps(request):
#    formdata = FormDatas()    
    print request.POST
    if request.method == 'POST':
        ddirout = "/home/sebastien/Bureau/"
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
        return render_to_response('app1/map1.html',{'jsdatas':jsdatas},context_instance=RequestContext(request))
    else:
        return render_to_response('app1/map.html',{},context_instance=RequestContext(request))

def calval(request):
    print request.POST
    if request.method == 'POST':
#        ulx = request.POST[]
#        uly = request.POST[]
#        lrx =request.POST[]
#        lry = request.POST[]
        z_buffer = request.POST['buffer']
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
        nom_station1 = request.POST['aeronetstation']
        variable_station1 = request.POST['variableaeronet']
        niveau = request.POST['niveau']
        nom_station2 = request.POST['teomstation']
        variable_station2 = request.POST['teomvariable']
        pays = request.POST['pays']
        district = request.POST['district']
        variable_meningite = request.POST['epidemiovariable']
        print [z_buffer,datedebut, datefin,pas_de_temps,type1,sat1,prd_sat1,res_sat1,variable_sat1,level_sat1,nom_station1,variable_station1,niveau,nom_station2,variable_station2,pays,district,variable_meningite]
        return render_to_response('app1/calval.html',{},context_instance=RequestContext(request))
    else:
        return render_to_response('app1/calval_form.html',{},context_instance=RequestContext(request))