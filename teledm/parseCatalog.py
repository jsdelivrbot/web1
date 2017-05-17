#!/usr/bin/env python2
# -*- coding: utf-8 -*-
from netCDF4 import Dataset,num2date,date2num,date2index
from siphon.catalog import TDSCatalog
import requests
import json
import ssl
from datetime import datetime
from StringIO import StringIO
from bs4 import BeautifulSoup
from lxml import etree
from lxml.html.soupparser import fromstring
from thredds_crawler.crawl import Crawl
from django.conf import settings
import os


#url = "http://localhost:8080/thredds/dodsC/satellite/modis/MYD04/res009/MYD04_r009_d.nc"
url = os.path.join(settings.TDS_URL % (settings.TDS_USER+':'+settings.TDS_PWD+'@'), "catalogRefs/CatalogTELEDEM.html")
url = "http://localhost:8080/thredds/CatalogTELEDM.html"
cat = TDSCatalog('http://localhost:8080/thredds/CatalogTELEDM.html')
#context = ssl._create_unverified_context()
#catT = TDSCatalog(url)

cat = Crawl(url)
datasets = [i.id for i in cat.datasets]
root = "/home/mers/Bureau/teledm/donnees/"
catalog = {}
for item in datasets:
    p = catalog
    for x in item.split('/'):
        p = p.setdefault(x, {})
    
ds = {}
for d in datasets:
    dp = d.split('/')
    nc = Dataset(root+d,'r')
    dt = nc.variables['time']
    dates = num2date(dt[:], dt.units)
    dset = {}
    dset['dates'] = [datetime.strftime(dates[0], '%Y-%m-%d'),datetime.strftime(dates[-1], '%Y-%m-%d')]
    lvar = list(set(nc.variables.keys())-set(nc.dimensions.keys()))
    for v in lvar:
        dims = nc.variables[v].dimensions
        dset[v] = dims
    ds[dp[-1]] = dset
    catalog[dp[0]][dp[1]][dp[2]][dp[3]][dp[4]] = ds
    nc.close()

with open('/home/mers/Bureau/cat.txt','w') as txt:
    txt.write(json.dumps(catalog))
    
url1 = 'http://localhost:8080/thredds/wms/{}?service=WMS&version=1.3.0&request=GetCapabilities'.format(datasets[159])
response = requests.get(url1, auth=requests.auth.HTTPBasicAuth(settings.TDS_USER,settings.TDS_PWD))
xml = StringIO(response.text)
xml = bytes(bytearray(response.text, encoding='utf-8'))
tree = etree.parse(xml)
nspace = {'gis':'http://www.opengis.net/wms'}
names = tree.xpath('//gis:Layer/gis:Name/text()', namespaces=nspace)
dim = tree.xpath('//gis:Layer/gis:Dimension/text()', namespaces=nspace)

tree = etree.ElementTree(root)

every_tag = ['%s, %s' % (tree.getpath(e), e.text) for e in root.iter()]
tree = BeautifulSoup(response.conte, 'xml')
v = tree.find_all("title")
nc = Dataset(url)
for v in sorted(nc.variables.keys()):
    vmin = nc.variables[v][:].min()
    vmax = nc.variables[v][:].max()
    print('%s, vmin=%s, vmax=%s' % (v, vmin, vmax))
nc.close()
