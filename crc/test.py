# -*- coding: utf-8 -*-
"""
Created on Wed Nov  9 18:52:37 2016

@author: sebastien
"""

import os
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STATIC_ROOT = BASE_DIR + "/static/"
print STATIC_ROOT