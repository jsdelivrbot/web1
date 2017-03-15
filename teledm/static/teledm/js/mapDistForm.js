var geoDist = ['niger_district_sante', 'mali_district_sante','burkina_aire_sante', 'burkina_district_sante',];
var mesures = ["aeronet", "teom", "meteo"];

var stationsAeronet = ["Banizoumbou", "Cinzana", "Dakar"];
var variablesAeronet1 = ['%TripletVar_1020', '%TripletVar_1640', '%TripletVar_340', '%TripletVar_380', '%TripletVar_412', '%TripletVar_440',
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
var variablesAeronet2 = ["AOT_551-Total", "Total_AOD_500nm[tau_a]", "AOT_551", "500-870Angstrom", "FineModeFraction_500nm[eta]"];
var niveau = ['1_5','2'];
var resoTempo = {
    "aeronet":["diurne_15min", "diurne_h", "diurne_d", "diurne_w", "diurne_m", "diurne_t",
                        "h24_15min", "h24_h", "h24_d", "h24_w", "h24_m", "h24_t"],
    "teom":["diurne_15min", "diurne_h", "diurne_d", "diurne_w", "diurne_m", "diurne_t",
                        "h24_15min", "h24_h", "h24_d", "h24_w", "h24_m", "h24_t"],
    "meteo":['3h', '6h', '12h', 'd', 'w', 'm']
};
var stationsTeom = ["Banizoumbou", "Cinzana", "MBour", "Dedougou"];
var variablesTeom = ["concentration"];
var stationsMeteo = ["Banizoumbou", "Cinzana", "MBour", "Dedougou"];
var variablesMeteo = ["wind", "wind_dir", "temp", "relh", "rain"];
var resoTemp = [['d','quotidien'],['w','hebdomadaire'], ['m','mensuel'], ['t','trimestriel']];

var epidemio = ["meningite"];
var meningitePays = {
    'Burkina':['pays', 'district'],
    'Mali':['pays', 'district'],
    'Niger':['pays', 'district'],
    //'Senegal':['pays']
};
var meningiteDist = {
    'Burkina':['Banfora', 'Barsalogo', 'Batie', 'Bogande', 'Boromo', 'Boulsa', 'Bousse',
    'Dande', 'Dano', 'Dedougou', 'Diapaga', 'Diebougou', 'Djibo', 'Dori', 'Fada', 'Fadgay',
    'Gaoua', 'Gayeri', 'Gorom-Gorom', 'Gourcy', 'Hounde', 'Kaya', 'Kombissiri', 'Kongoussi',
    'Kossodo', 'Koudougou', 'Koupela', 'Leo', 'Leosap', 'Manga', 'Nanoro', 'Nouna', 'Orodara',
    'Ouagou', 'Ouahigouya', 'Ouargaye', 'Pama', 'Paul6', 'Pissy', 'Po', 'Reo', 'Sapone', 'Sapouy',
    'Sebba', 'Secteur15', 'Secteur22', 'Secteur30', 'Seguenega', 'Sindou', 'Solenzo', 'Tenkodogo',
    'Titao', 'Toma', 'Tougan', 'Yako', 'Zabre', 'Ziniare', 'Zorgho'],

    'Mali':['Abeibara', 'Ansongo', 'Bafoulabe', 'Banamba', 'Bandiagara', 'Bankass', 'Baraoueli', 'Bla',
    'Bougouni', 'Bourem', 'Commune1', 'Commune2', 'Commune3', 'Commune4', 'Commune5', 'Commune6', 'Diema',
    'Diofan', 'Dioila', 'Dire', 'Djenne', 'Douentza', 'Fana', 'Gao', 'Goundam', 'Gourma-Rharous', 'Kadiolo',
    'Kangaba', 'Kati', 'Katoue', 'Kayes', 'Kenieba', 'Kidal', 'Kita', 'Kolokani', 'Kolondieba', 'Koro', 'Koulikoro',
    'Koutiala', 'Macina', 'Markala', 'Menaka', 'Mopti', 'Nara', 'Niafunke', 'Niono', 'Nioro', 'Ouelessebougou', 'San',
    'Segmar', 'Segou', 'Selingue', 'Sikasso', 'Tenenkou', 'Tessalit', 'Tin-Essako', 'Tombouctou', 'Tominian',
    'Yanfolila', 'Yansel', 'Yelimane', 'Yorosso', 'Youwarou'],

    'Niger':['Abalak', 'Agadez', 'Agatch', 'Aguie', 'Arlit', 'Bilma', 'Birni-Nkonni',
    'Boboye', 'Bouza', 'Dakoro', 'Diffa', 'Dogon-Doutchi', 'Dosso', 'Filingue', 'Gaya',
    'Goure', 'Guidan-Roumdji', 'Illela', 'Keita', 'Kollo', 'Loga', 'Madaoua', 'Madarounfa',
    'Magaria', 'Maine-Soroa', 'Maradi', 'Matameye', 'Mayahi', 'Mirriah', 'Nguigmi', 'Niamey',
    'Niamey1', 'Niamey2', 'Niamey3', 'Ouallam', 'Say', 'Tahoua', 'Tanout', 'Tchiab', 'Tchintabaraden',
    'Tchirozerine', 'Tera', 'Tessaoua', 'Tillaberi', 'Zinder'],
};
var meningiteVar = {
    'pays':['deces', 'population', 'incidence'],
    'district':['cas', 'incidence', 'population']
};

var selection_geographique = {"benin":["district","pays"],
                              "burkina":["aire","district","pays"],
                              "mali":["district","pays"],
                              "senegal":["pays"]
                             };
var resoTemp = [['d','quotidien'],['w','hebdomadaire'], ['m','mensuel'], ['t','trimestriel']];
var map;
var fond;
var mapPanel;


var varInfos = {
    variables:[],
    debut:"",
    fin:""
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


function setForm(){
    //type capteur produit variable resospatiale level
    var selectSource1 = $("[id$='Sel']");
    createURL('', selectSource1[0]); //chargement du type1

    //choix du type
    selectSource1[0].onchange =  function(){
        resetSelect(selectSource1, 1);  //reinitialise les menus deroulants
        if (this.selectedIndex < 1)
            return; // absence de choix
        createURL(this.value, selectSource1[1]);  //charge les choix de capteur
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
        var urlInfo = ROOT + '/wms/' + listSelected.slice(0,ind).join('/') + '/' + fileName + '.nc?service=WMS&version=1.3.0&request=GetCapabilities';
        getDateRange(urlInfo);
        setSelect(varInfos.variables, selectSource1[5]);
        changeDates1(varInfos.debut,varInfos.fin,this.value);
        changeDates2(varInfos.debut,varInfos.fin,this.value);
        //dates debut/fin     
    };

    //Load pays
    for (var ps in selection_geographique) {
        pays.options[pays.options.length] = new Option(ps, ps);
    }
    
    //pays Changed
    pays.onchange = function () {
        var dist = selection_geographique[this.value];
        decoupage.length = 1; // remove all options bar first
        if (this.selectedIndex < 1){
            return; //done
        } else {   
            for (var i = 0; i< dist.length; i++) {
                decoupage.options[decoupage.options.length] = new Option(dist[i], dist[i]);
            }
        }
	};
}


function setFormInSitu(){
    $.each(mesures, function(i, item){
        $("#mesureIS").append($("<option></option>").attr("value", item).text(item));
    });
    $.each(epidemio, function(i, item){
        $("#epidemioEP").append($("<option></option>").attr("value", item).text(item));
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
        }else if($(this).val() == 'teom'){
            $("#niveauIS").prop("disabled", true);
            $.each(stationsTeom, function(i, item){
                $("#stationsIS").append($("<option></option>").attr("value", item).text(item));
            });
            $.each(variablesTeom, function(i, item){
                $("#variablesIS").append($("<option></option>").attr("value", item).text(item));
            });
            $.each(resoTempo[$(this).val()], function(i, item){
                $("#resoTempoIS").append($("<option></option>").attr("value", item).text(item));
            });
        }else{
            $("#niveauIS").prop("disabled", true);
            $.each(stationsMeteo, function(i, item){
                $("#stationsIS").append($("<option></option>").attr("value", item).text(item));
            });
            $.each(variablesMeteo, function(i, item){
                $("#variablesIS").append($("<option></option>").attr("value", item).text(item));
            });
            $.each(resoTempo[$(this).val()], function(i, item){
                $("#resoTempoIS").append($("<option></option>").attr("value", item).text(item));
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
}

function getDateRange(url){
    var lstvariables = [];
    $.ajax({
        type: "GET",
        url: url,
        dataType: "xml",
        async: false,
        success: function(xml) {
            $(xml).find('Layer[queryable="1"]').each(function(){
                lstvariables.push($(this).find("Name").first().text());
                var times = $(this).find('Dimension[name="time"]').text();
                var ldates = times.split(',');
                varInfos.variables = lstvariables;
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
            var d = $("#date1").datepicker('getDate', '+1d');
            d.setDate(d.getDate() + 1);
            $( "#date2" ).datepicker( "option", "minDate", d );
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
            var d = $("#date2").datepicker('getDate', '-1d');
            d.setDate(d.getDate() + 1);
            $( "#date1" ).datepicker( "option", "maxDate", d );
        },
    });
}


var urlPath = [];

function createURL(valueSelected, selector){
    var selectSource1 = $("[id$='Sel']");
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
    if (selector != ''){
        setSelect(titre, selector);
    }
}
// #######################################################################################


// ################## info layer selected ################################################




window.onload = function(){
    $('select').select2();
    setForm();
    setFormInSitu();
}
