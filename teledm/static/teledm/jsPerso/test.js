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
        var listSelected = [];
        $.each(selectSource1, function(value){
            if (this.selectedIndex != 0){
                listSelected.push(this.value);
            }
        });
        var ind = listSelected.indexOf(this.value);
        var reso = listSelected[3];
        if (listSelected[2]=="seviri_aerus"){
            var fileName = "seviri_r" + reso.replace('res','') +'_'+this.value;
        }else{
            var fileName = listSelected[2] + "_r" + reso.replace('res','') +'_'+this.value;
        }
        var urlInfo = 'http://localhost:8080/thredds/wms/' + listSelected.slice(0,ind).join('/') + '/' + fileName + '.nc?service=WMS&version=1.3.0&request=GetCapabilities';
        console.log(urlInfo);
        var listVariables = [];
        $.each(urlPath, function(value){
            //var urlInfo = 'http://localhost:8080/thredds/wms/satellite/aura_omi/omaeruv/res025/omaeruv_r025_d.nc?service=WMS&version=1.3.0&request=GetCapabilities'
                         //'http://localhost:8080/thredds/wms/satellite/msg/seviri_aerus/res003/seviri_r003_d.nc?service=WMS&version=1.3.0&request=GetCapabilities';
            $.ajax({
                type: "GET",
                url: urlInfo,
                dataType: "xml",
                async: false,
                success: function(xml) {
                    $(xml).find('Layer[queryable="1"]').each(function(){
                        listVariables.push( = $(this).find("Name").first().text());
                        var times = $(this).find('Dimension[name="time"]').text();
                        var time = [];
                        console.log(times.split(',')[0]);
                        time.push(times.split(',')[times.split(',').length-1]);
                        console.log(time);
                        //var level = $(this).find('Dimension[name="elevation"]').text().split(','));
                        dictVarDate.push({
                                key: name,
                                value: time
                        });
                        //levels.push($(this).find('Dimension[name="elevation"]').text());
                    })
                }
            })
        });
        console.log(listVariables["FinalAerosolAbsOpticalDepth_354_nm"]);
        setSelect(listVariables, selectSource1[5]);
        //dates debut/fin
        $( "#date" ).datepicker({
            yearRange: '1979:2025',
            dateFormat: 'yy-mm-dd',
            changeMonth: true,
            changeYear: true,
            showMonthAfterYear: true,
            minDate: new Date(listVariables),
            maxDate: new Date(fin),
            onSelect: function( selectedDate ) {
                $( "#date2" ).datepicker( "option", "minDate", selectedDate );
            },
            //beforeShowDay: function(date){ 
                //return [(date.getDay() == 2 || date.getDay() == 3 || date.getDay() == 4 || date.getDay() == 5 || date.getDay() == 6 || date.getDay() == 0), ""]
            //},
        });
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
    var ind = listSelected.indexOf(valueSelected);
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