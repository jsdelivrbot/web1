//Variables globales composant la carte
var map;
var fond;
var mapPanel;

//Racine de l'URL de la requete (nom du serveur TDS)
const ROOT = "http://localhost:8080/thredds/";

//Objet contenant les informations choisies par l'utilisateur
var lstInfos = {
	date:"",
	param:"",
	unite:"",
	nomDataset:"",
	colorbar:"",
	scaleMin:"",
	scaleMax:"",
	bbox:'',
	colorbarBand:'',
	opacity:''
	};
	
//Tableau des catalogues disponibles
var tabCatalog=[];
var ncfile = "MYD07_r009_d.nc";
var variable = "Surface_Temperature";
var timedate = "2007-01-15T00:00:00";
var dataurl = "http://localhost:8080/thredds/wms/satellite/modis/MYD07/res009/"+ncfile+"?service=ncWMS"
function initMap()
{
    
	map = new OpenLayers.Map('map',
		{
			projection: new OpenLayers.Projection("EPSG:4326"),
			resolutions: [0.03, 0.05,0.09, 0.15, 0.4]
		}
	);
	fond = new OpenLayers.Layer.WMS(
		"OpenLayers WMS",
		"http://vmap0.tiles.osgeo.org/wms/vmap0",
        {
			layers: 'basic',
		},
		{isBaseLayer: true}
	);
	
	map.addLayer(fond);
	
	map.zoomToMaxExtent();
     layer = new OpenLayers.Layer.WMS(
		"Layer Test",
		"http://localhost:8080/thredds/wms/satellite/modis/MYD07/res009/MYD07_r009_d.nc?service=ncWMS",
		{
			layers: variable,
			transparent: "true",
			format: "image/png",
			styles: "boxfill/rainbow",
			colorscalerange: '265,340',
			time:"2007-01-15T00:00:00",
			numcolorbands : 10,
			opacity : 100,
                 tiled:true
			},
		{isBaseLayer: false}
	);	
	map.addLayer(layer);
	
	
}

window.onload = function()
{
    initMap();
}