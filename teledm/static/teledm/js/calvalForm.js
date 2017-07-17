var map;
var fond;
var mapPanel;
var lstInfos = {
    type1:"",
    capteur1:"",
    produit1:"",
    resspatiale1:"",
    restempo1:"",
    layer1:"",
    level1:"",
    type2:"",
    capteur2:"",
    produit2:"",
    resspatiale2:"",
    restempo2:"",
    layer2:"",
    level2:"",
    debut:"",
    fin:"",
    xmin:"",
    xmax:"",
    ymin:"",
    ymax:"",
    buffer:"",
    stAero:"",
    varAero:"",
    nivTrait:"",
    stTeom:"",
    varTeom:"",
    integr:"",
};
var varInfos = {
    variables:{
            name:[],
            dims:[],
            },
    debut:"",
    fin:"",
};
var dataset = {
    header: "",
    lon: "",
    lat: "",
    dates: [],
    datas: []
};

// #####################  set form  ############
function setSelect(array, bx){
    for (var tp in array) {
            bx.options[bx.options.length] = new Option(array[tp], array[tp]);
    }
}

function resetSelect(listSelect, id){
    resetDate();
    $('#levelS1').prop('disabled', true);
    for (var i = id; i < listSelect.length; i++){
        listSelect[i].length = 1;
        listSelect[i].removeAttribute("selected");
    }
    listSelect.slice(id,listSelect.length).select2().select2('');
}


function resetSelect2(listSelect, id){
    resetDate();
    $('#levelSr2').prop('disabled', true);
    document.getElementById("levelSr2").options.length = 1;
    //$('#levelSr2').remove();
    for (var i = id; i < listSelect.length; i++){
        listSelect[i].length = 1;
        listSelect[i].removeAttribute("selected");
    }
    listSelect.slice(id,listSelect.length).select2().select2('');
}

function resetDate(){
    $('#date').datepicker('destroy');
    $('#date').val("");
}


var urlPath = [];
function createURL(valueSelected, selector, selects){
    //var selectSource1 = $("[id$='"+Src+"']");
    var listSelected = [];
    var titre = [];
    
    $.each(selects, function(value){
        if (this.selectedIndex != 0){
            listSelected.push(this.value);
        }
    });
    var ind = listSelected.indexOf(valueSelected);
    var URL = listSelected.slice(0,ind+1).join('/') + '/catalog.xml';
    if (URL == "/catalog.xml"){
        var URLCat = ROOT + "/proxyajax/catalogRefs/CatalogTELEDEM.xml";
    }
    else {
        var URLCat = ROOT + '/proxyajax/catalog/' + URL;
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
    if (selector != ''){
        setSelect(titre, selector);
    }
}

$('#levelS1').prop('disabled', true);
function setForm(){
    //type capteur produit variable resospatiale level
    var selectSource1 = $("[id$='S1']");
    createURL('', selectSource1[0], selectSource1); //chargement du type1

    //choix du type
    selectSource1[0].onchange =  function(){
        resetSelect(selectSource1, 1);  //reinitialise les menus deroulants
        if (this.selectedIndex < 1)
            return; // absence de choix
        createURL(this.value, selectSource1[1], selectSource1);  //charge les choix de capteur
        };

    // choix du capteur
    selectSource1[1].onchange =  function(){
        //reinitialise les menus deroulants
        resetSelect(selectSource1, 2);
        if (this.selectedIndex < 1)
            return; // absence de choix
        //charge les choix de produit
        createURL(this.value, selectSource1[2], selectSource1);
        };
    // choix du produit
    selectSource1[2].onchange =  function(){
        //reinitialise les menus deroulants
        resetSelect(selectSource1, 3);
        if (this.selectedIndex < 1)
            return; // absence de choix
        //charge les choix de variables
        createURL(this.value, selectSource1[3], selectSource1);
        };
    // choix de la resolution spatiale
    selectSource1[3].onchange =  function(){
        //reinitialise les menus deroulants
        resetSelect(selectSource1, 4);
        if (this.selectedIndex < 1)
            return; // absence de choix
        //charge les choix de variables
        createURL(this.value, '', selectSource1);
        for (var i=0; i<resoTemp.length; ++i) {
            selectSource1[4].options[selectSource1[4].options.length] = new Option(resoTemp[i][1], resoTemp[i][0]);
            }
        };
    // choix reso temporelle
    $("#pasdetempsS1").on("change", function(){
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
        }else if (listSelected[2]=="domaine01"){
            var fileName = "chimere01_r" + reso.replace('res','') +'_'+this.value;
        }else if (listSelected[2]=="domaine02"){
            var fileName = "chimere02_r" + reso.replace('res','') +'_'+this.value;
        }else{
            var fileName = listSelected[2] + "_r" + reso.replace('res','') +'_'+this.value;
        }
        var urlInfo = ROOT + '/dates/wms/' + listSelected.slice(0,ind).join('/') + '/' + fileName + '.nc?service=WMS&version=1.3.0&request=GetCapabilities';
        getDateRange(urlInfo);
        setSelect(varInfos.variables.name, selectSource1[5]);
        changeDates1(varInfos.debut,varInfos.fin,this.value);
        changeDates2(varInfos.debut,varInfos.fin,this.value);
        $("#variableS1").on("change", function(){
            var id = $(this).prop('selectedIndex');            
            if (($("#capteurS1").val() == "chimere") | ($("#capteurS1").val() == "wrf")){
                $("#levelS1").prop("disabled", false);
                $.each(varInfos.variables.dims[id], function (i, item) {
                    $('#levelS1').append($('<option>', { 
                        value: item,
                        text : item 
                    }));
                });
            }
        }); 
    });

    $('.input-small').keypress(function(event) {

        if(event.which == 8 || event.keyCode == 9 || event.keyCode == 37 || event.keyCode == 39 || event.keyCode == 46) 
            return true;

        else if((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57))
            event.preventDefault();
    });

    // ouest
    $("#ulx").on("change", function(){
        if ( ($("#lrx").val()) && (parseInt($("#lrx").val()) < parseInt($("#ulx").val())) ){ 
            alert("La longitude EST ne peut pas être inférieure à la longitude OUEST");
            $("#lrx").val("");
        }
        if (($(this).val()<-90) | ($(this).val()>90)){ 
            alert("La longitude doit être comprise entre -90 et 90");
            $(this).val("");
        }
    });

    // est
    $("#lrx").on("change", function(){
        if (($("#ulx").val()) && (parseInt($("#lrx").val()) < parseInt($("#ulx").val()))){
            alert("La longitude EST ne peut pas être inférieure à la longitude OUEST");
            $("#lrx").val("");
        }
        if (($(this).val()<-90) | ($(this).val()>90)){ 
            alert("La longitude doit être comprise entre -90 et 90");
            $(this).val("");
        }
    });

    // nord
    $("#uly").on("change", function(){
        if (($("#lry").val()) && (parseInt($("#lry").val()) > parseInt($("#uly").val()))){
            alert("La latitude SUD ne peut pas être inférieure à la latitude NORD");
            $("#lry").val("");
        }
        if (($(this).val()<-180) | ($(this).val()>180)){ 
            alert("La latitude doit être comprise entre -180 et +180");
            $(this).val("");
        }
    });

    // sud
    $("#lry").on("change", function(){
        if ( ($("#uly").val()) && (parseInt($("#lry").val()) > parseInt($("#uly").val()))){
            alert("La latitude SUD ne peut pas être inférieure à la latitude NORD");
            $("#lry").val("");
        }
        if (($(this).val()<-180) | ($(this).val()>180)){ 
            alert("La latitude doit être comprise entre -180 et +180");
            $(this).val("");
        }
    });

    $('#bufferIS').on('change', function(){
        $('.input-small').val("");
    });

    $('.input-small').on('click', function(){
        if ( !$("#ulx").val() && !$("#uly").val() && !$("#lrx").val() && !$("#lry").val()){
            $("#bufferIS").prop('selectedIndex', 0).change();
        }
    });
}

$('#Option').prop('disabled', true);
$('#levelS2').prop('disabled', true);
function setFormS2(){
    //type capteur produit variable resospatiale level
    //$('#Option').prop('checked', false);
    var selectSource2 = $("[id$='S2']");
    if($('#checkboxSr2').is(':checked')){
        createURL('', selectSource2[0], selectSource2); //chargement du type1
        $('#Option').prop('disabled', false);
        $('#levelSr2').prop('disabled', true);
        for (i = 0; i < selectSource2.length; i++){
            selectSource2[i].disabled=false;
        }
        //choix du type
        selectSource2[0].onchange =  function(){
            resetSelect2(selectSource2, 1);  //reinitialise les menus deroulants
            if (this.selectedIndex < 1)
                return; // absence de choix
            createURL(this.value, selectSource2[1], selectSource2);  //charge les choix de capteur
            };
    
        // choix du capteur
        selectSource2[1].onchange =  function(){
            //reinitialise les menus deroulants
            resetSelect2(selectSource2, 2);
            if (this.selectedIndex < 1)
                return; // absence de choix
            //charge les choix de produit
            createURL(this.value, selectSource2[2], selectSource2);
            };
        // choix du produit
        selectSource2[2].onchange =  function(){
            //reinitialise les menus deroulants
            resetSelect2(selectSource2, 3);
            if (this.selectedIndex < 1)
                return; // absence de choix
            //charge les choix de la resolution spatiale
            createURL(this.value, selectSource2[3], selectSource2);
            };
        // choix de la resolution spatiale
        selectSource2[3].onchange =  function(){
            //reinitialise les menus deroulants
            resetSelect2(selectSource2, 4);
            if (this.selectedIndex < 1)
                return; // absence de choix
            //charge les choix de pas de temps
            createURL(this.value, '', selectSource2);
            for (var i=0; i<resoTemp.length; ++i) {
                selectSource2[4].options[selectSource2[4].options.length] = new Option(resoTemp[i][1], resoTemp[i][0]);
                }
            };
        // choix reso temporelle
        $("#pasdetempsS2").on("change", function(){
             //reinitialise les menus deroulants
            resetSelect2(selectSource2, 5);
            if (this.selectedIndex < 1)
                return; // absence de choix
            //charge les choix de variables
            var listSelected = [];
            $.each(selectSource2, function(value){
                if (this.selectedIndex != 0){
                    listSelected.push(this.value);
                }
            });
            var ind = listSelected.indexOf(this.value);
            var reso = listSelected[3];
            if (listSelected[2]=="seviri_aerus"){
                var fileName = "seviri_r" + reso.replace('res','') +'_'+this.value;
            }else if (listSelected[2]=="domaine01"){
                var fileName = "chimere01_r" + reso.replace('res','') +'_'+this.value;
            }else if (listSelected[2]=="domaine02"){
                var fileName = "chimere02_r" + reso.replace('res','') +'_'+this.value;
            }else{
                var fileName = listSelected[2] + "_r" + reso.replace('res','') +'_'+this.value;
            }
            var urlInfo = ROOT + '/dates/wms/' + listSelected.slice(0,ind).join('/') + '/' + fileName + '.nc?service=WMS&version=1.3.0&request=GetCapabilities';
            getDateRange(urlInfo);
            setSelect(varInfos.variables.name, selectSource2[5]);
            $("#variableS2").on("change", function(){
                var id = $(this).prop('selectedIndex');            
                if (($("#capteurS2").val() == "chimere") | ($("#capteurS2").val() == "wrf")){
                    $("#levelSr2").prop("disabled", false);
                    $.each(varInfos.variables.dims[id], function (i, item) {
                        $('#levelSr2').append($('<option>', { 
                            value: item,
                            text : item 
                        }));
                    });
                }
            });
            
        });
    }else{
        $("[id$='S2']").find("option:gt(0)").remove();
        $("[id$='S2']").prop("disabled", true);
        $("#Option").prop("disabled", true);
        $("#Option").prop('checked', false);
        $("#levelSr2").prop("disabled", true);
        $("#levelSr2").find("option:gt(0)").remove();
    }
}

//in situ form
function setFormS3(){
    if ($("#checkboxS3").prop("checked") == true){
        $("[id$='IS']").prop("disabled", false);
        $.each(mesures, function(i, item){
            $("#mesureIS").append($("<option></option>").attr("value", item).text(item));
        });
        $("#mesureIS").on('change', function(){
            $("#stationsIS").find("option:gt(0)").remove();
            $("#niveauIS").find("option:gt(0)").remove();
            $("#variablesIS").find("option:gt(0)").remove();
            $("#resoTempoIS").find("option:gt(0)").remove();
            if($(this).val() == 'aeronet'){
                $.each(stationsAeronet, function(i, item){
                    $("#stationsIS").append($("<option></option>").attr("value", item).text(item));
                });
                $("#niveauIS").prop("disabled", false);
                $.each(niveau, function(i, item){
                    $("#niveauIS").append($("<option></option>").attr("value", item).text(item));
                });
                $.each(variablesAeronet1, function(i, item){
                    $("#variablesIS").append($("<option></option>").attr("value", item).text(item));
                });
                $("#niveauIS").prop('selectedIndex', 1);
                $.each(resoTempo[$(this).val()], function(i, item){
                    $("#resoTempoIS").append($("<option></option>").attr("value", item).text(item));
                });
                $.each(integration, function(i, item){
                    $("#integrationIS").append($("<option></option>").attr("value", item).text(item));
                });
                $("#integrationIS").prop('selectedIndex', 1);
            }else if($(this).val() == 'teom'){
                $("#niveauIS").prop("disabled", true);
                $.each(stationsTeom, function(i, item){
                    $("#stationsIS").append($("<option></option>").attr("value", item).text(item));
                });
                $.each(variablesTeom, function(i, item){
                    $("#variablesIS").append($("<option></option>").attr("value", item).text(item));
                });
                $.each(integration, function(i, item){
                    $("#integrationIS").append($("<option></option>").attr("value", item).text(item));
                });
                $("#integrationIS").prop('selectedIndex', 1);
            }else{
                $("#niveauIS").prop("disabled", true);
                $.each(stationsMeteo, function(i, item){
                    $("#stationsIS").append($("<option></option>").attr("value", item).text(item));
                });
                $.each(variablesMeteo, function(i, item){
                    $("#variablesIS").append($("<option></option>").attr("value", item).text(item));
                });
            }
        });
        $("#stationsIS").on('change', function(){
            if (($(this).val()!='Dedougou') && ($("#mesureIS").val()=='teom')){
                  $("#integrationIS").prop("disabled", true);
                  $("#integrationIS").find("option:gt(0)").remove();
            }else{
                $("#integrationIS").prop("disabled", false);
                $.each(integration, function(i, item){
                    $("#integrationIS").append($("<option></option>").attr("value", item).text(item));
                });
            }
        });
        $("#niveauIS").on('change', function(){
            $("#variablesIS").find("option:gt(0)").remove();
            if($(this).val() == '1_5'){
                $.each(variablesAeronet1, function(i, item){
                    $("#variablesIS").append($("<option></option>").attr("value", item).text(item));
                });
            }else{
                $.each(variablesAeronet2, function(i, item){
                    $("#variablesIS").append($("<option></option>").attr("value", item).text(item));
                });
            }
        });
        $("#bufferIS").prop('disabled', false);
        $.each(buffers, function(i, item){
                $("#bufferIS").append($("<option></option>").attr("value", item).text(item));
            });
    }else{
        $("[id$='IS']").find("option:gt(0)").remove();
        $("[id$='IS']").prop("disabled", true);
    }
}

//epidemio form
function setFormS4(){
    if ($("#checkboxS4").prop("checked") == true){
        $("[id$='EP']").prop("disabled", false);
        $.each(epidemio, function(i, item){
            $("#epidemioEP").append($("<option></option>").attr("value", item).text(item));
        });
        $("#epidemioEP").on('change', function(){
            $("#paysEP").find("option:gt(0)").remove();
            $("#echelleEP").find("option:gt(0)").remove();
            $("#districtEP").find("option:gt(0)").remove();
            $("#districtEP").prop("disabled", false);
            $("#variableEP").find("option:gt(0)").remove();
            if($(this).val() == 'meningite'){
                $.each(Object.keys(meningitePays), function(i, item){
                    $("#paysEP").append($("<option></option>").attr("value", item).text(item));
                });
            }
        });
        
        $("#paysEP").on('change', function(){
            $("#echelleEP").find("option:gt(0)").remove();
            $("#districtEP").find("option:gt(0)").remove();
            $("#districtEP").prop("disabled", false);
            $("#variableEP").find("option:gt(0)").remove();
            $.each(meningitePays[$(this).val()], function(i, item){
                $("#echelleEP").append($("<option></option>").attr("value", item).text(item));
            });
        });
        
        
        $("#echelleEP").on('change', function(){
            $("#districtEP").find("option:gt(0)").remove();
            $("#variableEP").find("option:gt(0)").remove();
            if($(this).val() == 'district'){
                $("#districtEP").prop("disabled", false);
                $.each(meningiteDist[$("#paysEP").val()], function(i, item){
                    $("#districtEP").append($("<option></option>").attr("value", item).text(item))
                });
                $.each(meningiteVar.district, function(i, item){
                    $("#variableEP").append($("<option></option>").attr("value", item).text(item));
                });
            }else{
                $("#districtEP").prop("disabled", true);
                $.each(meningiteVar.pays, function(i, item){
                    $("#variableEP").append($("<option></option>").attr("value", item).text(item));
                });
            }
        });
    }else{
        $("[id$='EP']").find("option:gt(0)").remove(); 
        $("[id$='EP']").prop("disabled", true);        
    }
}



$("[id^='checkbox']").on('change', function() {
    $("[id^='checkbox']").not(this).prop('checked', false);
    setFormS2();
    setFormS3();
    setFormS4();
});

function getDateRange(url){
    var lstvariables = [];
    var lstlayers = [];
    $.ajax({
        type: "GET",
        url: url,
        dataType: "xml",
        async: false,
        success: function(xml) {
            $(xml).find('Layer[queryable="1"]').each(function(){
                lstvariables.push($(this).find("Name").first().text());
                varInfos.variables.name = lstvariables;
                if ($(this).find('Dimension[name="elevation"]').text()){
                    var layers = $(this).find('Dimension[name="elevation"]').text();
                    lstlayers.push(layers.split(',').map(Number));
                } else{
                    lstlayers.push([-1]);     
                }
                varInfos.variables.dims = lstlayers;
                var times = $(this).find('Dimension[name="time"]').text();
                var ldates = times.split(',');
                varInfos.debut = ldates[1];
                varInfos.fin = ldates[ldates.length-1];
            })
        }
    })
}



function changeDates1(start,end,period){
    $('#date1').datepicker('destroy');
    $( "#date1" ).datepicker({
        yearRange: '1979:2025',
        dateFormat: 'yy-mm-dd',
        changeMonth: true,
        changeYear: true,
        showMonthAfterYear: true,
        defaultDate: new Date(start),
        minDate: new Date(start),
        maxDate: new Date (end),
        onSelect: function( selectedDate ) {
            $( "#date2" ).datepicker( "option", "minDate", selectedDate );
        },
    });
}

function changeDates2(start,end,period){
    $('#date2').datepicker('destroy');
    $( "#date2" ).datepicker({
        yearRange: '1979:2025',
        dateFormat: 'yy-mm-dd',
        changeMonth: true,
        changeYear: true,
        showMonthAfterYear: true,
        defaultDate: new Date(start),
        minDate: new Date(start),
        maxDate: new Date (end),
        onSelect: function( selectedDate ) {
            $( "#date1" ).datepicker( "option", "maxDate", selectedDate );
        },
    });
}



// #######################################################################################


// ################## verification form ##################################################

function verifForm(){   
    if( $('#typeS1').val() =='Type de données'){        
        alert("Erreur ! Aucun type de données sélectionné !");
        throw new Exception();
    }
    if($('#capteurS1').val() == 'Capteur/Source'){
        alert("Erreur ! Aucune source de données sélectionnée !");
        throw new Exception();
    }
    if($('#produitS1').val() == 'Produit'){
        alert("Erreur ! Aucun produit sélectionné !");
        throw new Exception();
    }
    if($('#resospatialeS1').val() == 'Résolution spatiale'){
        alert("Erreur ! Aucune résolution spatiale sélectionnée !");
        throw new Exception();
    }
    if($('#pasdetempsS1').val() == 'Résolution temporelle'){
        alert("Erreur ! Aucun pas de temps sélectionné !");
        throw new Exception();
    }
    if($('#variableS1').val() == 'Variable'){
        alert("Erreur ! Aucune couche sélectionnée !");
        throw new Exception();
    }
    if($('#levelS1').val() == 'layer'){
        alert("Erreur ! Aucun niveau de couche sélectionné !");
        throw new Exception();
    }
    var date1 = $("input[id='date1']").val();
    
    if (date1==''){
        alert("Erreur ! Aucune date saisie !");
        throw new Exception();
    }else{
        if (lstInfos.restempo == 'w'){
            lstInfos.debut = moment(date1).startOf('isoWeek').format('YYYY-MM-DD');
        }else if (lstInfos.restempo == 'm'){
            lstInfos.debut = moment(date1).startOf('Month').format('YYYY-MM-DD');
        }else if (lstInfos.restempo == 't'){
            lstInfos.debut = moment(date1).startOf('quarter').format('YYYY-MM-DD');
        }else{
            lstInfos.debut=date1;
        }
        $("input[id='date1']").val(lstInfos.debut);
    }

    if (($("#checkboxSr2").prop("checked") == false) && ($("#checkboxS3").prop("checked") == false) && ($("#checkboxS4").prop("checked") == false)){
        alert("Erreur ! Sélectionner un 2eme type de données !");
        throw new Exception();
    }

    if ($("#checkboxSr2").prop("checked") == true){
        if( $('#typeS2').val() =='Type de données'){        
            alert("Erreur ! Aucun type de données sélectionné !");
            throw new Exception();
        }
        if($('#capteurS2').val() == 'Capteur/Source'){
            alert("Erreur ! Aucune source de données sélectionnée !");
            throw new Exception();
        }
        if($('#produitS2').val() == 'Produit'){
            alert("Erreur ! Aucun produit sélectionné !");
            throw new Exception();
        }
        if($('#resospatialeS2').val() == 'Résolution spatiale'){
            alert("Erreur ! Aucune résolution spatiale sélectionnée !");
            throw new Exception();
        }
        if($('#pasdetempsS2').val() == 'Résolution temporelle'){
            alert("Erreur ! Aucun pas de temps sélectionné !");
            throw new Exception();
        }
        if($('#variableS2').val() == 'Variable'){
            alert("Erreur ! Aucune couche sélectionnée !");
            throw new Exception();
        }
        if($('#levelSr2').val() == 'layer'){
            alert("Erreur ! Aucun niveau de couche sélectionné !");
            throw new Exception();
        }
    }
    if( ($("#Option").prop("checked") == true )){
        if ($('#resospatialeS1').val() != $('#resospatialeS2').val()){
            alert("L'option sélectionnées nécessite la même résolution spatiale pour chacune des couches.\nIl est possible que le produit sélectionné ne propose pas de résolution adéquate.");
            throw new Exception();
        }
        
    }


    if ($("#checkboxS3").prop("checked") == true){
        if($('#mesureIS').val() == 'Type'){
            alert("Erreur ! Aucun type de mesure sélectionné !");
            throw new Exception();
        }
        if($('#stationsIS').val() == 'Station'){
            alert("Erreur ! Aucune station de mesure sélectionnée !");
            throw new Exception();
        }
        if($('#variablesIS').val() == 'Variable'){
            alert("Erreur ! Aucune variable mesuree sélectionnée !");
            throw new Exception();
        }
    }
    if ($("#checkboxS4").prop("checked") == true){
        if($('#epidemioEP').val() == 'Type'){
            alert("Erreur ! Aucun type epidemio sélectionné !");
            throw new Exception();
        }
        if($('#paysEP').val() == 'Pays'){
            alert("Erreur ! Aucun pays sélectionné !");
            throw new Exception();
        }
        if($('#echelleEP').val() == 'Echelle'){
            alert("Erreur ! Aucune echelle geographique sélectionnée !");
            throw new Exception();
        }
        if(($('#districtEP').prop("disabled") == false) && ($('#districtEP').val() == 'District')){
            alert("Erreur ! Aucun district sélectionné !");
            throw new Exception();
        }
        if($('#variableEP').val() == 'Variable'){
            alert("Erreur ! Aucune variable epidemio sélectionnée !");
            throw new Exception();
        }
    }
    
    var date2 = $("input[id='date2']").val();
    if ((date2 == '') && ($("#Option").prop("checked") == false)){
        alert("Erreur ! Saisir une 2eme date !");
        throw new Exception();
    }else{
        if (lstInfos.restempo == 'w'){
            lstInfos.fin = moment(date2).startOf('isoWeek').format('YYYY-MM-DD');
        }else if (lstInfos.restempo == 'm'){
            lstInfos.fin = moment(date2).startOf('Month').format('YYYY-MM-DD');
        }else if (lstInfos.restempo == 't'){
            lstInfos.fin = moment(date2).startOf('quarter').format('YYYY-MM-DD');
        }else{
            lstInfos.fin=date2;
        }
        $("input[id='date2']").val(lstInfos.fin);      
    }
    
    if (($("#bufferIS").val() == "Buffer") && (($("#checkboxS3").prop("checked") == true))){
        alert("Erreur ! Buffer non sélectionné !");
        throw new Exception();
    }
    
    if (($("#checkboxSr2").prop("checked") == true)){
        alert($("#ulx").val());
        if (($("#ulx").val() == "") || ($("#uly").val() == "") || ($("#lrx").val() == "") || ($("#lry").val() == "")){
            alert("Erreur ! Saisir les coordonnées !");
            throw new Exception();
        }
    }
}

window.onload = function(){
    $('select').select2();
    setForm();
}

// requete ajax scatter plot
$("#scatter").on('submit',  function(e){
    e.preventDefault(); 
    verifForm();
    if ( $("#Option").prop('checked') == true ){
        var action = "scatterSpatial";
    } else {
        var action = "scatterTemporel";
    }
    $("[id^='plot']").each(function(){
        while($(this).highcharts().series.length > 0){
            $(this).highcharts().series[0].remove(true);
        }
    });    
    $.ajax({
        async: false,
        type: "POST",
        url: '',
        //dataType: 'json',
        data: $("#scatter").serialize()+"&action="+action,
        beforeSend: function(xhr, settings) {
            xhr.setRequestHeader("X-CSRFToken", $.cookie('csrftoken'));
            $("[id^='plot']").each(function(){
                $(this).highcharts().showLoading();
            });
        },
        complete: function(){
            $("[id^='plot']").each(function(){
                $(this).highcharts().hideLoading();
            });
        },
        success: function(data){
            if (data.a){
                $("#plot1").highcharts().addSeries({
                    name: 'y=' +data.a.toFixed(4) + 'x+' + data.b.toFixed(2) + ', r2=' + data.rCarre.toFixed(2),
                    data: data.line,
                    type: 'line',
                    color: 'rgb(255, 102, 102)',
                    marker: {
                        enabled: false
                    },
                    states: {
                        hover: {
                            lineWidth: 0
                        }
                    },
                    enableMouseTracking: false
                });
            $("#plot1").highcharts().xAxis[0].setTitle({text: data.var2});
            }else{
                $("#plot1").highcharts().xAxis[0].setTitle({text: data.var2+'(Absence de données)'});
            }
            $("#plot1").highcharts().addSeries({
                name: 'Observations',
                data: data.scatterValues,
                type: 'scatter',
                color: 'rgb(80,80,80)',
                marker: {
                    radius: 2,
                }
            });
            $("#plot1").highcharts().setTitle({text: data.source1 + "-" + data.source2}, {text: data.dates[0]+' - '+data.dates[data.dates.length-1]+'<br>(Source CRC)'});
            
            $("#plot1").highcharts().yAxis[0].setTitle({text: data.var1});
            $("#plot2").highcharts().addSeries({
                yAxis: 0,                
                name: data.var1,
                data: data[data.source1],
                color: 'rgb(80,80,80)',
            });
            $("#plot2").highcharts().addSeries({
                yAxis: 1,
                name: data.var2,
                data: data[data.source2],
                color: 'rgb(116,223,0)',
            });
            $("#plot2").highcharts().xAxis[0].setCategories(data.dates);
        },
        error : function(xhr,errmsg,err) {
            console.log('erreur: '+errmsg);
            console.log(xhr.status + ": " + xhr.responseText);
        }
    });
});

//initialisation graphique scatter plot
$('#plot1').highcharts({
    xAxis: {
        title: {
            enabled: true,
            text: ''
        },
    },
    yAxis: {
        title: {
            text: ''
        }
    },
    title: {
        text: 'Scatter plot'
    },
    subtitle: {
        text: 'Source: CRCT'
    },
    legend: {
        layout: 'vertical',
        align: 'left',
        x: 80,
        verticalAlign: 'top',
        y: 55,
        floating: true,
        backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#F5F5F5'
    },
    series: [],
    credits:{
        enabled: false
    }
});

// initialisation graphique profil temporel
$('#plot2').highcharts({
    chart: {
        zoomType: 'xy'
    },
    title: {
        text: 'Profils temporels'
    },
    subtitle: {
        text: 'Source: CRCT'
    },
    xAxis: [{
        categories: '',
        crosshair: true
    }],
    yAxis: [{ // Primary yAxis
        labels: {
            format: '{value}',
            style: {
                color: Highcharts.getOptions().colors[1]
            }
        },
        title: {
            text: '',
            style: {
                color: Highcharts.getOptions().colors[1]
            }
        },
        opposite: true
    }, { // Secondary yAxis
        gridLineWidth: 0,
        title: {
            text: '',
            style: {
                color: Highcharts.getOptions().colors[0]
            }
        },
        labels: {
            format: '{value}',
            style: {
                color: Highcharts.getOptions().colors[0]
            }
        }

    }],
    tooltip: {
        shared: true
    },
    legend: {
        layout: 'vertical',
        align: 'left',
        x: 80,
        verticalAlign: 'top',
        y: 55,
        floating: true,
        backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
    },
    series:[],
    credits:{
        enabled: false
    }
});