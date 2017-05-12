#!/usr/bin/env python2
# -*- coding: utf-8 -*-

from netCDF4 import Dataset, num2date

nc = Dataset('http://localhost:8080/thredds/dodsC/MYD04_r009_t.nc', 'r')
dt = nc.variables['time']
dates = num2date(dt[:], dt.units)
nc.close()

nc = Dataset('/home/mers/Bureau/teledm/donnees/satellite_agreg/modis/MYD04/MYD04_r009_d_2006.nc', 'r+')
dates = nc.variables['time']
nc_units = dates.units
dates.units = 'hours since 1900-1-1 00:00:00'
nc.close()
