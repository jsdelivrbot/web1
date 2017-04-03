#!/usr/bin/env python2
# -*- coding: utf-8 -*-

from thredds_crawler.crawl import Crawl
from netCDF4 import Dataset, num2date
from pydap.client import open_url
from opendap import opendap

xml = Crawl("http://localhost:8080/thredds/catalog.xml")
tmp = [d.id.split('/')[:-1][::-1] for d in xml.datasets]
catalog = {}
for d in tmp:
    [catalog[]

url = "http://localhost:8080/thredds/dodsC/satellite/modis/MYD07/res009/MYD07_r009_d.nc"
dataset = open_url(url)
v = dataset['mean_PM10']

nc = Dataset(url)
v = nc.variables['Total_Ozone'][:]
v[:].min()
