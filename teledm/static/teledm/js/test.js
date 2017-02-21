

$.ajax({
    type: "GET",
    url: "https://localhost:8443/thredds/wms/satellite/modis/MYD04/res025/MYD04_r025_d.nc?service=WMS&version=1.3.0&request=GetCapabilities",
    dataType: "xml",
    async: false,
    success: function(xml) {
        console.log('ok');
    },
    error : function(xhr,errmsg,err) {
        console.log('erreur: '+errmsg);
        console.log(xhr.status + ": " + xhr.responseText); // provide a bit more info about the error to the console
    }
});