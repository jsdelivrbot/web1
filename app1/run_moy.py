from moy_dist import calc_moy

dirout,country,level,year,rtmp,typ, satell, product,reso,vname = "/home/sebastien/Bureau","burkina","district",2007,"d","satellite","modis","MYD04","009","Deep_Blue_Aerosol_Optical_Depth_550_Land"
print dirout
calc_moy(dirout,country,level,year,rtmp,typ, satell, product,reso,vname)