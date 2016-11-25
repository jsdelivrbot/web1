const ROOT = "http://localhost:8080/thredds";


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

var tabCatalog = []
var lstInfos = {
    date:"",
    param:"",
    unit:"",
    nomDataset:"",
    capteur:"",
    produit:"",
    resspatiale:"",
    restempo:"",
    layer:"",
    nomFichier:"",
    bbox:"",
    colorbar:"",
    scaleMin:"",
    scaleMax:"",
    bbox:'',
    colorbarBand:'',
    opacity:''
};



function readCat(){
    var URLCat = ROOT + "/catalog.xml";
    $.ajax( {
				type: "GET",
				url: URLCat,
				dataType: "xml",
				async: false,
				success: function(xml) {
        				if($(xml).find('catalogRef')!=0)  //Si catalogue(s) présent
        				{
        					$(xml).find('catalogRef').each( function(){  //Pour tout les catalogues
        						titre= $(this).attr('xlink:title');   //Titre du catalogue
        						var href= $(this).attr('xlink:href');   //Lien du catalogue
        						href=href.replace("/thredds/catalog","");  //Modification du string servant de lien
        						tabCatalog.push(ROOT + href);   //Création de l'URL du catalogue
        						//createNode(cat, titre, titre, "first");  //Création du noeud dans le tree
        						//$("#listeCatMap").jstree('disable_node', titre);
        						//parseRec(URLCat,"#"+titre);  //Parse le catalogue
        					})
                            alert(tabCatalog);
        				}
				}//Fin success AJAX
			})//Fin AJAX
}


window.onload = function(){
    $('select').select2();
    
}