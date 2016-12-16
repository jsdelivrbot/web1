const ROOT = "http://localhost:8080/thredds";


var tabCatalog=[];

function getCatData()
{
	var tree = $('#listeCat').jstree({
		'plugins': ["state"],   //Permet de selectionner le noeud
		'core': 
		{
			'check_callback': true
		}
	});
	$('#listeCat').on('ready.jstree', function (e, data) {  //quand le JSTree est chargé

	//Fonction récursive, parse l'URL
	//-Si data ajoute dans tree
	//-Si catalogue ajoute dans tree + parse le catalogue
	function parseRec(URL,cat)
	{
		$.ajax( {
				type: "GET",
				url: URL,
				dataType: "xml",
				async: false,
				success: function(xml) {
        				if($(xml).find('catalogRef')!=0)  //Si catalogue(s) présent
        				{
        					$(xml).find('catalogRef').each( function(){  //Pour tout les catalogues
        						titre= $(this).attr('xlink:title');   //Titre du catalogue
        						var href= $(this).attr('xlink:href');   //Lien du catalogue
        						tabCatalog.push(titre);  //Ajout du catalogue dans le tableau global
        						href=href.replace("thredds","");  //Modification du string servant de lien
        						var URLCat = ROOT+ '/' + $(this).attr('ID') + '/catalog.xml';   //Création de l'URL du catalogue
        						createNode(cat, titre, titre, "first");  //Création du noeud dans le tree
        						$("#listeCat").jstree('disable_node', titre);
        						parseRec(URLCat,"#"+titre);  //Parse le catalogue
        					})
        				}
        				if($(xml).find('dataset')!=0)   //Si data(s) présente(s)
        				{
        					$(xml).find('dataset').each( function(){  //Pour toutes les datas
        						var datasetName= $(this).attr('name');  //Nom du dataset
        						var urlDataset= $(this).attr('urlPath');  //URL du dataset
        						createNode(cat, datasetName, datasetName, "last");  //Création du noeud
        					}) //Fin each
        				}//Fin if
				}//Fin success AJAX
			})//Fin AJAX
	};//Fin fonction récursive

    //Execution de la méthode récursive sur le catalogue du TDS avec id du JSTree en argument
    parseRec(urlCat + "conf.xml", "#listeCat");

    //Evenement onChange -> Affiche les parametres du catalogue dans la liste déroulante
	$('#listeCat')
	.on('changed.jstree', function (e, data) {
		var i, j, r = [];
		for(i = 0, j = data.selected.length; i < j; i++) {
			r.push(data.instance.get_node(data.selected[i]).text);
		}
		try
		{
			//getCapCat(r);
		}
		catch(err)
		{
			console.log(err);
		}
	  })
	  // create the instance
	  .jstree();
    });
}


//JSTree - Fonction créer Node
function createNode(parent_node, new_node_id, new_node_text, position) {
	$('#listeCat').jstree(
		'create_node', 
		$(parent_node), 
		{ "text":new_node_text, "id":new_node_id }, 
		position, false, false);	
}


function initMap(){
    var extent = ol.proj.transformExtent([-126, 24, -66, 50], 'EPSG:4326', 'EPSG:3857');
    var urlWMS = "http://localhost:8080/thredds/wms/satellite/modis/MYD07/res009/MYD07_r009_d.nc?service=WMS&version=1.3.0&request=GetMap";
    //var urlWMS = 'https://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r-t.cgi';
    var map = new ol.Map({
        target: 'map',
        layers: [
            new ol.layer.Tile({
                source: new ol.source.Stamen({
                    layer: 'terrain'
                })
            }),
        ],
        view: new ol.View({
          center: ol.proj.fromLonLat([0,0]),
          zoom: 1.5
        })
    });
    layer = new ol.layer.Vector({
                source: new ol.source.Vector({
                            url: urlShp + '/benin_district_sante.geojson',
                            format: new ol.format.GeoJSON()
                        })
    });
    //map.addLayer(layer);
    var stations = new ol.layer.Vector({
                source: new ol.source.Vector({
                            url: urlShp + '/stations.geojson',
                            format: new ol.format.GeoJSON()
                        })
    });
    var wms = new ol.layer.Tile({
        //extent: extent,
        source: new ol.source.TileWMS(/** @type {olx.source.TileWMSOptions} */ ({
        url: urlWMS, //"http://localhost:8080/thredds/wms/satellite/modis/MYD07/res009/MYD07_r009_d.nc?service=WMS&version=1.3.0&request=GetMap", //'https://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r-t.cgi',
        params: {'LAYERS': 'Surface_Temperature'}
        }))
    });
    map.addLayer(wms);
    map.addLayer(layer);
    map.addLayer(stations);
    
}


getCatData();
window.onload = function(){
    $('select').select2();
    initMap();
}