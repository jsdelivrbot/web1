# -*- coding: utf-8 -*-
import numpy as np
from moy_dist_parallel import calc_moy

def traitementDF(ldf,var):
    """
    Conversion dataframe issue de calc_moy en dict pour jquery    
    """
    dfvar = ldf[var].replace(np.nan,'NaN')
    list_dist = dfvar.columns.values.tolist()
    list_dist = [a.encode('ascii','ignore') for a in list_dist]
    dfvar.reset_index(inplace=True)
    dfvar.rename(columns={'index':'date'},inplace=True)
    list_dates = dfvar.date.values.tolist()
    all_dist = []
    series_temporelles = {}
    for d in range(len(list_dates)):
        list_dict = []
        for dist in list_dist:
            list_dict.append({"code":dist,"value":dfvar[dist][d]})
        all_dist.append(list_dict)
    for dn in list_dist:
        series_temporelles[dn] = {'name':dn,'data':dfvar[dn].values.tolist()}
    return 'l'+var,{'all_dist':all_dist,'series_temporelles':series_temporelles}

if __name__ == "__main__":
    
    ddirout = "/home/sebastien/Bureau/"
    deb = "2007-01-01"     #"1979" a ...
    fin = "2007-06-30"
    pays = "burkina"       #"burkina","mali","niger","senegal"
    niveau = "district"    #"pays","district","aire"
    types = "satellite"    #"satellite","re_analyse"
    sat = "modis"          #"modis","aura_omi","ecmwf","msg"
    prod = "MYD04"         #"MYD04","MYD05","MYD07","omaeruv","seviri_aerus","macc","era_interim"
    res_temp = "w"         #"d","w","m","t"
    res = "res009"            #"003","005","009","025","075","125"
    varname = 'Deep_Blue_Aerosol_Optical_Depth_550_Land'
    shape = "merge2500"  # "all_fs" "merge1500" "merge2500"
    
    ldf = calc_moy(ddirout,deb,fin,pays,niveau,types,sat,prod,res_temp,res,varname,shape)
    val = [traitementDF(x,y) for x,y in [(ldf,z) for z in ldf.keys() if z != 'nbpx']]
    val1 = dict(zip([val[i][0] for i in range(4)],[val[i][1] for i in range(4)]))