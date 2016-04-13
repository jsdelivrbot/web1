#-*- coding: utf-8 -*-

from django.shortcuts import render_to_response
from djgeojson.views import GeoJSONLayerView
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_protect
from django.template import RequestContext
from django.core.serializers.json import DjangoJSONEncoder
import json

from app1.models import Station, Country, MeteoData
from app1.form import DatePickerForm



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
    print request.POST
    if request.method == "POST":
        st = request.POST['stations']
        var = request.POST['variables']
        vals = MeteoData.objects.filter(date__range=(['2007-01-01','2007-01-31']), station__station=st).values('date',var)
        dictdatas = {'dates':[v['date'] for v in vals], 'valeurs':[v[var] for v in vals], 'station_name':st, 'variable_name':var}
        datas = json.dumps(dictdatas, cls=DjangoJSONEncoder)
        print datas
        return render_to_response('app1/meteo.html',{'weatherdatas':datas}, context_instance=RequestContext(request))
    else:
        return render_to_response('app1/meteo.html',{}, context_instance=RequestContext(request))        

def datepicker(request):
    return render_to_response('app1/datepicker.html', {'form':DatePickerForm})

def maps(request):
    return render_to_response('app1/map.html')