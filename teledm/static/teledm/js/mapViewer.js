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
var domaines = [['01', 'domaine 01'], ['02', 'domaine 02']]

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




var map;
var fond;
var mapPanel;
var geojs = {
    mali:'',
};
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
    level:"",
    nomFichier:"",
    bbox:"",
    colorbar:"",
    scaleMin:"",
    scaleMax:"",
    bbox:'',
    colorbarBand:'',
    opacity:''
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
    variable: "",
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


function resetDate(){
    $("[id^='date']").datepicker('destroy');
    $("[id^='date']").val("");
}

$('#levelS1').prop('disabled', true);
function setForm(){
    //type capteur produit variable resospatiale level
    var selectSource1 = $("[id$='S1']");

    //chargement du type1
    createURL('', selectSource1[0]);

    //choix du type
    //selectSource1[0].onchange =  function(){
    $("#typeS1").on("change", function(){
        //reinitialise les menus deroulants
        resetSelect(selectSource1, 1);
        if (this.selectedIndex < 1)
            return; // absence de choix
        //charge les choix de capteur
        createURL(this.value, selectSource1[1]);
        });
    // choix du capteur
    $("#capteurS1").on("change", function(){
        //reinitialise les menus deroulants
        resetSelect(selectSource1, 2);
        if (this.selectedIndex < 1)
            return; // absence de choix
        //charge les choix de produit
        createURL(this.value, selectSource1[2]);
    });
    // choix du produit
    $("#produitS1").on("change", function(){
        //reinitialise les menus deroulants
        resetSelect(selectSource1, 3);
        if (this.selectedIndex < 1)
            return; // absence de choix
        //charge les choix de variables
        createURL(this.value, selectSource1[3]);
    });
    
    // choix de la resolution spatiale
    $("#resospatialeS1").on("change", function(){
        //reinitialise les menus deroulants suivants
        resetSelect(selectSource1, 4);
        if (this.selectedIndex < 1)
            return; // absence de choix
        //charge les choix de variables
        createURL(this.value, '');
        for (var i=0; i<resoTemp.length; ++i) {
            selectSource1[4].options[selectSource1[4].options.length] = new Option(resoTemp[i][1], resoTemp[i][0]);
            }
        });
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
        changeDates(varInfos.debut,varInfos.fin,this.value);
        $("#variableS1").on("change", function(){
            var id = $(this).prop('selectedIndex');            
            if (varInfos.variables.dims[id] != -1){
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


function changeDates(start,end,period){
    $("[id^='date']").datepicker('destroy');
    $( "[id^='date']" ).datepicker({
        yearRange: '1979:2025',
        dateFormat: 'yy-mm-dd',
        changeMonth: true,
        changeYear: true,
        showMonthAfterYear: true,
        defaultDate: new Date(start),
        minDate: new Date(start),
        maxDate: new Date (end),
    });
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
// #######################################################################################


// ################## info layer selected ################################################

function getInfos()
{
        //vide objet info précédente
    lstInfos.date="";
    lstInfos.param="";
    lstInfos.nomDataset="";
    lstInfos.capteur="",
    lstInfos.produit="",
    lstInfos.resspatiale="",
    lstInfos.restempo="",
    lstInfos.layer="",
    lstInfos.nomFichier="",
    lstInfos.bbox = "",
    lstInfos.colorbar="";
    lstInfos.scaleMin="";
    lstInfos.scaleMax="";
    lstInfos.colorbarBand='';
    lstInfos.opacity='';
    lstInfos.unit='';
    
        //Datasets
    var type = $('#typeS1').val();
    if(type=='Type de données')
    {
        
        alert("Erreur ! Aucun type de données sélectionné !");
        throw new Exception();
    }
    else
    {
        lstInfos.nomDataset = type;
    }
    
    var capteur = $('#capteurS1').val();
    if(capteur=='Capteur/Source')
    {
        
        alert("Erreur ! Aucune source de données sélectionnée !");
        throw new Exception();
    }
    else
    {
        lstInfos.capteur = capteur;
    }

    var produit = $('#produitS1').val();
    if(produit=='Produit')
    {
        
        alert("Erreur ! Aucun produit sélectionné !");
        throw new Exception();
    }
    else
    {
        lstInfos.produit = produit;
    }

    var resospatiale = $('#resospatialeS1').val();
    if(resospatiale=='Résolution spatiale')
    {
        
        alert("Erreur ! Aucune résolution spatiale sélectionnée !");
        throw new Exception();
    }
    else
    {
        lstInfos.resspatiale = resospatiale;
    }

    var restempo = $('#pasdetempsS1').val();
    if(restempo=='Résolution temporelle')
    {
        
        alert("Erreur ! Aucun type de données sélectionné !");
        throw new Exception();
    }
    else
    {
        lstInfos.restempo = restempo;
    }

    var layer = $('#variableS1').val();
    if(layer=='Variable')
    {
        
        alert("Erreur ! Aucune variable sélectionnée !");
        throw new Exception();
    }
    else
    {
        lstInfos.layer = layer;
    }

    var level = $('#levelS1').val();
    if((level=='Layer') & ($('#levelS1').is(':disabled') == false))
    {
        
        alert("Erreur ! Aucun niveau de couche sélectionné !");
        throw new Exception();
    }
    else
    {
        lstInfos.level = level;
    }
        //ScaleMin/ScaleMax :
    var scaleMinForm= $("input[name='scaleMin']").val();
    
        lstInfos.scaleMin=scaleMinForm;
    
    var scaleMaxForm= $("input[name='scaleMax']").val();
    
        lstInfos.scaleMax=scaleMaxForm;
    
    
        //Date
    var dateForm= $("input[id='date']").val();
    if(dateForm=='')
    {
        alert("Erreur ! Aucune date saisie !");
        throw new Exception();
    }
    else
    {
        if (lstInfos.restempo == 'w'){
            lstInfos.date = moment(dateForm).startOf('isoWeek').format('YYYY-MM-DD');
        }else if (lstInfos.restempo == 'm'){
            lstInfos.date = moment(dateForm).startOf('Month').format('YYYY-MM-DD');
        }else if (lstInfos.restempo == 't'){
            lstInfos.date = moment(dateForm).startOf('quarter').format('YYYY-MM-DD');
        }else{
            lstInfos.date=dateForm;
        }
        $("input[id='date']").val(lstInfos.date);
    }
    if (lstInfos.produit == 'seviri_aerus'){
        var nomFichier = "seviri_r" + resospatiale.replace('res','') + "_" + restempo + ".nc";
    }else if (lstInfos.produit == 'domaine01'){
        var nomFichier = "chimere01_r" + resospatiale.replace('res','') + "_" + restempo + ".nc";
    }else if (lstInfos.produit == 'domaine02'){
        var nomFichier = "chimere02_r" + resospatiale.replace('res','') + "_" + restempo + ".nc";
    }else{
        var nomFichier = produit + "_r" + resospatiale.replace('res','') + "_" + restempo + ".nc";
    }
    lstInfos.nomFichier = nomFichier;
    
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
    var paramForm = $("#variableS1 option:selected").text();
    if(lstInfos.paramForm==''){
        alert("Erreur ! Aucun paramètre selectionné !");
        throw new Exception();
    };
    lstInfos.param = paramForm;

}




//######################## animation map #############################################################

function nextDate()
{
    //forumlaire
    var period = $("#pasdetempsS1").val();
    var dateA = $("input[id='date']").val();
    //moment js
    var dateAM = moment.utc(dateA);
    if (period == 'w'){
        var periodM = moment.duration('P1W');
    }else if (period == 'm'){
       var periodM = moment.duration('P1M'); 
    }else if (period == 't'){
       var periodM = moment.duration(3, 'months'); 
    }else{
        var periodM = moment.duration('P1D');
    }
    //affichage
    var res = moment(dateAM).add(periodM);
    res = res.toISOString();
    $("input[id='date']").val(res);
    //$("#dateAnimation").html(res);
    if(typeof map.layers[1] =='undefined') //si pas de layer
    {
        majLayer();
    }
    else
    {
        map.layers[1].mergeNewParams({"TIME" : res})
    }
}


function prevDate()
{
    //forumlaire
    var period = $("#pasdetempsS1").val();
    var dateA = $("input[id='date']").val();
    //moment js
    var dateAM = moment.utc(dateA);
    if (period == 'w'){
        var periodM = moment.duration('P1W');
    }else if (period == 'm'){
       var periodM = moment.duration('P1M'); 
    }else if (period == 't'){
       var periodM = moment.duration(3, 'months'); 
    }else{
        var periodM = moment.duration('P1D');
    }
    //affichage
    var res = moment(dateAM).add(-1, period);
    res = res.toISOString();
    $("input[id='date']").val(res);
    //$("#dateD").html(res);
    if(typeof map.layers[1] =='undefined') //si pas de layer
    {
        majLayer();
    }
    else
    {
        map.layers[1].mergeNewParams({"TIME" : res})
    }
}

var requestID;   //ID de la requete d'animation
var fps = 1;
var running = true;  //variable d'execution

function setFPS()
{
    fps=2//$("select[name='vitesse'] option:selected").text();
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
//var bodyElement = document.querySelector("input[name='stop']");
//bodyElement.addEventListener("click", stopAnim, false);


function stopAnim(e)
{
    cancelAnimationFrame(requestID);
    $("#dateD").html("");
    running = false;
}
// #############################################################################################################



// ########################## get infoMap ######################################################################
// Info serie temporelle
function getInfosMapTemporel(e){
    var lonLat = map.getLonLatFromViewPortPx(e.xy);  //latitude/longitude du clic
    if(map.layers[1].name !== 'wms'){ //si pas de layers wms
        var errorPopup = new OpenLayers.Popup (
            "error",
            lonLat,
            new OpenLayers.Size(100, 50),
            "Pas de couche sélectionnée",
            true, //ajout un bouton "fermer la fenetre"
            null  //action apres close
            );
        errorPopup.autoSize = true;
        map.addPopup(errorPopup);
    }else{
        if(map.maxExtent.containsLonLat(lonLat)){
            var tempPopup = new OpenLayers.Popup (
                "temp",
                lonLat,
                new OpenLayers.Size(100, 50),
                "Loading...",
                true, //ajout un bouton "fermer la fenetre"
                null  //action apres close
			);
            var lonlat = map.getLonLatFromViewPortPx(e.xy);
            //mise a jour date
            var dateForm= $("input[id='date']").val();
            lstInfos.date=dateForm;
            if (lstInfos.level){
                var urlInfo = ROOT + "/ncss"
                    + "/" + lstInfos.nomDataset 
                    + "/" + lstInfos.capteur
                    + "/" + lstInfos.produit
                    + "/" + lstInfos.resspatiale
                    + "/" + lstInfos.nomFichier
                    + "?time_start="+ encodeURIComponent(varInfos.debut)
                    + "&time_end="+ encodeURIComponent(varInfos.fin)
                    + "&var="+ lstInfos.param
                    + "&elevation=" + lstInfos.level
                    + "&latitude=" + lonlat.lat
                    + "&longitude=" + lonlat.lon
                    + "&accept=csv"
                    ;       
            }else{
                var urlInfo = ROOT + "/ncss"
                    + "/" + lstInfos.nomDataset 
                    + "/" + lstInfos.capteur
                    + "/" + lstInfos.produit
                    + "/" + lstInfos.resspatiale
                    + "/" + lstInfos.nomFichier
                    + "?time_start="+ encodeURIComponent(varInfos.debut)
                    + "&time_end="+ encodeURIComponent(varInfos.fin)
                    + "&var="+ lstInfos.param
        
                    + "&latitude=" + lonlat.lat
                    + "&longitude=" + lonlat.lon
        
                    + "&accept=csv"
                    ;
                }
            console.log(urlInfo);
            $.ajax({
                type: "GET",
                url: urlInfo,
                dataType: "text",
                async: true,
                beforeSend: function(){
                    $("#plot").highcharts().showLoading();
                },
                complete: function(){
                    $("#plot").highcharts().hideLoading();
                },
                success: function(text) {
                    var lines = text.split('\n');
                    dataset.header = lstInfos.capteur + '_' + lstInfos.produit;
                    dataset.variable = '';
                    dataset.lon = '';
                    dataset.lat = '';
                    dataset.datas = [];
                    dataset.dates = [];
                    $.each(lines, function(lineNo, line){
                        var items = line.split(',');
                        if (lineNo != 0){
                            if (items[3] != undefined){
                                var dateISO = items[0].replace(/\D/g, " ")
                                var dateCompo = dateISO.split(" ");
                                dateCompo[1]--;
                                var dateUTC = Date.UTC(dateCompo[0], dateCompo[1], dateCompo[2]);
                                var tmp = [];
                                tmp.push(dateUTC, parseFloat(items[3]))
                                dataset.dates.push(items[0]);
                                dataset.datas.push(tmp);
                                dataset.lat = items[1];
                                dataset.lon = items[2];
                            }
                        }else{
                            dataset.variable = items[3];
                        }
                    });
                    updatePlot(dataset);
                },
                error: function(statut,erreur){
                }
            })
        }
    }//fin else
}

// info ponctuelle lat/lon/data
function getInfosMap(e){
    var lonLat = map.getLonLatFromViewPortPx(e.xy);  //latitude/longitude du clic
    if(map.layers[1].name !== 'wms'){ //si pas de layers wms
        var errorPopup = new OpenLayers.Popup (
            "error",
            lonLat,
            new OpenLayers.Size(100, 50),
            "Pas de couche sélectionnée",
            true, //ajout un bouton "fermer la fenetre"
            null  //action apres close
            );
        errorPopup.autoSize = true;
        map.addPopup(errorPopup);
    }else{
        if(map.maxExtent.containsLonLat(lonLat)){
            var tempPopup = new OpenLayers.Popup (
                "temp",
                lonLat,
                new OpenLayers.Size(100, 50),
                "Loading...",
                true, //ajout un bouton "fermer la fenetre"
                null  //action apres close
			);
            var lonlat = map.getLonLatFromViewPortPx(e.xy);
            //mise a jour date
            var dateForm= $("input[id='date']").val();
            lstInfos.date=dateForm;
            if (lstInfos.level){
                var URLRequest = 
                    ROOT+"/ncss/"
                    + lstInfos.nomDataset
                    + "/" + lstInfos.capteur
                    + "/" + lstInfos.produit
                    + "/" + lstInfos.resspatiale
                    + "/" + lstInfos.nomFichier
                    + "?time_start="+ encodeURIComponent(lstInfos.date)
                    + "&time_end="+ encodeURIComponent(lstInfos.date)
                    + "&var="+ lstInfos.param
                    + "&elevation=" + lstInfos.level
                    + "&latitude=" + lonlat.lat
                    + "&longitude=" + lonlat.lon
                    + "&accept=xml"
                    ;
            }else {
                var URLRequest = 
                    ROOT+"/ncss/"
                    + lstInfos.nomDataset
                    + "/" + lstInfos.capteur
                    + "/" + lstInfos.produit
                    + "/" + lstInfos.resspatiale
                    + "/" + lstInfos.nomFichier
                    + "?time_start="+ encodeURIComponent(lstInfos.date)
                    + "&time_end="+ encodeURIComponent(lstInfos.date)
                    + "&var="+ lstInfos.param
                    + "&latitude=" + lonlat.lat
                    + "&longitude=" + lonlat.lon
                    + "&accept=xml"
                    ;
            }
            $.ajax({
                type: "GET",
                url: URLRequest,
                dataType: "xml",
                async: false,
                success: function(xml) {
                    var lon = parseFloat($(xml).find('data[name="lon"]').text());
                    var lat = parseFloat($(xml).find('data[name="lat"]').text());
                    var val = parseFloat($(xml).find('data[name="'+lstInfos.param+'"]').text());
                    var res = "";
                    if (lon){
                        // We have a successful result
                        var truncVal = val.toPrecision(3);
                        if(truncVal > 200)  //Kelvin -> Celsius
                        {
                            //truncVal-=273,15
                        }
                        res = "Lon: "+ lon.toFixed(6) + 
                              " </br>Lat: " + lat.toFixed(6) +
        				   " </br>Value: " + truncVal;
                    } 
                    else{
                        res = "Impossible d'obtenir les informations demandées";
                    }
                    //map.removePopup(tempPopup);   //supprime le popup temporaire
                    var popup = new OpenLayers.Popup(
                        "id",
                        lonlat,
                        new OpenLayers.Size(200, 75),
                        res,
                        true,
                        null
                    );
                    popup.AutoSize = true;
                    map.addPopup(popup);
                },
                error: function(e){
                    console.log('error');
                }
            });
        }
    }//fin else
}


// ########################## add plots Profils ########################################################################

$("#addIS").on('click', function(e){
    e.preventDefault();
    if($("#mesureIS").val() == 'Type'){
        alert("Erreur ! Aucun type de mesure sélectionné !");
        throw new Exception();
    }
    if($("#stationIS").val() ==' Station'){
        alert("Erreur ! Aucune station de mesure sélectionnée !");
        throw new Exception();
    }
    if($("#variableIS").val() == 'Variable'){
        alert("Erreur ! Aucune variable sélectionnée !");
        throw new Exception();
    }
    if($("#resoTempoIS").val() == 'Resolution Temporelle'){
        alert("Erreur ! Aucune resolution tempoerlle sélectionnée !");
        throw new Exception();
    }
    var dictdata = $("#mesureIS,#niveauIS,#stationsIS,#variablesIS,#resoTempoIS").serialize();
    $.ajax({
        async: false,
        type: "POST",
        url: '',
        dataType: 'json',
        data: dictdata,
        beforeSend: function(xhr, settings) {
            xhr.setRequestHeader("X-CSRFToken", $.cookie('csrftoken'));
            $("#plot").highcharts().showLoading();
        },
        complete: function(){
            $("#plot").highcharts().hideLoading();
        },
        success: function(data){
            dataset.header = data.header;
            dataset.variable = data.varName;
            dataset.datas = [];
            dataset.dates = [];
            $.each(data.dates, function(dateNo, date){
                var tmp=[];
                var dateISO = date.replace(/\D/g, " ");
                var dateCompo = dateISO.split(" ");
                dateCompo[1]--;
                var dateUTC = Date.UTC(dateCompo[0], dateCompo[1], dateCompo[2],dateCompo[3], dateCompo[4], dateCompo[5]);
                tmp.push(dateUTC, parseFloat(data.datas[dateNo]));
                dataset.datas.push(tmp);
            });
            if(typeof $("#plot").highcharts().get(dataset.variable) == 'undefined'){
                $("#plot").highcharts().addAxis({
                    id: dataset.variable,
                    title: {
                        text: dataset.variable
                    },
                    lineWidth: 2,
                    //lineColor: '#08F',
                    opposite: true
                });
            }
            $("#plot").highcharts().addSeries({
                yAxis: dataset.variable,
                name: dataset.header+'_'+dataset.variable,
                data: dataset.datas,
                lineWidth: 1,
                //color: "#000000",
                marker: { fillColor: '#000000', radius: 2 }
            });
        },
        error : function(xhr,errmsg,err) {
            console.log('erreur: '+errmsg);
            console.log(xhr.status + ": " + xhr.responseText); // provide a bit more info about the error to the console
        }
    });
})



// fonction plot donnees epidemio
$("#addEP").on('click', function(e){
    e.preventDefault();
    if($("#epidemioEP").val() == 'Type'){
        alert("Erreur ! Aucun type de mesure sélectionné !");
        throw new Exception();
    }
    if($("#paysEP").val() ==' Pays'){
        alert("Erreur ! Aucun pays sélectionné !");
        throw new Exception();
    }
    if($("#echelle").val() == 'Echelle'){
        alert("Erreur ! Aucune echelle de découpage sélectionnée !");
        throw new Exception();
    }
    if( ($("#districtEP").prop("disabled") == false) & ($("#districtEP").val() == 'District')){
        alert("Erreur ! Aucun district sélectionné !");
        throw new Exception();
    }
    if($("#variableEP").val() == 'Variable'){
        alert("Erreur ! Aucune variable sélectionnée !");
        throw new Exception();
    }
    var dictdata = $("[id$='EP']").serialize();
    $.ajax({
        async: false,
        type: "POST",
        url: '',
        dataType: 'json',
        data: dictdata,
        beforeSend: function(xhr, settings) {
            xhr.setRequestHeader("X-CSRFToken", $.cookie('csrftoken'));
            $("#plot").highcharts().showLoading();
        },
        complete: function(){
            $("#plot").highcharts().hideLoading();
        },
        success: function(data){
            dataset.header = data.header;
            dataset.variable = data.varName;
            dataset.datas = [];
            dataset.dates = [];
            $.each(data.dates, function(dateNo, date){
                var tmp=[];
                var dateISO = date.replace(/\D/g, " ");
                var dateCompo = dateISO.split(" ");
                dateCompo[1]--;
                var dateUTC = Date.UTC(dateCompo[0], dateCompo[1], dateCompo[2],dateCompo[3], dateCompo[4], dateCompo[5]);
                tmp.push(dateUTC, parseFloat(data.datas[dateNo]));
                dataset.datas.push(tmp);
            });
            if(typeof $("#plot").highcharts().get(dataset.variable) == 'undefined'){
                $("#plot").highcharts().addAxis({
                    id: dataset.variable,
                    title: {
                        text: dataset.variable
                    },
                    lineWidth: 2,
                    //lineColor: '#08F',
                    opposite: true
                });
            }
            $("#plot").highcharts().addSeries({
                yAxis: dataset.variable,
                name: dataset.header+'_'+dataset.variable,
                data: dataset.datas,
                lineWidth: 1,
                //color: "#000000",
                marker: { fillColor: '#000000', radius: 2 }
            });
        },
        error : function(xhr,errmsg,err) {
            console.log('erreur: '+errmsg);
            console.log(xhr.status + ": " + xhr.responseText); // provide a bit more info about the error to the console
        }
    });
})



//Création du chart dans le div #containerProfil
//function initPlot(){
$('#plot').highcharts({
    chart:{
        type: 'spline',
        zoomType: 'xy',
    },
    credits:{
        enabled: false
    },
    title: {
        text: 'Profil temporel'
    },
    subtitle: {
        text: ''
    },
    legend: {
        enabled: true,
    },
    rangeSelector : {
        selected : 1
    },
    plotOptions: {
        series:{  
            pointInterval: 24*3600*1000
        },
    },        
    tooltip: {
        xDateFormat: '%d-%m-%Y',
        valueDecimals: 9
    },
    xAxis: {
        type: 'datetime',
    },
    yAxis: {
        title: {
            text: ''
        }
    },
    exporting:{
        enabled: true
    },
});


$("#containerProfil").hide();
$('#profil').click(function() {
    $(this).toggleClass("active");
    map.events.register('click', map, getInfosMapTemporel);
    map.events.unregister('click', map, getInfosMap);
    if($(this).hasClass('active')){
        setFormInSitu();
        while ($("#plot").highcharts().series.length !=0){
            for(var i=0; i < $("#plot").highcharts().series.length; i++){
                $("#plot").highcharts().series[i].remove(true);
            }
        }
        while ($("#plot").highcharts().yAxis.length != 0){
            for (var i=0; i < $("#plot").highcharts().yAxis.length; i++){
                $("#plot").highcharts().yAxis[i].remove(true);
            }
        }
        $("#containerProfil").show();
    }else{
        $("#containerProfil").hide();
        map.events.unregister('click', map, getInfosMapTemporel);
        map.events.register('click', map, getInfosMap);
        $("[id$='IS']").find("option:gt(0)").remove();
        $("#niveauIS").prop("disabled", false);
        $("[id$='EP']").find("option:gt(0)").remove();
        $("#districtEP").prop("disabled", false);
    }
});



$("#download").on('click', function(){
    //Récupère les infos saisies par l'utilisateur
    try
    {
    getInfos();
    }
    catch(e)
    {
        return null;
    }
    var URL = ROOT+ "/ncss/" +
        lstInfos.nomDataset +
        "/" + lstInfos.capteur +
        "/" + lstInfos.produit +
        "/" + lstInfos.resspatiale +
        "/" + lstInfos.nomFichier +
        "?var=" + lstInfos.layer +
        "&north=" + $("#uly").val() +
        "&west=" + $("#ulx").val() +
        "&east="+ $("#lrx").val() +
        "&south=" + $("#lry").val() +
        "&horizStride=" + 1 +
        "&time_start=" + varInfos.debut +
        "&time_end=" + varInfos.fin + 
        "&timeStride=" + 1 +
        "&addLatLon=true" + 
        "&accept=netcdf";
    console.log(URL);
    var link = document.createElement("a");
    link.download = 'test.nc';
    link.href = URL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    delete link;
});




function updatePlot(datas){
    if(typeof $("#plot").highcharts().get(datas.variable) == 'undefined'){
        $("#plot").highcharts().addAxis({
            id: datas.variable,
            title: {
                text: datas.variable
            },
            lineWidth: 2,
            opposite: true
        });
    }
    $("#plot").highcharts().setTitle({ text: "Periode du "+datas.dates[0]+" au "+datas.dates[datas.dates.length-1] }, { text: "Longitude: "+datas.lon+", Latitude: "+datas.lat });
    $("#plot").highcharts().addSeries({
        name: datas.header,
        data: datas.datas,
        lineWidth: 1,
        //color: "#000000",
        marker: { fillColor: '#000000', radius: 2 }
    });
    //$("#plot").highcharts().redraw();
}


// #############################################################################################################

// ################################################ map init update ############################################
function layerInfo(l){
    var coords = l.geometry.getBounds();
    $("#ulx").val(coords.left);
    $("#lry").val(coords.bottom);
    $("#lrx").val(coords.right);
    $("#uly").val(coords.top);
}


function onPopupClose(evt) {
    selectControl.unselect(selectedFeature);
}

function onFeatureSelect(feature) {
    selectedFeature = feature;
    popup = new OpenLayers.Popup.FramedCloud("chicken",
    feature.geometry.getBounds().getCenterLonLat(),
    new OpenLayers.Size(100, 100),
        "<h5>" + feature.attributes.name + "</h5>",
    null, true, onPopupClose);

    feature.popup = popup;
    //map.addPopup(popup);
    map.addPopup(popup, true);

}

function onFeatureUnselect(feature) {
    map.removePopup(feature.popup);
    feature.popup.destroy();
    feature.popup = null;
}


function functionsActivation(){
    selectControl.activate();
    map.events.unregister('click', map, getInfosMap);
    map.events.unregister('click', map, getInfosMapTemporel);      
}

function functionsDeactivation(){
    selectControl.deactivate();
    if($("#profil").hasClass('active')){
        map.events.register('click', map, getInfosMapTemporel);
    }else{
        map.events.register('click', map, getInfosMap);
    }   
}


function initMap(){

    //#######################################
    // carto, fond carto initial
    //#######################################
    map = new OpenLayers.Map('map',{
        controls: [],
        projection: new OpenLayers.Projection("EPSG:4326"),
        restrictedExtent: [-180, -90, 180, 90],
        maxResolution: 0.4,
        minResolution: 0.001,
    });
    fond = new OpenLayers.Layer.WMS(
        "OSM",
        "http://vmap0.tiles.osgeo.org/wms/vmap0",
        {layers: 'basic',
        isBaseLayer: true}
    );
    map.addLayer(fond);
    map.zoomToMaxExtent();
    
    
    
    //#######################################
    // ajout des carto district, aires, pays
    //#######################################
    $.each(geoDist, function(i,g){
        var shp = new OpenLayers.Layer.Vector(g, {
            strategies: [new OpenLayers.Strategy.Fixed()],
            protocol: new OpenLayers.Protocol.HTTP({
                url: urlShp + "/" + g + ".geojson",
                format: new OpenLayers.Format.GeoJSON()
            }),
            style: {
                strokeColor: '#000000',
                strokeOpacity: 1,
                strokeWidth: 1,
                fillOpacity: 0.,
            }
        });
        shp.setVisibility(false);
        map.addLayer(shp);
    });

    var stt = new OpenLayers.Layer.Vector("stations", {
        strategies: [new OpenLayers.Strategy.Fixed()],
        protocol: new OpenLayers.Protocol.HTTP({
            url: urlShp + "/stations.geojson",
            format: new OpenLayers.Format.GeoJSON()
        }),
        style: {
            'pointRadius': 2,
        }
    });
    stt.setVisibility(false);
    map.addLayer(stt);
    
    
    //##############################################
    // outils carto(fonction+boutton) panel + zoom + navigation + selectInfo
    //##############################################
    var panel = new OpenLayers.Control.Panel({displayClass: 'panel', allowDepress: false});
    var navigation = new OpenLayers.Control.Navigation();
    var zoomBox = new OpenLayers.Control.ZoomBox();
    var selectControl = new OpenLayers.Control.SelectFeature([map.layers[1],map.layers[2],map.layers[3],map.layers[4],map.layers[5]], {
        onSelect: onFeatureSelect,
        onUnselect: onFeatureUnselect,
    });
    // fonctions de selection des features, affichage dans une popup
    function onFeatureSelect(feature){
        selectedFeature = feature;
        popup = new OpenLayers.Popup.FramedCloud("chicken",
        feature.geometry.getBounds().getCenterLonLat(),
        new OpenLayers.Size(100, 100),
            "<h5>" + feature.attributes.name + "</h5>",
        null, true, function() { selectControl.unselectAll(); });
        feature.popup = popup;
        map.addPopup(popup, true);
    }
    function onFeatureUnselect(feature){
        map.removePopup(feature.popup);
        feature.popup.destroy();
        feature.popup = null;
    }
    
    var navigationBtn = new OpenLayers.Control.Button({displayClass: 'olControlNavigation', type: OpenLayers.Control.TYPE_TOOL,
        eventListeners: {
           'activate': function(){navigation.activate(); selectControl.deactivate(); zoomBox.deactivate();}, 
           'deactivate': function(){navigation.deactivate()}
        }
    });
    var zoomBoxBtn = new OpenLayers.Control.Button({displayClass: 'olControlZoomBox', type: OpenLayers.Control.TYPE_TOOL,
        eventListeners: {
           'activate': function(){zoomBox.activate(); navigation.deactivate(); selectControl.deactivate()}, 
           'deactivate': function(){zoomBox.deactivate()}
        }
    });
    var featureSelectBtn = new OpenLayers.Control.Button({displayClass: 'selectControl', type: OpenLayers.Control.TYPE_TOOL,
        eventListeners: {
           'activate': function(){selectControl.activate(); zoomBox.deactivate();selectControl.activate(); map.events.unregister('click', map, getInfosMap); map.events.unregister('click', map, getInfosMapTemporel);   }, 
           'deactivate': function(){selectControl.deactivate();if($("#profil").hasClass('active')){
                                                                    map.events.register('click', map, getInfosMapTemporel);
                                                                }else{
                                                                    map.events.register('click', map, getInfosMap);
                                                                }}
        }
    });
    
    
    panel.addControls([navigationBtn, zoomBoxBtn, featureSelectBtn]);
    map.addControls([panel,navigation,zoomBox,selectControl]);
    map.addControl(new OpenLayers.Control.MousePosition({prefix: 'Lon/Lat: ',separator: ', ',numDigits: 2,emptyString: ''}));
    map.addControl(new OpenLayers.Control.LayerSwitcher({'ascending':false}));
    //map.addControl(new OpenLayers.Control.PanZoom());
    navigation.activate();
    
    
    //######################################################
    // creation couche pour recuperer la bbox pour l'export 
    //######################################################
    var polygon = new OpenLayers.Layer.Vector('Polygon', {'displayInLayerSwitcher':false});
    polygon.setVisibility(true);
    map.addLayer(polygon);
    var polygonEditor = new OpenLayers.Control.DrawFeature(polygon, OpenLayers.Handler.RegularPolygon, {handlerOptions: {persist: true, snapAngle: 45.0},featureAdded: layerInfo,});
    map.addControl(polygonEditor);
    polygonEditor.handler.callbacks.create = function(data){
        if ( polygon.features.length > 0 ){
            polygon.removeAllFeatures();
        }
    };
        
        
    //##############################################
    // activation de l'interrogation du raster 
    map.events.register('click', map, getInfosMap);
    $('#export').click(function() {
        $(this).toggleClass("active");
        
        if($(this).hasClass('active')){
            $("#containerExport").show();
            
            polygonEditor.activate();
        }else{
            //map.removeControl(polygonEditor);
            polygonEditor.deactivate();
            polygon.removeAllFeatures();
            $("#containerExport").hide();
            $("#ulx").val("");
            $("#uly").val("");
            $("#lrx").val("");
            $("#lry").val("");
        }
    });
}


$("#containerExport").hide();


function majLayer(){
    //Récupère les infos saisies par l'utilisateur
    try
    {
    getInfos();
    }
    catch(e)
    {
        return null;
    }
    autoScale();
    setMinMax();//met a jour les valeurs min max du colorbar présent sur la carte
    //setDescLayer();  //mise a jour description du layer
    //pour tout les dataset selectionnés : générer l'URL à parser
    if (lstInfos.level){
        var URL = ROOT+ "/wms/" +
            lstInfos.nomDataset +
            "/" + lstInfos.capteur +
            "/" + lstInfos.produit +
            "/" + lstInfos.resspatiale +
            "/" + lstInfos.nomFichier +
            "?service=WMS&" +
            "version=1.3.0" +
            "&request=GetMap&CRS="+encodeURIComponent("CRS:84") +
            "&LAYERS=" + lstInfos.param +
            "&elevation=" +lstInfos.level + 
            "&TRANSPARENT=true&FORMAT=image%2Fpng" +
            "&SRS=EPSG";
    } else{
        var URL = ROOT+ "/wms/" +
            lstInfos.nomDataset +
            "/" + lstInfos.capteur +
            "/" + lstInfos.produit +
            "/" + lstInfos.resspatiale +
            "/" + lstInfos.nomFichier +
            "?service=WMS&" +
            "version=1.3.0" +
            "&request=GetMap&CRS="+encodeURIComponent("CRS:84") +
            "&LAYERS=" + lstInfos.param +
            "&TRANSPARENT=true&FORMAT=image%2Fpng" +
            "&SRS=EPSG";
    }
    csr = lstInfos.scaleMin+","+lstInfos.scaleMax;
    style = "boxfill/"+lstInfos.colorbar;
    console.log('csr' + lstInfos.scaleMin);
    if (typeof map.layers[1] !== 'undefined'){
        if (map.layers[1].name == 'wms'){
            map.removeLayer(map.layers[1])
        }
    }
    if($("#plot").highcharts().series.length !=0){
        $("#plot").highcharts().series[0].remove(true);
    }
    alert(lstInfos.level);
    var wms = new OpenLayers.Layer.WMS(
        "wms",
        URL,
        {
            layers: "",
            transparent: "true",
            format: "image/png",
            styles: "boxfill/rainbow",
            colorscalerange: csr,
            time:lstInfos.date,
            numcolorbands : $("select[name='colorbandNum']").val(),
            opacity : "100" //lstInfos.opacity
            },
        {isBaseLayer: false},
    );
    map.addLayer(wms);
    map.setLayerIndex(wms, 1);
}


function updateMap()
{
    majLayer();
    majLayer();
}


// #############################################################################################################


// ###################################################set scale colorbar minmax ################################

function autoScale()
{
    //getInfos();
    console.log(lstInfos);
    if (lstInfos.level){
        var URLRequest = 
            ROOT+"/wms/"
            + lstInfos.nomDataset
            + "/" + lstInfos.capteur
            + "/" + lstInfos.produit
            + "/" + lstInfos.resspatiale
            + "/" + lstInfos.nomFichier
            + "?item=minmax"
            + "&LAYERS="+ lstInfos.param
            + "&elevation=" + lstInfos.level
            + "&TIME=" + encodeURIComponent(lstInfos.date)
            + "&SRS=EPSG%3A4326"
            + "&CRS=EPSG%3A4326"
            + "&REQUEST=GetMetadata"
            + "&service=WMS"
            + "&version=1.3.0"
            + "&BBOX=-25,-0.3,57,51"
            + "&WIDTH=50"
            + "&HEIGHT=50"
            ;
    }else{
        var URLRequest = 
        ROOT+"/wms/"
        + lstInfos.nomDataset
        + "/" + lstInfos.capteur
        + "/" + lstInfos.produit
        + "/" + lstInfos.resspatiale
        + "/" + lstInfos.nomFichier
        + "?item=minmax"
        + "&LAYERS="+ lstInfos.param
        + "&TIME=" + encodeURIComponent(lstInfos.date)
        + "&SRS=EPSG%3A4326"
        + "&CRS=EPSG%3A4326"
        + "&REQUEST=GetMetadata"
        + "&service=WMS"
        + "&version=1.3.0"
        + "&BBOX=-25,-0.3,57,51"
        + "&WIDTH=50"
        + "&HEIGHT=50"
        ;        
    }
    $.ajax({
        type: "GET",
        url: URLRequest,
        dataType: "JSON",
        async: false,
        success: function(json) 
        {
            $("input[name='scaleMin']").val(json.min);
            $("input[name='scaleMax']").val(json.max);
                if(((lstInfos.param=='tasmin')||(lstInfos.param=='tasmax'))&&(json.min>200))
                {
                    lstInfos.unit="K";
                };
        },
        error: function(request, status, error){
            console.log(error);
        }
    });
}



function setColorbar()
{
    var nomColorbar = $("#Colorbar").val();
    var nbColorband = $("select[name='colorbandNum']").val();
    var src_img = ROOT + "/wms/satellite/modis/MYD07/res009/MYD07_r009_d.nc?REQUEST=GetLegendGraphic&LAYER=Surface_Temperature&NUMCOLORBANDS=" + nbColorband + "&PALETTE=" + nomColorbar + "&COLORBARONLY=true"
    var img = "<img height='200px' width='50px' src='"+ ROOT + "/wms/satellite/modis/MYD07/res009/MYD07_r009_d.nc?REQUEST=GetLegendGraphic&LAYER=Surface_Temperature&NUMCOLORBANDS" + nbColorband + "&PALETTE=" + nomColorbar + "&COLORBARONLY=true'/>";
    $("#colorbar").html(img);
    var layers = map.layers;
    if(typeof map.layers[1] !== 'undefined' && map.layers[1].name == 'wms')    //si il existe déja un layer
    {   
        map.layers[1].params.STYLES = "boxfill/"+nomColorbar;         //modifier la colorbar
        map.layers[1].redraw(true);
    }
}

function setColorband(){
    var nomColorbar = $("#Colorbar").val();
    var nbColorband = $("select[name='colorbandNum']").val();
    var src_img = ROOT + "/wms/satellite/modis/MYD07/res009/MYD07_r009_d.nc?REQUEST=GetLegendGraphic&LAYER=Surface_Temperature&NUMCOLORBANDS" + nbColorband + "&PALETTE=" + nomColorbar + "&COLORBARONLY=true"
    var img = "<img height='200px' width='50px' marging='100px' padding='0px' src='"+ ROOT + "/wms/satellite/modis/MYD07/res009/MYD07_r009_d.nc?REQUEST=GetLegendGraphic&LAYER=Surface_Temperature&NUMCOLORBANDS" + nbColorband + "&PALETTE=" + nomColorbar + "&COLORBARONLY=true'/>";
    $("#colorbar").html(img);
    if(typeof map.layers[1] !== 'undefined' && map.layers[1] == 'wms'){    //si il existe déja un layer
        map.layers[1].params.NUMCOLORBANDS = nbColorband;
        map.layers[1].redraw(true);   //actualise la map
    }	
}

function setMinMax(){
	if(lstInfos.unit=='K'){
        	lstInfos.scaleMin -=272,15;
		lstInfos.scaleMax -=272,15;
	}
	var min = parseFloat(lstInfos.scaleMin);
	var max = parseFloat(lstInfos.scaleMax);
	var smid = (min + max) /2;
	var smidmax = (max+smid)/2;
	var smidmin = (min+smid)/2;
	
	//Extremes
	$("#smin").html(parseFloat(lstInfos.scaleMin).toPrecision(3));	
	$("#smax").html(parseFloat(lstInfos.scaleMax).toPrecision(3));	
	//Tiers
	$("#smidmax").html(smidmax.toPrecision(3));	
	$("#smidmin").html(smidmin.toPrecision(3));	
	//Milieu
	$("#smid").html(smid.toPrecision(3));
	
}
// #############################################################################################################



// #############################################################################################################
window.onload = function(){
    $('select').select2();
    setForm();
    initMap();
    //initPlot();
    setColorbar();
}
