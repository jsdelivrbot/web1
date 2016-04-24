from bootstrap3_datetime.widgets import DateTimePicker
from django import forms
from thredds_crawler.crawl import Crawl
from netCDF4 import Dataset


urlxml = 'http://localhost:8080/thredds/catalog.html'
urldap = 'http://localhost:8080/thredds/dodsC/'
crw = Crawl(urlxml, select=[".*d.nc"])

xml = [[],[],[],[],[],[]]
for i in crw.datasets:
    tmp = i.id.split('/')
    for n in range(len(tmp)):
        if tmp[n] not in xml[n]:
            xml[n].append(tmp[n])
    nc = Dataset(urldap+i.id)
    xml[5] = xml[5]+list(set(nc.variables.keys())-set(['time','latitude','longitude']))
catalog = {'types':xml[0],'capteurs':xml[1],'produits':xml[2],'res_spatiale':xml[3],'variables':xml[5]}




class FormDatas(forms.Form):
#    todo = forms.CharField(
#        widget=forms.TextInput(attrs={"class": "form-control"}))
#    date = forms.DateField(
#        widget=DateTimePicker(options={"format": "YYYY-MM-DD",
#                                       "pickTime": False}))
#    reminder = forms.DateTimeField(
#        required=False,
#        widget=DateTimePicker(options={"format": "YYYY-MM-DD HH:mm",
#                                      "pickSeconds": False}))
    types = forms.ChoiceField(choices=((v,v) for v in catalog['types']),widget=forms.Select(attrs={'id':'types','name':'types'}))
    capteurs = forms.ChoiceField(choices=((v,v) for v in catalog['capteurs']),widget=forms.Select(attrs={'id':'capteurs','name':'capteurs'}))
    produits = forms.ChoiceField(choices=((v,v) for v in catalog['produits']),widget=forms.Select(attrs={'id':'produits','name':'produits'}))
    res_spatiale = forms.ChoiceField(choices=((v,v) for v in catalog['res_spatiale']),widget=forms.Select(attrs={'id':'res_spatiale','name':'res_spatiale'}))
    variables = forms.ChoiceField(choices=((v,v) for v in catalog['variables']),widget=forms.Select(attrs={'id':'variable','name':'variable'}))
                                      
