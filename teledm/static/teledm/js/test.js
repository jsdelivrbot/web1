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
    var URL = "https://se5780me:erg54erg55@climdata.u-bourgogne.fr:8443/thredds/wms/satellite/modis/MYD07/res009/MYD07_r009_d.nc?service=WMS&version=1.3.0&request=GetMap&CRS=CRS%3A84&LAYERS=Surface_Temperature&elevation=Layer&TRANSPARENT=true&FORMAT=image%2Fpng&SRS=EPSG";
    //var URL = "http://localhost:8080/thredds/wms/satellite/modis/MYD07/res009/MYD07_r009_d.nc?service=WMS&version=1.3.0&request=GetMap&CRS=CRS%3A84&LAYERS=Surface_Temperature&elevation=Layer&TRANSPARENT=true&FORMAT=image%2Fpng&SRS=EPSG";
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
        {singleTile: true, ratio: 1},
        {isBaseLayer: true},
    );
    map.addLayer(wms);
    
}

function majLayer(date){
    //var URL = "http://localhost:8080/thredds/wms/satellite/modis/MYD07/res009/MYD07_r009_d.nc?service=WMS&version=1.3.0&request=GetMap&CRS=CRS%3A84&LAYERS=Surface_Temperature&elevation=Layer&TRANSPARENT=true&FORMAT=image%2Fpng&SRS=EPSG";
    //var URL = "https://se5780me:erg54erg55@climdata.u-bourgogne.fr:8443/thredds/wms/satellite/modis/MYD07/res009/MYD07_r009_d.nc?service=WMS&version=1.3.0&request=GetMap&CRS=CRS%3A84&LAYERS=Surface_Temperature&elevation=Layer&TRANSPARENT=true&FORMAT=image%2Fpng&SRS=EPSG";
    //var URL = "https://climdata.u-bourgogne.fr:8443/thredds/wms/satellite/modis/MYD07/res009/MYD07_r009_d.nc?service=WMS&version=1.3.0&request=GetMap&CRS=CRS%3A84&LAYERS=Surface_Temperature&elevation=Layer&TRANSPARENT=true&FORMAT=image%2Fpng&SRS=EPSG";
    var URL = "http://localhost:8000/climdata.u-bourgogne.fr/teledm/proxywms/satellite/modis/MYD07/res009/MYD07_r009_d.nc?service=WMS&version=1.3.0&request=GetMap&CRS=CRS%3A84&LAYERS=Surface_Temperature&elevation=Layer&TRANSPARENT=true&FORMAT=image%2Fpng&SRS=EPSG";
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
        {
            tileOptions: {crossOriginKeyword: 'anonymous'},
            transitionEffect: null      
        },
        {singleTile: true, ratio: 1},
        {isBaseLayer: false},
    );
    map.addLayer(wms);        
}


function readCat(){
    //var URLCat = "https://climdata.u-bourgogne.fr:8443/thredds/satellite/modis/catalog.xml";
    //var URLCat = "http://localhost:8080/thredds/satellite/modis/catalog.xml";
    var URLCat = "http://localhost:8000/climdata.u-bourgogne.fr/teledm/proxyajax/re_analyse/ecmwf/era_interim/catalog.xml";
    alert(URLCat);
    var auth = 'Basic ' + "se5780me:erg54erg55";
    $.ajax( {
				type: "POST",
				url: URLCat,
				dataType: "json",
				async: false,
                beforeSend: function(xhr, settings) {
                    xhr.setRequestHeader("X-CSRFToken", $.cookie('csrftoken'));
                },
				success: function(json) {
					alert(json);
                    $("#cat").val(json.id1);
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



// info ponctuelle lat/lon/data
function getInfosMap(e){
    var lonLat = map.getLonLatFromViewPortPx(e.xy);  //latitude/longitude du clic
    if(map.layers[1].name !== 'wms'){ //si pas de layers wms
        var errorPopup = new OpenLayers.Popup (
            "error",
            lonLat,
            new OpenLayers.Size(100, 50),
            "Pas de couche sélectionnée",
            true, //ajout un bouton "fermer la fenetre"
            null  //action apres close
            );
        errorPopup.autoSize = true;
        map.addPopup(errorPopup);
    }else{
        if(map.maxExtent.containsLonLat(lonLat)){
            var tempPopup = new OpenLayers.Popup (
                "temp",
                lonLat,
                new OpenLayers.Size(100, 50),
                "Loading...",
                true, //ajout un bouton "fermer la fenetre"
                null  //action apres close
			);
            var lonlat = map.getLonLatFromViewPortPx(e.xy);
            //mise a jour date
            var URLRequest = "http://localhost:8000/climdata.u-bourgogne.fr/teledm/proxyncss/ncss/satellite/modis/MYD07/res009/MYD07_r009_d.nc?time_start=2006-07-06&time_end=2006-07-06&var=Surface_Temperature&elevation=Layer&latitude=25.6&longitude=10.266674804688&accept=xml";
            alert(URLRequest);
            $.ajax({
                type: "GET",
                url: URLRequest,
                dataType: "xml",
                async: false,
                success: function(xml) {
                    var lon = parseFloat($(xml).find('data[name="lon"]').text());
                    var lat = parseFloat($(xml).find('data[name="lat"]').text());
                    var val = parseFloat($(xml).find('data[name="Surface_Temperature"]').text());
                    var res = "";
                    if (lon){
                        // We have a successful result
                        var truncVal = val.toPrecision(3);
                        if(truncVal > 200)  //Kelvin -> Celsius
                        {
                            //truncVal-=273,15
                        }
                        res = "Lon: "+ lon.toFixed(6) + 
                              " </br>Lat: " + lat.toFixed(6) +
        				   " </br>Value: " + truncVal;
                    } 
                    else{
                        res = "Impossible d'obtenir les informations demandées";
                    }
                    //map.removePopup(tempPopup);   //supprime le popup temporaire
                    var popup = new OpenLayers.Popup(
                        "id",
                        lonlat,
                        new OpenLayers.Size(200, 75),
                        res,
                        true,
                        null
                    );
                    popup.AutoSize = true;
                    map.addPopup(popup);
                },
                error: function(e){
                    console.log('error');
                }
            });
        }
    }//fin else
}


var date = "2007-01-01";
window.onload = function(){
    initMap();
}