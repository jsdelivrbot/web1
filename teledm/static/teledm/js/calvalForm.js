var stationsAeronet = ["Banizoumbou", "Cinzana", "Dakar"];
var variablesAeronet = ['%TripletVar_1020', '%TripletVar_1640', '%TripletVar_340', '%TripletVar_380', '%TripletVar_412', '%TripletVar_440',
                         '%TripletVar_443', '%TripletVar_490', '%TripletVar_500', '%TripletVar_531', '%TripletVar_532', '%TripletVar_551',
                         '%TripletVar_555', '%TripletVar_667', '%TripletVar_675', '%TripletVar_870', '%WaterError', '2nd_Order_Reg_Fit_Error-Total_AOD_500nm[regression_dtau_a]',
                         '340-440Angstrom', '380-500Angstrom', '380nm_Input_AOD', '412nm_Input_AOD', '440-675Angstrom', '440-675Angstrom(Polar)',
                         '440-870Angstrom', '440nm_Input_AOD', '443nm_Input_AOD', '490nm_Input_AOD', '500-870Angstrom', '500nm_Input_AOD',
                         '531nm_Input_AOD', '532nm_Input_AOD', '551nm_Input_AOD', '555nm_Input_AOD', '667nm_Input_AOD', '675nm_Input_AOD',
                         '870nm_Input_AOD', 'AE-Fine_Mode_500nm[alpha_f]', 'AOT_1020', 'AOT_1020-AOT', 'AOT_1020-CH4', 'AOT_1020-CO2',
                         'AOT_1020-ExactWavelength(nm)', 'AOT_1020-NO2', 'AOT_1020-O3', 'AOT_1020-Rayleigh', 'AOT_1020-Total',
                         'AOT_1020-Water', 'AOT_1640', 'AOT_1640-AOT', 'AOT_1640-CH4', 'AOT_1640-CO2', 'AOT_1640-ExactWavelength(nm)',
                         'AOT_1640-NO2', 'AOT_1640-O3', 'AOT_1640-Rayleigh', 'AOT_1640-Total', 'AOT_1640-Water', 'AOT_340', 'AOT_340-AOT',
                         'AOT_340-CH4', 'AOT_340-CO2', 'AOT_340-ExactWavelength(nm)', 'AOT_340-NO2', 'AOT_340-O3', 'AOT_340-Rayleigh', 'AOT_340-Total',
                         'AOT_340-Water', 'AOT_380', 'AOT_380-AOT', 'AOT_380-CH4', 'AOT_380-CO2', 'AOT_380-ExactWavelength(nm)', 'AOT_380-NO2',
                         'AOT_380-O3', 'AOT_380-Rayleigh', 'AOT_380-Total', 'AOT_380-Water', 'AOT_412', 'AOT_412-AOT', 'AOT_412-CH4', 'AOT_412-CO2',
                         'AOT_412-ExactWavelength(nm)', 'AOT_412-NO2', 'AOT_412-O3', 'AOT_412-Rayleigh', 'AOT_412-Total', 'AOT_412-Water', 'AOT_440',
                         'AOT_440-AOT', 'AOT_440-CH4', 'AOT_440-CO2', 'AOT_440-ExactWavelength(nm)', 'AOT_440-NO2', 'AOT_440-O3', 'AOT_440-Rayleigh',
                         'AOT_440-Total', 'AOT_440-Water', 'AOT_443', 'AOT_443-AOT', 'AOT_443-CH4', 'AOT_443-CO2', 'AOT_443-ExactWavelength(nm)', 'AOT_443-NO2',
                         'AOT_443-O3', 'AOT_443-Rayleigh', 'AOT_443-Total', 'AOT_443-Water', 'AOT_490', 'AOT_490-AOT', 'AOT_490-CH4', 'AOT_490-CO2', 'AOT_490-ExactWavelength(nm)',
                         'AOT_490-NO2', 'AOT_490-O3', 'AOT_490-Rayleigh', 'AOT_490-Total', 'AOT_490-Water', 'AOT_500', 'AOT_500-AOT', 'AOT_500-CH4', 'AOT_500-CO2',
                         'AOT_500-ExactWavelength(nm)', 'AOT_500-NO2', 'AOT_500-O3', 'AOT_500-Rayleigh', 'AOT_500-Total', 'AOT_500-Water', 'AOT_531', 'AOT_531-AOT',
                         'AOT_531-CH4', 'AOT_531-CO2', 'AOT_531-ExactWavelength(nm)', 'AOT_531-NO2', 'AOT_531-O3', 'AOT_531-Rayleigh', 'AOT_531-Total',
                         'AOT_531-Water', 'AOT_532', 'AOT_532-AOT', 'AOT_532-CH4', 'AOT_532-CO2', 'AOT_532-ExactWavelength(nm)', 'AOT_532-NO2',
                         'AOT_532-O3', 'AOT_532-Rayleigh', 'AOT_532-Total', 'AOT_532-Water', 'AOT_551', 'AOT_551-AOT', 'AOT_551-CH4', 'AOT_551-CO2',
                         'AOT_551-ExactWavelength(nm)', 'AOT_551-NO2', 'AOT_551-O3', 'AOT_551-Rayleigh', 'AOT_551-Total', 'AOT_551-Water', 'AOT_555',
                         'AOT_555-AOT', 'AOT_555-CH4', 'AOT_555-CO2', 'AOT_555-ExactWavelength(nm)', 'AOT_555-NO2', 'AOT_555-O3', 'AOT_555-Rayleigh',
                         'AOT_555-Total', 'AOT_555-Water', 'AOT_667', 'AOT_667-AOT', 'AOT_667-CH4', 'AOT_667-CO2', 'AOT_667-ExactWavelength(nm)',
                         'AOT_667-NO2', 'AOT_667-O3', 'AOT_667-Rayleigh', 'AOT_667-Total', 'AOT_667-Water', 'AOT_675', 'AOT_675-AOT',
                         'AOT_675-CH4', 'AOT_675-CO2', 'AOT_675-ExactWavelength(nm)', 'AOT_675-NO2', 'AOT_675-O3', 'AOT_675-Rayleigh',
                         'AOT_675-Total', 'AOT_675-Water', 'AOT_870', 'AOT_870-AOT', 'AOT_870-CH4', 'AOT_870-CO2', 'AOT_870-ExactWavelength(nm)',
                         'AOT_870-NO2', 'AOT_870-O3', 'AOT_870-Rayleigh', 'AOT_870-Total', 'AOT_870-Water', 'Air_Mass', 'Angstrom_Exponent(AE)-Total_500nm[alpha]',
                         'Coarse_Mode_AOD_500nm[tau_c]', 'Exact_Wavelengths_for_Input_AOD', 'FineModeFraction_500nm[eta]', 'Fine_Mode_AOD_500nm[tau_f]',
                         'Number_of_Wavelengths', 'Pressure[hPa]', 'RMSE_Coarse_Mode_AOD_500nm[Dtau_c]', 'RMSE_FineModeFraction_500nm[Deta]',
                         'RMSE_Fine_Mode_AOD_500nm[Dtau_f]', 'Solar_Zenith_Angle', 'SunphotometerNumber', 'Total_AOD_500nm[tau_a]',
                         'Total_NO2[DobsonUnits]', 'Total_O3[DobsonUnits]', 'Water(cm)', 'Water(cm)-ExactWavelength(nm)', 'dAE/dln(wavelength)-Fine_Mode_500nm[alphap_f]',
                         'dAE/dln(wavelength)-Total_500nm[alphap]']
//var variablesAeronet = ["AOT_551-Total", "Total_AOD_500nm[tau_a]", "AOT_551", "500-870Angstrom", "FineModeFraction_500nm[eta]"];
var niveau = ['1_5','2'];
var stationsTeom = ["Banizoumbou", "Cinzana", "MBour", "Dedougou"];
var variablesTeom = ["concentration"];
var integration = ['+-1h','+-5h'];
var resoTemp = [['d','quotidien'],['w','hebdomadaire'], ['m','mensuel'], ['t','trimestriel']];
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
        var URLCat = ROOT + "/CatalogTELEDM.xml";
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
        var urlInfo = ROOT + '/wms/' + listSelected.slice(0,ind).join('/') + '/' + fileName + '.nc?service=WMS&version=1.3.0&request=GetCapabilities';
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
        //$("#levelS1").on('change', function(){
            //alert($(this).val());        
        //});
        //dates debut/fin     
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

    $('#buffer').on('change', function(){
        $('.input-small').val("");
    });

    $('.input-small').on('click', function(){
        if ( !$("#ulx").val() && !$("#uly").val() && !$("#lrx").val() && !$("#lry").val()){
            $("#buffer").prop('selectedIndex', 0).change();
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
        //$("#buffer").prop('disabled', true);
        //$("#buffer").prop('selectedIndex', 0).change();
        document.getElementById("buffer").options.length = 1;
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
            var urlInfo = ROOT + '/wms/' + listSelected.slice(0,ind).join('/') + '/' + fileName + '.nc?service=WMS&version=1.3.0&request=GetCapabilities';
            alert('ok');
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
        $("#levelSr2").prop("disabled", true);
        $("#levelSr2").find("option:gt(0)").remove();
    }
}


function setFormS3(){
    if ($("#checkboxS3").prop("checked") == true){
        $("[id$='Aeronet']").prop("disabled", false);       
        $.each(stationsAeronet, function(i, item){
            $("#stationsAeronet").append($("<option></option>").attr("value", item).text(item));
        });
        $.each(variablesAeronet, function(i, item){
            $("#variablesAeronet").append($("<option></option>").attr("value", item).text(item));
        });
        $.each(niveau, function(i, item){
            $("#niveauAeronet").append($("<option></option>").attr("value", item).text(item));
        });
        $("#niveauAeronet").prop('selectedIndex', 1);
    }else{
        $("[id$='Aeronet']").find("option:gt(0)").remove();
        $("#integration").find("option:gt(0)").remove();
        $("[id$='Aeronet']").prop("disabled", true);
    }
}


function setFormS4(){
    if ($("#checkboxS4").prop("checked") == true){
        $("[id$='Teom']").prop("disabled", false);
        $.each(stationsAeronet, function(i, item){
            $("#stationsTeom").append($("<option></option>").attr("value", item).text(item));
        });
        $.each(variablesTeom, function(i, item){
            $("#variablesTeom").append($("<option></option>").attr("value", item).text(item));
        });
        $("#variablesTeom").prop('selectedIndex', 1);
    }else{
        $("[id$='Teom']").find("option:gt(0)").remove(); 
        $("[id$='Teom']").prop("disabled", true);        
    }
}


function setFormIntg(){
    if ($("#checkboxS3").prop("checked") == true || $("#checkboxS4").prop("checked") == true){
        $("#integration").prop("disabled", false);
        $.each(integration, function(i, item){
            $("#integration").append($("<option></option>").attr("value", item).text(item));
        });
        $("#integration").prop('selectedIndex', 1);
    }else{
        $("#integration").find("option:gt(0)").remove();
        $("#integration").prop("disabled", true);
    }
}

$("[id^='checkbox']").on('change', function() {
    $("[id^='checkbox']").not(this).prop('checked', false);
    setFormS2();
    setFormS3();
    setFormS4();
    setFormIntg(); 
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
    alert(varInfos.debut);
    alert(varInfos.fin);
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

    //if ((date2=='') && ((($("#checkboxSr2").prop("checked") == true) && ($("#Option").prop("checked") == false)) || ($("#checkboxS3").prop("checked") == true) || ($("#checkboxS4").prop("checked") == true)){
        //alert("Erreur ! Aucune date saisie !");
        //throw new Exception();
    //

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
        if($('#stationsAeronet').val() == 'Station'){
            alert("Erreur ! Aucune station Aeronet sélectionnée !");
            throw new Exception();
        }
        if($('#variablesAeronet').val() == 'Variable'){
            alert("Erreur ! Aucune variable Aeronet sélectionnée !");
            throw new Exception();
        }
    }
    if ($("#checkboxS4").prop("checked") == true){
        if($('#stationsTeom').val() == 'Station'){
            alert("Erreur ! Aucune station Aeronet sélectionnée !");
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
    
    if (($("#buffer").val() == "Buffer") && (($("#checkboxS3").prop("checked") == true) || ($("#checkboxS4").prop("checked") == true))){
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
            $("#plot1").highcharts().xAxis[0].setTitle({text: data.prdVar});
            }else{
                $("#plot1").highcharts().xAxis[0].setTitle({text: data.prdVar+'(Absence de données)'});
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
            $("#plot1").highcharts().setTitle({text: data.prd + "-" + data.sat}, {text: data.dates[0]+' - '+data.dates[data.dates.length-1]+'<br>(Source CRC)'});
            
            $("#plot1").highcharts().yAxis[0].setTitle({text: data.satVar});
            $("#plot2").highcharts().addSeries({
                yAxis: 0,                
                name: data.satVar,
                data: data['moy_'+data.sat],
                color: 'rgb(80,80,80)',
            });
            $("#plot2").highcharts().addSeries({
                yAxis: 1,
                name: data.prdVar,
                data: data['moy_'+data.prd],
                color: 'rgb(116,223,0)',
            });
            $("#plot2").highcharts().xAxis[0].setCategories(data.dates);
        },
        error : function(xhr,errmsg,err) {
            console.log('erreur: '+errmsg);
            console.log(xhr.status + ": " + xhr.responseText); // provide a bit more info about the error to the console
        }
    });
});


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