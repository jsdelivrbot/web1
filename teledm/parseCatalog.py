#!/usr/bin/env python2
# -*- coding: utf-8 -*-
from netCDF4 import Dataset,num2date,date2num,date2index
from siphon.catalog import TDSCatalog
import requests
from bs4 import BeautifulSoup
from thredds_crawler.crawl import Crawl
from django.conf import settings



#url = "http://localhost:8080/thredds/dodsC/satellite/modis/MYD04/res009/MYD04_r009_d.nc"
url = "https://se5780me:erg54erg55@climdata.u-bourgogne.fr/thredds/catalogRefs/CatalogTELEDEM.html"
cat = TDSCatalog('http://localhost:8080/thredds/CatalogTELEDM.html')
context = ssl._create_unverified_context()
catT = TDSCatalog(url, context=context)

cat = Crawl(url)
datasets = [i.id for i in cat.datasets]
url1 = 'http://localhost:8080/thredds/wms/{}?service=WMS&version=1.3.0&request=GetCapabilities'.format(datasets[70])
#response = requests.get(url, auth=requests.auth.HTTPBasicAuth(settings.TDS_USER, settings.TDS_PWD))
response = requests.get(url1, auth=requests.auth.HTTPBasicAuth('se5780me','erg54erg55'))
tree = BeautifulSoup(response.text, 'html')
v = tree.find_all("title")
nc = Dataset(url)
for v in sorted(nc.variables.keys()):
    vmin = nc.variables[v][:].min()
    vmax = nc.variables[v][:].max()
    print('%s, vmin=%s, vmax=%s' % (v, vmin, vmax))
nc.close()
