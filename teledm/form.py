from thredds_crawler.crawl import Crawl
from netCDF4 import Dataset, num2date


urlxml = 'http://localhost:8080/thredds/catalog.html'
urldap = 'http://localhost:8080/thredds/dap/'
crw = Crawl(urlxml, select=[".*d.nc"])

xml = [[],[],[],[],[],[],[]]
for i in crw.datasets:
    print i.id
    tmp = i.id.split('/')
    for n in range(len(tmp)):
        if tmp[n] not in xml[n]:
            xml[n].append(tmp[n])
    nc = Dataset(i.services[0]['url'])
    xml[5] = xml[5]+list(set(nc.variables.keys())-set(nc.dimensions.keys()))
    dates = nc.variables['time']
    xml[6] = [num2date(dates[0],dates.units).date(),num2date(dates[-1],dates.units).date()]
    nc.close()
catalog = {'types':xml[0],'capteurs':xml[1],'produits':xml[2],'res_spatiale':xml[3],'variables':xml[5]}
