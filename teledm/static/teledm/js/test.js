function formatDate(date) {
    var d = new Date(date);
    var month = '' + (d.getMonth() + 1);
    var day = '' + d.getDate();
    var year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

function getCookie(name) {
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                return decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
}


$.ajaxSetup({
    // fonction appelée avant d'envoyer une requête AJAX
    beforeSend: function(xhr, settings) {
         // on ajoute le header que si la requête est pour le site en cours
         // (URL relative) et est de type POST
         if (!/^https?:.*/.test(settings.url)  && settings.type == "POST") {
             // attachement du token dans le header
             xhr.setRequestHeader("X-CSRFToken",  getCookie('csrftoken'));
         }
     }
});

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
    var URL = "http://localhost:8000/climdata.u-bourgogne.fr/teledm/test/https://se5780me:erg54erg55@climdata.u-bourgogne.fr:8443/thredds/wms/satellite/modis/MYD07/res009/MYD07_r009_d.nc?service=WMS&version=1.3.0&request=GetMap&CRS=CRS%3A84&LAYERS=Surface_Temperature&elevation=Layer&TRANSPARENT=true&FORMAT=image%2Fpng&SRS=EPSG";
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
    var URL = "https://se5780me:erg54erg55@climdata.u-bourgogne.fr:8443/thredds/wms/satellite/modis/MYD07/res009/MYD07_r009_d.nc?service=WMS&version=1.3.0&request=GetMap&CRS=CRS%3A84&LAYERS=Surface_Temperature&elevation=Layer&TRANSPARENT=true&FORMAT=image%2Fpng&SRS=EPSG";
    //var URL = "https://climdata.u-bourgogne.fr:8443/thredds/wms/satellite/modis/MYD07/res009/MYD07_r009_d.nc?service=WMS&version=1.3.0&request=GetMap&CRS=CRS%3A84&LAYERS=Surface_Temperature&elevation=Layer&TRANSPARENT=true&FORMAT=image%2Fpng&SRS=EPSG";
    //var URL = "http://localhost:8080/teledm/test/wms/satellite/modis/MYD07/res009/MYD07_r009_d.nc?service=WMS&version=1.3.0&request=GetMap&CRS=CRS%3A84&LAYERS=Surface_Temperature&elevation=Layer&TRANSPARENT=true&FORMAT=image%2Fpng&SRS=EPSG";
    var date = new Date("2007-01-01");
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


function readCat(){
    //var URLCat = "https://climdata.u-bourgogne.fr:8443/thredds/satellite/modis/catalog.xml";
    //var URLCat = "http://localhost:8080/thredds/satellite/modis/catalog.xml";
    var URLCat = "satellite/modis/catalog.xml";
    alert(URLCat);
    var auth = 'Basic ' + "se5780me:erg54erg55";
    $.ajax( {
				type: "POST",
				url: "",
                data: {'url':URLCat},
				dataType: "xml",
				async: false,
                beforeSend: function(xhr, settings) {
                    xhr.setRequestHeader("X-CSRFToken", $.cookie('csrftoken'));
                },
				success: function(xml) {
					console.log('ok');
				},
			});
}



function download(){
    var URL = "https://climdata.u-bourgogne.fr:8443/thredds/ncss/satellite/modis/MYD07/res009/MYD07_r009_d.nc?var=Surface_Temperature&north=35.404345773289&west=-0.73767096860104&east=8.471020577976&south=26.195654226711&horizStride=1&time_start=2006-07-02T00:00:00.000Z&time_end=2007-06-30T00:00:00.000Z&timeStride=1&addLatLon=true&accept=netcdf";
    var link = document.createElement("a");
    link.download = 'test.nc';
    link.href = URL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    delete link;
}


var date = "2007-01-01";
window.onload = function(){
    initMap();
}