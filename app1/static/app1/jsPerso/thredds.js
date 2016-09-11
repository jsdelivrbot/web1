function main_map_init (map, options) {
    var info = {{ Info | safe }};
    var URLRequest = "http://localhost:8080/thredds/wms/"+ info.ncfile + "?item=minmax"+"&layers="+info.variable+"&elevation=0&time="+info.date+
                    "&srs=EPSG%3A4326&width=50&height=50&request=GetMetadata";
    alert(URLRequest);
    map.setView([20.0, 15.0], 4);
    wmsLayer = L.tileLayer.wms(info.URL,{
        layers: info.variable,
        time: info.date,
        format: 'image/png',
        version: '1.3.0',
        transparent: true,
        styles: 'boxfill/rainbow',
        colorscalerange: '0,3',
        numcolorbands: 256,
        tiled:true
    })
    wmsLayer.addTo(map);
    var dataurl2 = '{% url "data" %}';
    $.getJSON(dataurl2, function (data) {
     // Add GeoJSON layer
        L.geoJson(data, {
            onEachFeature: function(feature,layer){
                var popupText = "Station Name: " + feature.properties.station;
                layer.bindPopup(popupText);
            }            
        }).addTo(map);
    });
    var popup = L.popup();
    function onMapClick(e) {
        popup
            .setLatLng(e.latlng)
            .setContent(e.latlng.toString())
            .openOn(map);
    }
    
}