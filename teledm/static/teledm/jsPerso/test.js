const ROOT = "http://localhost:8080/thredds";
var resoTemp = [['d','quotidien'],['w','hebdomadaire'], ['m','mensuel'], ['t','trimestriel']];
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
    // choix du capteur
    selectSource1[1].onchange =  function(){
        //reinitialise les menus deroulants
        resetSelect(selectSource1, 2);
        if (this.selectedIndex < 1)
            return; // absence de choix
        //charge les choix de produit
        createURL(this.value, selectSource1[2]);
        };
    // choix du produit
    selectSource1[2].onchange =  function(){
        //reinitialise les menus deroulants
        resetSelect(selectSource1, 3);
        if (this.selectedIndex < 1)
            return; // absence de choix
        //charge les choix de variables
        createURL(this.value, selectSource1[3]);
        };
    // choix de la resolution spatiale
    selectSource1[3].onchange =  function(){
        //reinitialise les menus deroulants
        resetSelect(selectSource1, 4);
        if (this.selectedIndex < 1)
            return; // absence de choix
        //charge les choix de variables
        createURL(this.value, '');
        for (var i=0; i<resoTemp.length; ++i) {
            selectSource1[4].options[selectSource1[4].options.length] = new Option(resoTemp[i][1], resoTemp[i][0]);
            }
        };
    // choix reso temporelle
    selectSource1[4].onchange =  function(){
        //reinitialise les menus deroulants
        resetSelect(selectSource1, 5);
        if (this.selectedIndex < 1)
            return; // absence de choix
        //charge les choix de variables
        console.log(urlPath);
        var listVariables = [];
        $.each(urlPath, function(value){
            var urlInfo = 'http://localhost:8080/thredds/wms/satellite/msg/seviri_aerus/res003/seviri_r003_d.nc?service=WMS&version=1.3.0&request=GetCapabilities';
            $.ajax({
                type: "GET",
                url: urlInfo,
                dataType: "xml",
                async: false,
                success: function(xml) {
                    if ($(xml).find('GetFeatureInfo')!=0){
                        $(xml).find('GetFeatureInfo').each( function(){  //Pour tout les catalogues
                            listVariables.push($(this).attr('xlink:href'));   //Titre du catalogue
                        })
                    }                
                }
            });
        });
        console.log(listVariables[0]);
    };

}
var urlPath = [];

function createURL(valueSelected, selector){
    var selectSource1 = $("[id$='S1']");
    var listSelected = [];
    var titre = [];
    
    $.each(selectSource1, function(value){
        if (this.selectedIndex != 0){
            listSelected.push(this.value);
        }
    });
    ind = listSelected.indexOf(valueSelected);
    var URL = listSelected.slice(0,ind+1).join('/') + '/catalog.xml';
    if (URL == "/catalog.xml"){
        var URLCat = ROOT + "/catalog.xml";
    }
    else {
        var URLCat = ROOT + '/' + URL;
    }
    
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
        					})
        				}
                            if($(xml).find('dataset')!=0)   //Si data(s) présente(s)
                            {
        					$(xml).find('dataset').each( function(){  //Pour toutes les datas
                                      if ($(this).attr('urlPath')){
            						urlPath.push($(this).attr('urlPath'));  //URL du dataset
                                      }
        					}) //Fin each
        				}//Fin if
				}//Fin success AJAX
			})//Fin AJAX
    console.log(urlPath);
    if (selector != ''){
        setSelect(titre, selector);
    }
}


function returnSubmit(){
    console.log(document.getElementById("submit").value)
}

window.onload = function(){
    $('select').select2();
    setForm();
}