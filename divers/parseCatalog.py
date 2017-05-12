#!/usr/bin/env python2
# -*- coding: utf-8 -*-
from netCDF4 import Dataset,num2date,date2num,date2index
from siphon.catalog import TDSCatalog
from thredds_crawler.crawl import Crawl

#url = "http://localhost:8080/thredds/dodsC/satellite/modis/MYD04/res009/MYD04_r009_d.nc"
url = "/home/mers/Bureau/teledm/donnees/satellite/modis/MYD04/res009/MYD04_r009_d.nc"
cat = TDSCatalog('http://localhost:8080/thredds/catalog.html')
catT = TDSCatalog('http://localhost:8080/thredds/CatalogTELEDM.html')

cat = Crawl('http://localhost:8080/thredds/catalog.html')
datasets = [i.id for i in cat.datasets]
nc = Dataset(url)
for v in sorted(nc.variables.keys()):
    vmin = nc.variables[v][:].min()
    vmax = nc.variables[v][:].max()
    print('%s, vmin=%s, vmax=%s' % (v, vmin, vmax))
nc.close()
