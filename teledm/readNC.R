library(ncdf4)

args <- commandArgs(TRUE)
fichier = args[1]
opath = dirname(normalizePath(fichier))
nc <- nc_open(fichier)
districts <- unlist(strsplit(ncatt_get(nc, 'index_dist')$standard_name, '//'))
dates <- as.POSIXct(ncvar_get(nc, 'time')*3600, origin='1900-01-01', tz='UTC')
for (k in names(nc$var)){
  arr <- ncvar_get(nc, k)
  df <- cbind(dates, data.frame(t(arr)))
  colnames(df) <- c('dates',districts)
  write.csv(df, paste(opath, '/', k, '1.csv', sep=''), row.names = FALSE, na='')
}
nc_close(nc)