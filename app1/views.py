#-*- coding: utf-8 -*-

from django.shortcuts import render_to_response
from djgeojson.views import GeoJSONLayerView
from django.contrib.auth.decorators import login_required
from django.template import RequestContext
from django.core.serializers.json import DjangoJSONEncoder
import json
import numpy as np

from app1.models import Station, Country, MeteoData
from app1.form import FormDatas
from moy_dist_parallel import calc_moy
from traitement import traitementDF


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

def form_test(request):
    return render_to_response('app1/form_test.html', {'form':FormDatas})

def maps(request):
    formdata = FormDatas()    
    print formdata
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
        val = [traitementDF(x,y) for x,y in [(ldf,z) for z in ldf.keys() if z != 'nbpx']]
        datas = dict(zip([val[i][0] for i in range(4)],[val[i][1] for i in range(4)]))
        print datas['lvmean']['series_temporelles']['Garango']['data']
        list_dates = ldf['vmean'].index.values.tolist()
#        dfmean = ldf['vmean'].replace(np.nan,'NaN')
#        list_dist = dfmean.columns.values.tolist()
#        list_dist = [a.encode('ascii','ignore') for a in list_dist]
#        dfmean.reset_index(inplace=True)
#        dfmean.rename(columns={'index':'date'},inplace=True)
#        list_dates = dfmean.date.values.tolist()
#        mean = []
#        series_temporelles = {}
#        for d in range(len(list_dates)):
#            list_dict = []
#            for dist in list_dist:
#                list_dict.append({"code":dist,"value":dfmean[dist][d]})
#            mean.append(list_dict)
#        for dn in list_dist:
#            series_temporelles[dn] = {'name':dn,'data':dfmean[dn].values.tolist()}
#        vmean_Garango = vmean.Garango.values.tolist()
#        series_temporelles = {dn:dfmean[dn].values.tolist() for dn in list_dist}
        geojson = pays+"_"+niveau+"_sante.geojson"
        dictdatas = {'dates':list_dates,'datas':datas,'shape':geojson}
        jsdatas = json.dumps(dictdatas, cls=DjangoJSONEncoder)
        print type(dictdatas)
        return render_to_response('app1/map1.html',{'jsdatas':jsdatas},context_instance=RequestContext(request))
    else:
        return render_to_response('app1/map.html',{},context_instance=RequestContext(request))