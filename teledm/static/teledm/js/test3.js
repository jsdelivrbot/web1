function formatDate(date) {
    var d = new Date(date);
    var month = '' + (d.getMonth() + 1);
    var day = '' + d.getDate();
    var year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

function initMap(){

    //#######################################
    // carto, fond carto initial
    //#######################################
    map = new OpenLayers.Map('map',{
        controls: [],
        projection: new OpenLayers.Projection("EPSG:4326"),
        restrictedExtent: [-180, -90, 180, 90],
        maxResolution: 0.4,
        minResolution: 0.001,
    });
    fond = new OpenLayers.Layer.WMS(
        "OSM",
        "http://vmap0.tiles.osgeo.org/wms/vmap0",
        {layers: 'basic',
        isBaseLayer: true}
    );
    map.addLayer(fond);
    map.zoomToMaxExtent();
    //var URL = "http://localhost:8000/climdata.u-bourgogne.fr/teledm/test/https://se5780me:erg54erg55@climdata.u-bourgogne.fr:8443/thredds/wms/satellite/modis/MYD07/res009/MYD07_r009_d.nc?service=WMS&version=1.3.0&request=GetMap&CRS=CRS%3A84&LAYERS=Surface_Temperature&elevation=Layer&TRANSPARENT=true&FORMAT=image%2Fpng&SRS=EPSG";
    var URL = "http://localhost:8080/thredds/wms/satellite/modis/MYD07/res009/MYD07_r009_d.nc?service=WMS&version=1.3.0&request=GetMap&CRS=CRS%3A84&LAYERS=Surface_Temperature&elevation=Layer&TRANSPARENT=true&FORMAT=image%2Fpng&SRS=EPSG";
    var date = new Date("2007-01-01");
    var date1 = formatDate(date);
    var wms = new OpenLayers.Layer.WMS(
        "wms",
        URL,
        {
            layers: "",
            transparent: "true",
            format: "image/png",
            styles: "boxfill/rainbow",
            colorscalerange: "270,350",
            time:date1,
            numcolorbands : "250",
            opacity : "100" //lstInfos.opacity
            },
        {isBaseLayer: false},
    );
    map.addLayer(wms);
    
}
    

function majLayer(date){
    //var URL = "http://localhost:8080/thredds/wms/satellite/modis/MYD07/res009/MYD07_r009_d.nc?service=WMS&version=1.3.0&request=GetMap&CRS=CRS%3A84&LAYERS=Surface_Temperature&elevation=Layer&TRANSPARENT=true&FORMAT=image%2Fpng&SRS=EPSG";
    //var URL = "https://se5780me:erg54erg55@climdata.u-bourgogne.fr:8443/thredds/wms/satellite/modis/MYD07/res009/MYD07_r009_d.nc?service=WMS&version=1.3.0&request=GetMap&CRS=CRS%3A84&LAYERS=Surface_Temperature&elevation=Layer&TRANSPARENT=true&FORMAT=image%2Fpng&SRS=EPSG";
    //var URL = "https://climdata.u-bourgogne.fr:8443/thredds/wms/satellite/modis/MYD07/res009/MYD07_r009_d.nc?service=WMS&version=1.3.0&request=GetMap&CRS=CRS%3A84&LAYERS=Surface_Temperature&elevation=Layer&TRANSPARENT=true&FORMAT=image%2Fpng&SRS=EPSG";
    var URL = "http://localhost:8000/climdata.u-bourgogne.fr/teledm/test3/proxy/wms/satellite/modis/MYD07/res009/MYD07_r009_d.nc?service=WMS&version=1.3.0&request=GetMap&CRS=CRS%3A84&LAYERS=Surface_Temperature&elevation=Layer&TRANSPARENT=true&FORMAT=image%2Fpng&SRS=EPSG";
    var date = new Date("2007-03-01");
    date.setDate(date.getDate() + 1);
    var date1 = formatDate(date);
    var wms = new OpenLayers.Layer.WMS(
        "wms",
        URL,
        {
            layers: "",
            transparent: "true",
            format: "image/png",
            styles: "boxfill/rainbow",
            colorscalerange: "270,350",
            time:date1,
            numcolorbands : "250",
            opacity : "100" //lstInfos.opacity
            },
        {isBaseLayer: false},
    );
    map.addLayer(wms);        
}

var date = "2007-01-01";
window.onload = function(){
    initMap();
}