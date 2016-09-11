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

//*********************************INTERFACE****************************************//

//Recupère la liste des catalogues et des datasets
//Créer un treeview qui liste les catalogues et les dataset présents sur le serveur
function getCatData()
{
	var tree = $('#listeCatMap').jstree({
		'plugins': ["state"],   //Permet de selectionner le noeud
		'core': 
		{
			'check_callback': true
		}
	});
	$('#listeCatMap').on('ready.jstree', function (e, data) {  //quand le JSTree est chargé

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
        						href=href.replace("/thredds/","");  //Modification du string servant de lien
        						var URLCat = ROOT+href;   //Création de l'URL du catalogue
        						createNode(cat, titre, titre, "first");  //Création du noeud dans le tree
        						$("#listeCatMap").jstree('disable_node', titre);
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
    parseRec("/home/sebastien/dev/web1/app1/static/app1/CatalogTeleDM.xml", "#listeCatMap");


    //Evenement onChange -> Affiche les parametres du catalogue dans la liste déroulante
	$('#listeCatMap')
	.on('changed.jstree', function (e, data) {
		var i, j, r = [];
		for(i = 0, j = data.selected.length; i < j; i++) {
			r.push(data.instance.get_node(data.selected[i]).text);
		}
		try
		{
			getCapCat(r);
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
	$('#listeCatMap').jstree(
		'create_node', 
		$(parent_node), 
		{ "text":new_node_text, "id":new_node_id }, 
		position, false, false);	
}


//Génère un scale auto avec le min et le max value
function autoScale()
{
	getInfos();
	var URLRequest = 
		ROOT+
	"wms/"+
		lstInfos.nomDataset+
	".nc?item=minmax"+
	"&layers="+
		lstInfos.param+
	"&bbox="+encodeURIComponent(lstInfos.bbox)+"&elevation=0&time="
	+lstInfos.date+
	"&srs=EPSG%3A4326&width=50&height=50&request=GetMetadata";
	$.ajax({
		type: "GET",
		url: URLRequest,
		dataType: "JSON",
		async: true,
		success: function(json) 
		{
			$("input[name='scaleMin']").val(json.min);
			$("input[name='scaleMax']").val(json.max);
			if(((lstInfos.param=='tasmin')||(lstInfos.param=='tasmax'))&&(json.min>200))
			{
				lstInfos.unit="K";
			};
		}
	});	
}

//Initialise la colorbar
function setColorbar()
{
	var nomColorbar = $("#Colorbar").val();
	var nbColorband = $("select[name='colorbandNum']").val();
	var img = "<img height='400px' width='50px' src="+ROOT+"'wms/CMIP5_IPSL-CM5A-LR_TASMAX_HISTO.nc?REQUEST=GetLegendGraphic&LAYER=tasmax&NUMCOLORBANDS="+nbColorband+"&PALETTE="+nomColorbar+"&COLORBARONLY=true'/>";
	$("#colorbar").html(img);
	
	if(typeof map.layers[1] !=='undefined')    //si il existe déja un layer
    {   
	map.layers[1].params.STYLES = "boxfill/"+nomColorbar;         //modifier la colorbar
	map.layers[1].redraw(true);
	}
}

//Gere les valeurs min et max de la colorbar présente sur la carte
function setMinMax()
{
	if(lstInfos.unit=='K')
	{
		lstInfos.scaleMin -=272,15;
		lstInfos.scaleMax -=272,15;
	}
	var min = parseFloat(lstInfos.scaleMin);
	var max = parseFloat(lstInfos.scaleMax);
	var smid = (min + max) /2;
	var smidmax = (max+smid)/2;
	var smidmin = (min+smid)/2;
	
	if(lstInfos.param=='pr')
	{
		//Extremes
		$("#smin").html(parseFloat(lstInfos.scaleMin).toExponential());	
		$("#smax").html(parseFloat(lstInfos.scaleMax).toExponential());	
		//Tiers
		$("#smidmax").html(parseFloat(smidmax).toExponential());	
		$("#smidmin").html(parseFloat(smidmin).toExponential());	
		//Milieu
		$("#smid").html(parseFloat(smid).toExponential());	
	}else{
		//Extremes
		$("#smin").html(lstInfos.scaleMin.toPrecision(3));	
		$("#smax").html(lstInfos.scaleMax.toPrecision(3));	
		//Tiers
		$("#smidmax").html(smidmax.toPrecision(3));	
		$("#smidmin").html(smidmin.toPrecision(3));	
		//Milieu
		$("#smid").html(smid.toPrecision(3));	
	}
}


//*********************************FORMULAIRE***************************************//


//Recupère les informations que l'utilisateur a saisi
function getInfos()
{
		//vide objet info précédente
	lstInfos.date="";
	lstInfos.param="";
	lstInfos.nomDataset="";
	lstInfos.colorbar="";
	lstInfos.scaleMin="";
	lstInfos.scaleMax="";
	lstInfos.colorbarBand='';
	lstInfos.opacity='';
	lstInfos.unite='';
	
		//Datasets
	var selectedElms = $('#listeCatMap').jstree("get_selected", true);
	if(selectedElms=='')
	{
		
		raiseAlert("Erreur !", "Aucun dataset sélectionné !");
		throw new Exception();
	}
	else
	{
		lstInfos.nomDataset = selectedElms[0].id;
	}
	
		//ScaleMin/ScaleMax :
	var scaleMinForm= $("input[name='scaleMin']").val();
	var scaleMaxForm= $("input[name='scaleMax']").val();
	lstInfos.scaleMin=scaleMinForm;
	lstInfos.scaleMax=scaleMaxForm;
	
		//Date
	var dateForm= $("input[name='date']").val();
	if(dateForm=='')
	{
		raiseAlert("Erreur !", "Aucune date saisie !");
		throw new Exception();
	}
	else
	{
		lstInfos.date=dateForm;
	}
	
		//ColorBar
	var colorbarForm = $("#Colorbar option:selected").text();
	lstInfos.colorbar = colorbarForm;
		//Colorband
	var colorbarBand = $("select[name='colorbandNum']").val();
	lstInfos.colorbarBand = colorbarBand;
	
		//Opacité
	var opacite = $("select[name='opacity']").val();
	lstInfos.opacity = opacite;
	
		//Paramètres
	var paramForm = $("#layerSelector option:selected").text();
	if(lstInfos.paramForm==''){
		raiseAlert("Erreur !", "Aucun paramètre selectionné !");
		throw new Exception();
	};
	lstInfos.param = paramForm;
}


//***********************************CARTE******************************************//


//Initialise la Map
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
	map.events.register('click', map, getInfosMap);
	
	
}

//Partie apparence
function setOpacity()
{
	var opacity = $("select[name='opacity']").val()/100;
	if(opacity<0 || opacity>100)
	{
		console.log("Opacité non valide");
	}
	else
	{
		if(typeof map.layers[1] !=='undefined')  //Si layer affiché
		{
			map.layers[1].setOpacity(opacity);
		}
	}
}

function setColorband()
{
	var nomColorbar = $("#Colorbar").val();
	var nbColorband = $("select[name='colorbandNum']").val();
	var img = "<img height='400px' width='50px' src="+ROOT+"'wms/CMIP5_IPSL-CM5A-LR_TASMAX_HISTO.nc?REQUEST=GetLegendGraphic&LAYER=tasmax&NUMCOLORBANDS="+nbColorband+"&PALETTE="+nomColorbar+"&COLORBARONLY=true'/>";
	$("#colorbar").html(img);
	if(typeof map.layers[1] !=='undefined')    //si il existe déja un layer
    {   
	map.layers[1].params.NUMCOLORBANDS = nbColorband;
	map.layers[1].redraw(true);   //actualise la map
	}	
}


//******************************TRAITEMENT****************************************//


function majLayer()
{
	//Récupère les infos saisies par l'utilisateur
	try
	{
	getInfos();
	}
	catch(e)
	{
		return null;
	}
	setDescLayer();  //mise a jour description du layer
	//pour tout les dataset selectionnés : générer l'URL à parser
	var URL = ROOT+ "wms/"+
		lstInfos.nomDataset+
	".nc?service=WMS&"+
	"version=1.3.0"+
	"&request=GetMap&CRS="+encodeURIComponent("CRS:84")+
	"&LAYERS="+
		lstInfos.param+
	"&TRANSPARENT=true&FORMAT=image%2Fpng"+
	"&SRS=EPSG";
       
       csr = lstInfos.scaleMin+","+lstInfos.scaleMax;
       style = "boxfill/"+lstInfos.colorbar;
    
    if(typeof map.layers[1] !=='undefined')    //si il existe déja un layer
    {   
	map.removeLayer(map.layers[1]);         //supprimer ce layer
	}
	  
    var layer = new OpenLayers.Layer.WMS(
		"Layer Test",
		URL,
		{
			layers: lstInfos.param,
			transparent: "true",
			format: "image/png",
			styles: style,
			colorscalerange: csr,
			time:lstInfos.date,
			numcolorbands : $("select[name='colorbandNum']").val(),
			opacity : lstInfos.opacity
			},
		{isBaseLayer: false}
	);	
	map.addLayer(layer);

	setMinMax(); //met a jour les valeurs min max du colorbar présent sur la carte
}


//Indique la 1ere/derniere date du dataset ainsi que sa périodicité
//Exception si pas de dataset ou indisponible
function setDateInfos()
{
	//Dataset
	lstInfos.nomDataset="";
	var selectedElms = $('#listeCatMap').jstree("get_selected", true);
	lstInfos.nomDataset = selectedElms[0].id;
	
	wms = new OpenLayers.Format.WMSCapabilities();
	var URLRequest = 
		ROOT+
	"wms/"+
		lstInfos.nomDataset+
	".nc?service=WMS&version=1.3.0&request=GetCapabilities";

	//urlRequest = ".nc?service=WMS&version=1.3.0&request=GetCapabilities";
	//urlRequest = "https://192.168.119.113:8443/thredds/wms/CMIP5_IPSL-CM5A-LR_PR_RCP26.nc?service=WMS&version=1.3.0&request=GetCapabilities";
	OpenLayers.Request.GET({
		url:URLRequest,
		async:false,
		success: function(xml){
			var xmlData = xml.responseText;
			var dimension = $(xmlData).find("Dimension").text().trim();
			var res = dimension.split("/");
			if($("input[name='date']").val()=="")
			{
				$("input[name='date']").val(res[0]);
			}
			$("#dateD").html(res[0]);
			$("#dateF").html(res[1]);
			
			var period = res[2];
			switch(period)
			{
				case "P1D":
					;
					break;
					
				default:
					text="Periodicité inconnu:" + res[2];
			}
			$("#period").html(res[2]);
		},
		error : function(e)
		{
			console.log("ERREUR DANS LA REQUETE");
		}
		});	
}

function setDescLayer()
{
	var div = $("#descLayer");   //div contenant les infos du layer
	div.html(lstInfos.nomDataset +" - "+lstInfos.param);
}


//********************************ANIMATION**************************************//


function nextDate()
{
	//forumlaire
	var period = $("select[name='usrPeriod']").val();
	var dateA = $("input[name='date']").val();
	//moment js
	var dateAM = moment.utc(dateA);
	var periodM = moment.duration(period);
	//affichage
	var res = moment(dateAM).add(periodM);
	res = res.toISOString();
	$("input[name='date']").val(res);
	if(typeof map.layers[1] =='undefined') //si pas de layer
	{
		majLayer();
	}
	else
	{
		map.layers[1].mergeNewParams({"TIME" : $("input[name='date']").val()})
	}
}

var requestID;   //ID de la requete d'animation
var fps = 1;
var running = true;  //variable d'execution

function setFPS()
{
	fps=$("select[name='vitesse'] option:selected").text();
}

function animation()
{
	if(running)   //si pas d'appui sur le bouton stop
	{
		setTimeout(function(){
		nextDate();
		requestID = requestAnimationFrame(animation);
		},1000/fps);
	}
	else
	{
		running = true   //reset de la variable d'execution
	}
}

//Event listener
var bodyElement = document.querySelector("input[name='stop']");
bodyElement.addEventListener("click", stopAnim, false);

function stopAnim(e)
{
	cancelAnimationFrame(requestID);
	running = false;
}

//Fonction de parsage
//Renvoie le 1er element du noeud donné
function getElementValue(xml, elName)
{
    var el = xml.getElementsByTagName(elName);
    if (!el || !el[0] || !el[0].firstChild) return null;
    return el[0].firstChild.nodeValue;
}


function getInfosMap(e)
{
	var lonLat = map.getLonLatFromViewPortPx(e.xy);  //latitude/longitude du clic
	if(typeof map.layers[1] =='undefined')  //si pas de layers
	{
		var errorPopup = new OpenLayers.Popup (
						"error",
						lonLat,
						new OpenLayers.Size(100, 50),
						"Pas de layers séléctionné",
						true, //ajout un bouton "fermer la fenetre"
						null  //action apres close
						);
		errorPopup.autoSize = true;
		map.addPopup(errorPopup);
	}
	else
	{
		if(map.maxExtent.containsLonLat(lonLat))
		{
			var tempPopup = new OpenLayers.Popup (
				"temp",
				lonLat,
				new OpenLayers.Size(100, 50),
				"Loading...",
				true, //ajout un bouton "fermer la fenetre"
				null  //action apres close
			);
			tempPopup.autoSize = true;
			map.addPopup(tempPopup);
			
			var lonlat = map.getLonLatFromViewPortPx(e.xy);
			
			//mise a jour date
			var dateForm= $("input[name='date']").val();
			lstInfos.date=dateForm;	

			var URLRequest = 
			ROOT+"wms/"
			+lstInfos.nomDataset+".nc?"
			+ "LAYERS="+ lstInfos.param
			+ "&TIME=" + encodeURIComponent(lstInfos.date)
			+ "&SRS=EPSG%3A4326"
			+ "&CRS=EPSG%3A4326"
			+ "&REQUEST=GetFeatureInfo"
			+ "&SERVICE=WMS"
			+ "&VERSION=1.1.1"
			+ "&BBOX=" + map.getExtent().toBBOX()
			+ "&X=" + e.xy.x
			+ "&Y=" + e.xy.y
			+ "&INFO_FORMAT=text%2Fxml"
			+ "&QUERY_LAYERS="+ lstInfos.param
			+ "&STYLES="
			+ "&WIDTH=" + map.size.w
			+ "&HEIGHT=" + map.size.h
			;
			OpenLayers.Request.GET({
				url:URLRequest,
				async:false,
				success: function(xml)
				{
					var xmldoc = xml.responseXML;
					var lon = parseFloat(getElementValue(xmldoc, 'longitude'));
					var lat = parseFloat(getElementValue(xmldoc, 'latitude'));
					var iIndex = parseInt(getElementValue(xmldoc, 'iIndex'));
					var jIndex = parseInt(getElementValue(xmldoc, 'jIndex'));
					var gridCentreLon = parseFloat(getElementValue(xmldoc, 'gridCentreLon'));
					var gridCentreLat = parseFloat(getElementValue(xmldoc, 'gridCentreLat'));
					var val = parseFloat(getElementValue(xmldoc, 'value'));
					var res = "";
					if (lon) 
					{
						// We have a successful result
						var truncVal = val.toPrecision(3);
						if(truncVal > 200)  //Kelvin -> Celsius
						{
							truncVal-=273,15
						}
						res = "Lon: "+ lon.toFixed(6) + 
						" </br>Lat: " + lat.toFixed(6) +
						" </br>Value: " + truncVal;
						console.log(e.xy);
					} 
					else 
					{
						res = "Impossible d'obtenir les informations demandées";
					}
					map.removePopup(tempPopup);   //supprime le popup temporaire
					var popup = new OpenLayers.Popup (
						"id", // TODO: does this need to be unique?
						lonLat,
						new OpenLayers.Size(100, 50),
						res,
						true, //bouton fermer
						null  //action additionnel du bouton fermer
					);
					popup.autoSize = true;
					map.addPopup(popup);
				},
				error: function(e)
				{
					console.log("error");
				}
			});
		}
	}//fin else
}


//**********************************MAIN*****************************************//

window.onload = function()
{
    alert("ok");
    getCatData();
    initMap();    
    setColorbar();
    $('#alert').hide();
}

$('.close').click(function () {
  $(this).parent().removeClass('in');
    $('#alert').hide(500);
});

//Récupère les informations du formulaire et mets à jour la carte
function updateMap()
{
	majLayer();
}


function getCapCat(catalog)
{
	//vider la date du formulaire
	$("#datePicker").val('');
	
	var urlRequest = ROOT+"wms/"+catalog+".nc?service=WMS&version=1.0.0&request=GetCapabilities";
	var jqxhr = $.ajax(urlRequest)
    .fail(function() 
    {
		raiseAlert("Catalogue inaccessible","Le catalogue demandé est inaccessible");
		return null;
	})
    .done(function() 
    {
	wms = new OpenLayers.Format.WMSCapabilities();
	
		OpenLayers.Request.GET({
			url:urlRequest,
			async:false,
			success: function(e){
				var response = wms.read(e.responseText);
				var capability = response.capability;
				$('#layerSelector')   //vider le résultat de la requete précédente
					.find('option')
					.remove()
					.end();
				for (var i=0, len=capability.layers.length; i<len; i+=1)
				{ 
					var layerObj = capability.layers[i]; 
					$("#layerSelector").append("<option value='"+layerObj.name+"'>"+layerObj.name+"</option>");
					
					lstInfos.bbox=layerObj.llbbox;
					
				}
				setDateInfos();   //met a jour les informations temporelles (dates debut, fin et période)
				autoScale();   //met a jour les valeurs scalemin et scalemax
			},
			error : function(e)
			{
				throw new ServletException(e);
				console.log("BUG");
				$('#layerSelector')   //vider le résultat et afficher "pas de layer dispo"
					.find('option')
					.remove()
					.end()
					.append('<option value="null">Aucun Layer dispo</option>')
				;
			}
			});	
	});

}


function raiseAlert(title, text)
{
  $('#alert').addClass('in');
  $('#alert').show(500);
  
  $('#alert h4').html(title);
  $('#alert p').html(text);
}


//Notes

//$('#titre').append(map.layers[1].name);
//palettes = map.layers[1].palette;
/*
			var lat = $("input[name='lat']").val();
			var lon = $("input[name='lon']").val();
			map.setCenter(new OpenLayers.LonLat(lon,lat),5);
*/
