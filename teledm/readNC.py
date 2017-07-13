#!/usr/bin/env python2
# -*- coding: utf-8 -*-

import sys
import os

from netCDF4 import Dataset, num2date
import pandas as pd


try:
    fichier = sys.argv[1]
except IndexError:
    sys.exit('Fichier impossible a ouvrir')

path = os.path.dirname(os.path.abspath(fichier))

nc = Dataset(fichier, 'r')
listVar = list(set(nc.variables.keys()) - set(['time', 'index_dist']))
dt = nc.variables['time']
dates = num2date(dt[:], dt.units)
districts = nc.variables['index_dist'].standard_name.split('//')
for k in listVar:
    arr = nc.variables[k][:]
    df = pd.DataFrame(data=arr, index=dates, columns = districts)
    df.to_csv(os.path.join(path, k+'.csv'), header=True, index=True, index_label='date')
nc.close()