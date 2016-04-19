#-*- coding: utf-8 -*-

from django.shortcuts import render_to_response
from djgeojson.views import GeoJSONLayerView
from django.contrib.auth.decorators import login_required
from django.template import RequestContext
from django.core.serializers.json import DjangoJSONEncoder
import json
import numpy as np

from app1.models import Station, Country, MeteoData
from app1.form import DatePickerForm
from moy_dist_parallel import calc_moy


def thredds(request):
    print request.POST
    return render_to_response('app1/thredds.html')

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

def datepicker(request):
    return render_to_response('app1/datepicker.html', {'form':DatePickerForm})

def maps(request):
    print request.POST
    if request.method == 'POST':
        ddirout = "/home/sebastien/Bureau/"
        deb = "2007-01-01" #request.POST['datedebut'] #
        fin = "2007-06-30" #request.POST['datefin'] #
        pays = request.POST['pays']  
        niveau = request.POST['decoupage'] 
        types = request.POST['type'] 
        sat = request.POST['capteur']  
        prod = request.POST['produit']
        res_temp = request.POST['pasdetemps']
        res = request.POST['resospatiale']
        varname = 'Deep_Blue_Aerosol_Optical_Depth_550_Land'
        shape = "merge2500"  # "all_fs" "merge1500" "merge2500"
        print niveau,pays
        ldf = calc_moy(ddirout,deb,fin,pays,niveau,types,sat,prod,res_temp,res,varname,shape)        
        vmean = ldf['vmean'].replace(np.nan,'null')
        list_dist = sorted(vmean.columns.values.tolist())
        list_dist = [a.encode('ascii','ignore') for a in list_dist]
        vmean.reset_index(inplace=True)
        vmean.rename(columns={'index':'date'},inplace=True)
        list_dates = vmean.date.values.tolist()
        vmean_dict = {}
        series_temporelles = []
        for d in range(len(list_dates)):
            list_dict = []
            for dist in list_dist:
                list_dict.append({'code':dist,'value':vmean[dist][d]})
            vmean_dict['d'+str(d)] = list_dict
        for dn in list_dist:
            series_temporelles.append({'name':dn,'data':vmean[dn].values.tolist()})
        vmean_Garango = vmean.Garango.values.tolist()
#        series_temporelles = {dn:vmean[dn].values.tolist() for dn in list_dist}
        geojson = pays+"_"+niveau+"_sante.geojson"
        dictmapdata = {'dates':list_dates,'districts':list_dist,'vmean':vmean_dict,'shape':geojson, "series_temporelles":series_temporelles}
        jsmapdatas = json.dumps(dictmapdata, cls=DjangoJSONEncoder)
        return render_to_response('app1/map1.html',{'mapdatas':jsmapdatas},context_instance=RequestContext(request))
    else:
        return render_to_response('app1/map.html',{},context_instance=RequestContext(request))