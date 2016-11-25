const ROOT = "http://localhost:8080/thredds";

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



function readCat(selected, selector){
    if (selected == ''){
        var URLCat = ROOT + "/catalog.xml";
    }
    else {
        
        var URLCat = ROOT + "/" + selected + "/catalog.xml";
    }
    var titre = [];
    var IDS = [];
    $.ajax( {
				type: "GET",
				url: URLCat,
				dataType: "xml",
				async: false,
				success: function(xml) {
        				if($(xml).find('catalogRef')!=0)  //Si catalogue(s) présent
        				{
        					$(xml).find('catalogRef').each( function(){  //Pour tout les catalogues
        						titre.push($(this).attr('xlink:title'));   //Titre du catalogue
        						var href= $(this).attr('xlink:href');   //Lien du catalogue
        						href=href.replace("/thredds/catalog","");  //Modification du string servant de lien
        						tabCatalog.push(href);   //Création de l'URL du catalogue
        						//createNode(cat, titre, titre, "first");  //Création du noeud dans le tree
        						//$("#listeCatMap").jstree('disable_node', titre);
        						//parseRec(URLCat,"#"+titre);  //Parse le catalogue
        					})
                            setSelect(titre, selector);
        				}
                            if($(xml).find('dataset')!=0)   //Si data(s) présente(s)
                            {
                                alert('dataset');
        					$(xml).find('dataset').each( function(){  //Pour toutes les datas
                                       if($(this).attr('urlPath')){
                                            alert('url');
                                        }
        						//var datasetName= $(this).attr('name');  //Nom du dataset
        						//var urlDataset= $(this).attr('urlPath');  //URL du dataset
        						//createNode(cat, datasetName, datasetName, "last");  //Création du noeud
        					}) //Fin each
                                
        				}//Fin if
				}//Fin success AJAX
			})//Fin AJAX
    alert(IDS);
}


function setSelect(array, bx){
    for (var tp in array) {
            bx.options[bx.options.length] = new Option(array[tp], array[tp]);
    }
}

function resetSelect(listSelect, id){
    for (var i = id; i < listSelect.length; i++){
        listSelect[i].length = 1;
        listSelect[i].removeAttribute("selected");
    }
    listSelect.slice(id,listSelect.length).select2().select2('');
}


function setForm(){
    //type capteur produit variable resospatiale level
    var selectSource1 = $("[id$='S1']");

    //chargement du type1
    createURL('', selectSource1[0]);

    //choix du type
    selectSource1[0].onchange =  function(){
        //reinitialise les menus deroulants
        resetSelect(selectSource1, 1);
        if (this.selectedIndex < 1)
            return; // absence de choix
        //charge les choix de capteur
        createURL(this.value, selectSource1[1]);
        };
    selectSource1[1].onchange =  function(){
        //reinitialise les menus deroulants
        resetSelect(selectSource1, 2);
        if (this.selectedIndex < 1)
            return; // absence de choix
        //charge les choix de produit
        createURL(this.value, selectSource1[2]);
        };
    selectSource1[2].onchange =  function(){
        //reinitialise les menus deroulants
        resetSelect(selectSource1, 3);
        if (this.selectedIndex < 1)
            return; // absence de choix
        //charge les choix de variables
        createURL(this.value, selectSource1[3]);
        };
    selectSource1[3].onchange =  function(){
        //reinitialise les menus deroulants
        resetSelect(selectSource1, 4);
        if (this.selectedIndex < 1)
            return; // absence de choix
        //charge les choix de variables
        createURL(this.value, selectSource1[4]);
        };

}


function createURL(valueSelected, selector){
    var selectSource1 = $("[id$='S1']");
    var listVal = [];
    $.each(selectSource1, function(value){
        if (this.selectedIndex != 0){
            listVal.push(this.value);
        }
    });
    ind = listVal.indexOf(valueSelected);
    var URL = listVal.slice(0,ind+1).join('/') + '/catalog.xml';
    alert(URL);
    if (URL == "/catalog.xml"){
        var URLCat = ROOT + "/catalog.xml";
    }
    else {
        var URLCat = ROOT + '/' + URL;
    }
    var titre = [];
    var IDS = [];
    $.ajax( {
				type: "GET",
				url: URLCat,
				dataType: "xml",
				async: false,
				success: function(xml) {
        				if($(xml).find('catalogRef')!=0)  //Si catalogue(s) présent
        				{
        					$(xml).find('catalogRef').each( function(){  //Pour tout les catalogues
        						titre.push($(this).attr('xlink:title'));   //Titre du catalogue
        						var href= $(this).attr('xlink:href');   //Lien du catalogue
        						href=href.replace("/thredds/catalog","");  //Modification du string servant de lien
        						tabCatalog.push(href);   //Création de l'URL du catalogue
        						//createNode(cat, titre, titre, "first");  //Création du noeud dans le tree
        						//$("#listeCatMap").jstree('disable_node', titre);
        						//parseRec(URLCat,"#"+titre);  //Parse le catalogue
        					})
                            setSelect(titre, selector);
        				}
                            if($(xml).find('dataset')!=0)   //Si data(s) présente(s)
                            {
        					$(xml).find('dataset').each( function(){  //Pour toutes les datas
                                       //var idDataset = $(this).attr('ID');
        						var datasetName= $(this).attr('name');  //Nom du dataset
        						var urlDataset= $(this).attr('urlPath');  //URL du dataset
        						//createNode(cat, datasetName, datasetName, "last");  //Création du noeud
        					}) //Fin each
                                
        				}//Fin if
				}//Fin success AJAX
			})//Fin AJAX
}

window.onload = function(){
    $('select').select2();
    setForm();
}