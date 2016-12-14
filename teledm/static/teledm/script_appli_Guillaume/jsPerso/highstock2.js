//racine de l'URL de la requete (nom du serveur TDS)
const ROOT = "http://localhost:8080/thredds/";

//objet contenant les informations choisies par l'utilisateur
var lstInfos = {
	dateStart:"",
	dateEnd:"",
	lat:"",
	lon:"",
	param:"",
	lstDataset:[dataset]
	};

//objet contenant les paramètres d'un dataset à afficher
var dataset = {
		nomDataset:"",
		header:"",
		unit :"",
		URLData:"",
		tabData:[],
		moyAn:[],
		moyDec:[],
		moyMois:[],
		anneeType:[]
	};
	
//Tableau avec comme indice le nom du parametre et contenant la liste des catalogues
var tabParams=[];
//Tableau avec le nom des catalogues
var tabCatalog=[];
//Arborescence des repertoires du serveur TDS
var tree;

//********************************INTERFACE******************************************//

//Recupère le nom et l'équivalence des paramètres
function showParams()
{
	var parametres=[];
	$.ajax({ 
    type: 'GET', 
    url: 'http://127.0.0.1/template/conf_catalog.json',
    data: { get_param: 'value' },
    async: false,
    dataType: 'json',
    success: function(data) 
    {
		$.each(data, function(idx,cat)		//pour tout les catalogues
		{
			var catParam=data[idx].nomCat;
			var tempTabParam=[];
			var dcParam=data[idx].dicoParam;	//selectionne le dictionnaire de paramètre
			for(var i=0; i<dcParam.length;i++)		//pour toute les entrées du dictonnaire
			{
			//paramNom
				var p = Object.keys(dcParam[i])[0];
				var paramNom = JSON.stringify(p);
				paramNom= paramNom.substring(1, paramNom.length-1);		//supprime les doubles quotes
			//paramRequete
				var pRequete = dcParam[i][paramNom];
				tempTabParam.push(paramNom);
				$("#listeParam").append("<li><input type='checkbox' name='"+pRequete+" 'value='"+paramNom+"' onClick='checkParamCat()'>"+paramNom+"</li>");
			}
			tabParams[catParam]=tempTabParam;		//ajout dans la liste de parametres globaux
		});
    }
	});
	$("#listeParam").append(parametres);
}


//Recupère la liste des catalogues et des datasets
//Créer un treeview qui liste les catalogues et les dataset présents sur le serveur
function getCatData()
{
	
	var tree = $('#listeCat').jstree({
		'plugins': ["checkbox", "state"],
		'core': {
			
		'check_callback': true
		},
		'checkbox':
			{
            three_state : true,
			}
	});
	
	
	//createNode("#jstree", "Cat", "Catalogue", "first");
	//createNode("#base_directory", "sub_2", "Sub 2", "last");
	
	$('#listeCat').on('ready.jstree', function (e, data) {

	//Fonction récursive, parse l'URL, si data ajoute dans tree, si catalogue ajoute dans tree+parse
	function parseRec(URL,cat)
	{	
		$.ajax( {
				type: "GET",
				url: URL,
				dataType: "xml",
				async: false,
				success: function(xml) {
				//si catalogue présent
				if($(xml).find('catalogRef')!=0)
				{
					$(xml).find('catalogRef').each( function(){
						titre= $(this).attr('xlink:title');
						var href= $(this).attr('xlink:href');
						tabCatalog.push(titre);
						href=href.replace("/thredds","");
						var URLCat = ROOT+href;				
						createNode(cat, titre, titre, "first");
						parseRec(URLCat,"#"+titre);
					})
				}
				//si dataset présent
				if($(xml).find('dataset')!=0)
				{
					$(xml).find('dataset').each( function(){
						var datasetName= $(this).attr('name');
						var urlDataset= $(this).attr('urlPath');
						createNode(cat, datasetName, datasetName, "last");
					})
				}
				}
			})
	};

        parseRec("http://127.0.0.1/template/conf.xml", "#listeCat");
		

    })
}

//JSTree - Fonction créer Node
function createNode(parent_node, new_node_id, new_node_text, position) {
	$('#listeCat').jstree(
		'create_node', 
		$(parent_node), 
		{ "text":new_node_text, "id":new_node_id }, 
		position, false, false);	
}


//Appelé par le onChange des checkbox de la liste de paramètres
//Désactive/active les catalogues lors de la séléction des paramètres
function checkParamCat()
{
	//parametres selectionnées
	var selectParam = [];
	$("#listeParam > li > input:checkbox:checked").each(function(){
		selectParam.push($(this).val());
	});
	
	//tout les catalogues selectionnables
	for(var j=0; j<tabCatalog.length;j++)
	{
		$("#listeCat").jstree('enable_checkbox', tabCatalog[j]);
		var childrenID=$("#listeCat").jstree('get_node',tabCatalog[j]).children;
		for(var k=0; k<childrenID.length; k++)
		{
			$("#listeCat").jstree('enable_checkbox', childrenID[k]);
		}
	}
	
	for(var i=0;i<selectParam.length; i++)	//pour tout les parametres séléctionnés //selectParam[i]
	{
		for(var j=0; j<tabCatalog.length;j++)		//pour tout les catalogues //tabCatalog[j]
		{
			//si le nom du parametre n'apparait pas dans le catalogue
			if(!(tabFind(tabParams[tabCatalog[j]],tabCatalog[j], selectParam[i])))
			{
				$("#listeCat").jstree('deselect_node', tabCatalog[j]);
				$("#listeCat").jstree('disable_checkbox', tabCatalog[j]);
				//selectionne les fils du noeud catalogue parent
				var childrenID=$("#listeCat").jstree('get_node',tabCatalog[j]).children;
				for(var k=0; k<childrenID.length; k++)  //pour tout les fils
				{
					$("#listeCat").jstree('deselect_node', childrenID[k]); //deselectionner checkbox
					$("#listeCat").jstree('disable_checkbox', childrenID[k]); //desactiver
				}		
			}
		}
	}
}

//Cherche dans un tableau si une variable apprait à l'endroit indiqué par l'index
function tabFind(tab, index, val)
{
	var res=false;
	for(i=0;i<tab.length;i++)
	{
		if(tab==val){res=true}
	};
	return res;
}


//Fonction progress bar
function loader()
{
		var cl = new CanvasLoader('loader-container');
		cl.setColor('#455a70'); // default is '#000000'
		cl.setShape('spiral'); // default is 'oval'
		cl.setDiameter(98); // default is 40
		cl.setDensity(22); // default is 40
		cl.setFPS(23); // default is 24
		cl.show(); // Hidden by default
		
		var loaderObj = document.getElementById("canvasLoader");
  		//loaderObj.style.position = "absolute";
  		loaderObj.style["top"] = cl.getDiameter() * -0.5 + "px";
  		loaderObj.style["left"] = cl.getDiameter() * -0.5 + "px";
}

//Fonction progress bar
function loading(progress)
{
  		$("#loader-progress").empty();
  		$("#loader-progress").append("Génération du graphique ...<br>");
  		$("#loader-progress").append("Progression : ", progress,"/",lstInfos.lstDataset.length);
}


//Affiche une alerte lorsqu'une exception est levée
function raiseAlert(title, text)
{
  $('#alert').addClass('in');
  $('#alert').show(500);
  
  $('#alert h4').html(title);
  $('#alert p').html(text);
}

$('.close').click(function () {
  $(this).parent().removeClass('in');
    $('#alert').hide(500);
});

//Affiche une alerte contenant les dataset non affichées
function raiseWarn(title, text)
{
  $('#warning').addClass('in');
  $('#warning').show(500);
  
  $('#warning h4').html(title);
  $('#warning p').html(text);
}

$('.close').click(function () {
  $(this).parent().removeClass('in');
    $('#warning').hide(500);
});



//********************************FORMULAIRE*****************************************//


//Recupère les informations que l'utilisateur a saisi
function getInfos()
{
	
	
		//vide objet info précédente
	lstInfos.dateStart="";
	lstInfos.dateEnd="";
	lstInfos.lat="";
	lstInfos.lon="";
	lstInfos.param="";
	lstInfos.lstDataset=[];
	
		//supprimer les séries du chart
	while($("#container").highcharts().series.length > 0)
    $("#container").highcharts().series[0].remove(true);
	
		//Latitude/Longitude :
	var lat= $("input[name='lat']").val();
	var lon= $("input[name='lon']").val();
	lstInfos.lat=lat;
	lstInfos.lon=lon;
	
		//Date Debut/Fin
	var timeStart= $("input[id='datepicker_start']").val();
	if(timeStart==''){
		raiseAlert("Erreur !", "Date  de départ invalide !");
		throw new Exception();
	}else{
		var dateJS = moment(new Date(timeStart));
		timeStart = dateJS.format('YYYY-MM-DD');
		timeStart+="T12%3A00%3A00Z";
		lstInfos.dateStart=timeStart;
	}
	
	var timeEnd= $("input[id='datepicker_end']").val();
	if(timeEnd==''){
		raiseAlert("Erreur !", "Date de fin invalide !");
		throw new Exception();
	}else{
		var dateJS = moment(new Date(timeEnd));
		timeEnd = dateJS.format('YYYY-MM-DD');
		timeEnd += "T12%3A00%3A00Z";
		lstInfos.dateEnd=timeEnd;
	}
	
		//Paramètres
	var selectedElmsVal = [];
	$("#listeParam > li> input:checkbox:checked").each(function(){	//pour chaque parametre séléctionné
		selectedElmsVal.push($(this).attr("name"));	//ajout du nom du parametre dans le tableau servant à la requete
	});
	lstInfos.param=selectedElmsVal[0];	//1er parametre pour la requete
	if(typeof lstInfos.param=='undefined'){  //si pas de parametre
		raiseAlert("Erreur !", "Pas de paramètres selectionnés !");
		throw new Exception();
	};

		//Datasets
	var selectedElmsIds = [];
	var selectedElms = $('#listeCat').jstree("get_selected", true);
	$.each(selectedElms, function() {
		if(($.inArray(this.id, tabCatalog))== -1)  //si pas le titre d'une catégorie
		{
			selectedElmsIds.push(this.id);
		}
	});
	
	lstInfos.lstDataset.pop();	//effacer les entrées précédentes
	
	for(var i=0; i<selectedElmsIds.length;i++)	//pour chaque dataset séléctionné
	{
		var objTemp = new Object();
		objTemp.nomDataset = selectedElmsIds[i];
		objTemp.header = '';
		objTemp.unit = '';
		objTemp.URLData = '';
		objTemp.tabData = [];
		lstInfos.lstDataset.push(objTemp);
	}
	
	if(typeof lstInfos.lstDataset[0]=='undefined'){  //si pas de dataset
		raiseAlert("Erreur !", "Pas de dataset selectionnés !");
		throw new Exception();
	};
}


//****************************TRAITEMENT*DE*LA*REQUETE*******************************//


//Création de l'URL
function creerURL()
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
		//pour tout les dataset selectionnés : générer l'URL à parser
		for(i=0; i<lstInfos.lstDataset.length; i++)
		{
			var URL = ROOT+"ncss/"+
			lstInfos.lstDataset[i].nomDataset+
			".nc?time_start="+
				lstInfos.dateStart+
			"&time_end="+
				lstInfos.dateEnd+
			"&var="+
				lstInfos.param+
			"&latitude="+
				lstInfos.lat+
			"&longitude="+
				lstInfos.lon+
			"&accept=csv"
			;
			$("#URL").append("<li>"+URL+"</li>");
			lstInfos.lstDataset[i].URLData = URL;
		}
$("#loader-container").show();

		parseCSV();
		$(document).ajaxStop(function () {
			ajSerie();
			$("#loader-container").hide();
      });
}

//Parser CSV
function parseCSV()
{
	var nbReq=0;
	loading(nbReq);
	//pour tout les dataset : parser le fichier que contient
	//l'URL de l'objet et extraire les données
	for(var l = 0; l<lstInfos.lstDataset.length ; l++)
	{
	(function(l)
	{
	$.ajax({
		  url: lstInfos.lstDataset[l].URLData,
		  cache: false,
		  async:true,
		  complete: function () {
    		      nbReq++;	//incrémenter le compteur de progression
			loading(nbReq);   //actualiser le message de chargement
		  },
		  success: function(data){
			// Split the lines
			var lines = data.split('\n');	
			
			// Iterate over the lines and add categories or series
			$.each(lines, function(lineNo, line) {
				var items = line.split(',');
				
				// header line containes categories
				if (lineNo != 0) {
				  //  $.each(items, function(itemNo, item) {
						//traitement date ISO
							var dateISO = items[0];
							dateISO = dateISO.replace(/\D/g," ");
							var dateCompo = dateISO.split(" ");
							dateCompo[1]--;
							var dateUTC = Date.UTC(dateCompo[0],dateCompo[1],dateCompo[2]);;
							
							var temp = [];
							temp.push(dateUTC,(parseFloat(items[3])));
							
							//si ligne pas vide
							if (items[3]!=undefined)
							{
								lstInfos.lstDataset[l].tabData.push(temp);
							}
				}
				//ligne 1 (line[0])
				else
				{
					lstInfos.lstDataset[l].header = items[3];
					lstInfos.lstDataset[l].header = lstInfos.lstDataset[l].header.substring(((lstInfos.param.length-1)+7), lstInfos.lstDataset[l].header.length-2);	//substring de param.length-1 + 7 à length-2
				}
			});	//each
		  },	//ajax success
		  error: function(res,statut,erreur){	//Si l'URL est invalide
			  lstInfos.lstDataset[l].tabData[0]="error";
		  }//erreur
		});	//ajax
	}	//function l
	)(l);
};
}


//********************************HIGHSTOCK*****************************************//

//Initialise un chart sans data
function initChart()
{
	//Création du chart dans le div #container
	$.get('http://127.0.0.1/maquette/CMIP5BCCPRHISTO20ans.csv', function(data) {
		$('#container').highcharts('StockChart', {
				chart: 
				{
					type: 'line',
					height: 500
				},
				credits: 
				{
					enabled: false
				},
				legend: {
					enabled: true,
				},
				rangeSelector : {
					selected : 1
				},
				 plotOptions: {
					series:
					{  
						pointInterval: 24*3600*1000
					},
				},        
				tooltip: {
					xDateFormat: '%d-%m-%Y'
				},
				xAxis: {
					type: 'datetime',
				},
				yAxis: {
					title: {
						text: 'yAxis'
					}
				},
                tooltip: 
                {
                    valueDecimals: 9
                },
                exporting: 
                {
					enabled: true
				}
			});
		})
}

//Ajoute la série au chart
function ajSerie()
{	
	if($("#container").highcharts().series.length !=0) //si chart non vide
	{
		while($("#container").highcharts().series.length > 0)
		$("#container").highcharts().series[0].remove(true);
	}
	var tabError=[];
	for (var i=0; i<lstInfos.lstDataset.length; i++)	//pour toutes les dataset séléctionnées
	{
		if(lstInfos.lstDataset[i].tabData[0]!="error")
		{
			$("#container").highcharts().addSeries	//ajout de la série
			(
				{
					name:lstInfos.lstDataset[i].nomDataset,
					data:lstInfos.lstDataset[i].tabData
				}
			);
		}else{
			tabError.push(lstInfos.lstDataset[i].nomDataset);
			lstInfos.lstDataset.splice(i,1);  //retire le dataset erronné de la liste
		}
	}	
	if(tabError.length!=0)
	{
		var msgError="";
		for(var j=0; j<tabError.length; j++)
		{
			msgError+="-"+tabError[j]+"</br>";
		}
		raiseWarn("Dataset indisponible","Impossible d'ajouter au graphique les dataset : </br>"+msgError);
	}
	
	if($("#container").highcharts().series.length !=0) //si chart non vide
	{		
		$("#container").highcharts().yAxis[0].axisTitle.attr({   //mettre à jour le parametres affiché sur le graphique
			text: lstInfos.param
		});	
	}
	$("#container").highcharts().redraw();	//mise a jour du chart
}


//*********************************CALCUL*******************************************//

//Calcul la moyenne par an
function moyenneAnnee()
{
	if(typeof lstInfos.lstDataset[0] == 'undefined')    //si pas de dataset
	{
		alert("Pas de dataset sélécionné !");
	}
	else
	{	
		//modification CSS bouton
		$("input[name='moyAn']").css("background-color", "#337ab7");
		$("input[name='moyAn']").css("color", "white");
		
		for(var j=0; j<lstInfos.lstDataset.length; j++)     //pour tout les dataset
		{
			if(typeof lstInfos.lstDataset[j].moyAn == 'undefined')   //si la moyenne n'a pas été calculé
			{
				lstInfos.lstDataset[j].moyAn=[];
				//1ere date du tableau Data
				var yearDep = (new Date(lstInfos.lstDataset[j].tabData[0][0]).getFullYear());
				var yearA=yearDep;
				var temData=[];
				//pour toutes les dates
				for(var i=0; i<lstInfos.lstDataset[j].tabData.length; i++)
				{
					var yearTemp=(new Date(lstInfos.lstDataset[j].tabData[i][0]).getFullYear());
					if(yearTemp==yearA)		//si année en cours de traitement
					{
						temData.push(lstInfos.lstDataset[j].tabData[i][1]);
					}
					else					//si plus de données avec date correspondante
					{
						var DyearA = Date.UTC(yearA,6,31);
						lstInfos.lstDataset[j].moyAn.push([DyearA,moy(temData)]);
						temData=[];
						yearA++;
					}
				};
				
				var uneVar = lstInfos.lstDataset[j].moyAn;
				var unNom = lstInfos.lstDataset[j].nomDataset+"(moyenne/an)";
				
				$("#container").highcharts().addSeries
				(
					{
						data:uneVar,
						name:unNom
					}
				);
				$("#container").highcharts().redraw();
			}
		}
	}
}

//Calcul la moyenne par décénie
function moyenneDecenie()
{
	if(typeof lstInfos.lstDataset[0] == 'undefined')    //si pas de dataset
	{
		alert("pas de dataset sélécionné");
	}
	else
	{
		//modification CSS bouton
		$("input[name='moyDec']").css("background-color", "#337ab7");
		$("input[name='moyDec']").css("color", "white");
		
		for(var j=0; j<lstInfos.lstDataset.length; j++)     //pour tout les dataset
		{
			if(typeof lstInfos.lstDataset[j].moyDec == 'undefined')   //si la moyenne n'a pas été calculé
			{
				for(var j=0; j<lstInfos.lstDataset.length; j++)
				{
				lstInfos.lstDataset[j].moyDec=[];
				//1ere date du tableau Data
				var yearDep = (new Date(lstInfos.lstDataset[j].tabData[0][0]).getFullYear());
				var yearA=yearDep;
				var temData=[];
				//pour toutes les dates
					for(var i=0; i<lstInfos.lstDataset[j].tabData.length; i++)
					{
						var yearTemp=(new Date(lstInfos.lstDataset[j].tabData[i][0]).getFullYear());
						if((yearTemp<=yearA) || (yearTemp>=(yearA+10)))		//si année en cours de traitement
						{
							temData.push(lstInfos.lstDataset[j].tabData[i][1]);
						}
						else					//si plus de données avec date correspondante
						{
							var DyearA = Date.UTC(yearA,6,1);
							lstInfos.lstDataset[j].moyDec.push([DyearA,moy(temData)]);
							temData=[];
							yearA=yearA+10;
						}
					}
					var uneVar = lstInfos.lstDataset[j].moyDec;
					var unNom = lstInfos.lstDataset[j].nomDataset+"(moyenne/déc)";
					
					$("#container").highcharts().addSeries
					(
						{
							data:uneVar,
							name:unNom
						}
					);
					$("#container").highcharts().redraw();
				}
			}
		}
	}
}

//Calcul la moyenne par mois
function moyenneMois()
{
	if(typeof lstInfos.lstDataset[0] == 'undefined')    //si pas de dataset
	{
		alert("Pas de dataset sélécionné !");
	}
	else
	{
		//modification CSS bouton
		$("input[name='moyMois']").css("background-color", "#337ab7");
		$("input[name='moyMois']").css("color", "white");
		
		for(var j=0; j<lstInfos.lstDataset.length; j++)     //pour tout les dataset
		{
			if(typeof lstInfos.lstDataset[j].moyMois == 'undefined')   //si la moyenne n'a pas été calculé
			{
				for(var j=0; j<lstInfos.lstDataset.length; j++)
				{
				lstInfos.lstDataset[j].moyMois=[];
				//1ere date du tableau Data
				var dateDep = (new Date(lstInfos.lstDataset[j].tabData[0][0]));
				var yearDep = dateDep.getFullYear();
				var moisDep = dateDep.getMonth();
				var moisA=moisDep;
				var temData=[];
				//pour toutes les dates
				for(var i=0; i<lstInfos.lstDataset[j].tabData.length; i++)
				{
					var moisTemp=(new Date(lstInfos.lstDataset[j].tabData[i][0]).getMonth());
					if(moisTemp==moisA)		//si mois en cours de traitement
					{
						temData.push(lstInfos.lstDataset[j].tabData[i][1]);		//ajouter au tableau du mois actuel
					}
					else					//si plus de données avec date correspondante
						{
						var anneeTemp = (new Date(lstInfos.lstDataset[j].tabData[i][0]).getFullYear());	//recup l'année de la date parsé
						if(moisA==11)
						{anneeTemp--};
						var DmoisA = Date.UTC(anneeTemp, moisA, 15);
						lstInfos.lstDataset[j].moyMois.push([DmoisA,moy(temData)]);
						temData=[];
						if(moisA==11){moisA=0}else{moisA++};	
					}
				}
					
					var uneVar = lstInfos.lstDataset[j].moyMois;
					var unNom = lstInfos.lstDataset[j].nomDataset+"(moyenne/mois)";
					
					$("#container").highcharts().addSeries
					(
						{
							data:uneVar,
							name:unNom
						}
					);
					$("#container").highcharts().redraw();
				}
			}
		}
	}
}

//Calcul l'année type
function anneeType()
{
		if(typeof lstInfos.lstDataset[0] == 'undefined')    //si pas de dataset
	{
		alert("Pas de dataset sélécionné !");
	}
	else
	{
		//modification CSS bouton
		$("input[name='anType']").css("background-color", "#337ab7");
		$("input[name='anType']").css("color", "white");
		
		for(var j=0; j<lstInfos.lstDataset.length; j++)     //pour tout les dataset
		{
			if(typeof lstInfos.lstDataset[j].anneeType == 'undefined')   //si la moyenne n'a pas été calculé
			{
				if((lstInfos.dateEnd.getFullYear - lstInfos.dateStart.getFullYear==0))
				{
					//Pas une année entière
					alert("La quantité de données n'est pas suffisante (pas une année entière)");
				}
				
				//pour tout les dataset
				for(var j=0; j<lstInfos.lstDataset.length; j++)
				{
					lstInfos.lstDataset[j].anneeType=[];
					//1ere date du tableau Data
					var yearDep = (new Date(lstInfos.lstDataset[j].tabData[0][0]).getFullYear());
					var lengthTab = lstInfos.lstDataset[j].tabData.length-1;
					var yearFin = (new Date(lstInfos.lstDataset[j].tabData[lengthTab][0]).getFullYear());
					var temData=[]; //tab temporaire anneeType
					var tab0=[], tab1=[], tab2=[], tab3=[], tab4=[], tab5=[], tab6=[], tab7=[], tab8=[], tab9=[], tab10=[], tab11 = []; //stock les valeurs triées par mois
					//pour toutes les dates
					//ajouter data dans tab trié par mois
					for(var i=0; i<lstInfos.lstDataset[j].tabData.length; i++)
					{
						var moisTemp=(new Date(lstInfos.lstDataset[j].tabData[i][0]).getMonth());
						var tp = 'tab'+moisTemp;
						eval(tp).push(lstInfos.lstDataset[j].tabData[i][1]);
					}
					//génération des dates avec moy de l'année type
					for(var l=0; l<yearFin-yearDep; l++)
					{
						for(var m=0; m<11; m++)
						{
							var tabAct = eval('tab'+m);
							var dateTp = Date.UTC((yearDep+l), m, 15);
							lstInfos.lstDataset[j].anneeType.push([dateTp,moy(tabAct)]);
						}
					}
					var uneVar = lstInfos.lstDataset[j].anneeType;
					var unNom = lstInfos.lstDataset[j].nomDataset+"(année type)";
						
					$("#container").highcharts().addSeries
					(
						{
							data:uneVar,
							name:unNom
						}
					);
					$("#container").highcharts().redraw();
				}
			}
		}
	}
}

//Simple fonction retournant la moyenne d'un tableau passé en paramètre
function moy(tab)
{
	var n = tab.length;
	var somme = 0;
	for(i=0; i<n; i++)somme += tab[i];
	return somme/n;
}


//**********************************MAIN*******************************************//

getCatData();
showParams();
setTimeout(function()
{
	initChart();
},1000);
$("#loader-container").hide();
loader();
$('#datepicker_start').datepicker();
$('#datepicker_end').datepicker();
$('#alert').hide();
$('#warning').hide();


//Genère le chart
function createChart()
{
    creerURL();
}
