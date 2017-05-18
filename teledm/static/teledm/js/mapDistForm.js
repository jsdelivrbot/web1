var map;
var fond;
var mapPanel;
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
    $('#levelSel').prop('disabled', true);
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

$('#levelSel').prop('disabled', true);
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
    $("#pasdetempsSel").on("change", function(){
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
        $("#variableSel").on("change", function(){
            var id = $(this).prop('selectedIndex');            
            if (($("#capteurSel").val() == "chimere") | ($("#capteurSel").val() == "wrf")){
                $("#levelSel").prop("disabled", false);
                $.each(varInfos.variables.dims[id], function (i, item) {
                    $('#levelSel').append($('<option>', { 
                        value: item,
                        text : item 
                    }));
                });
            }
        });
        //dates debut/fin     
    });

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
// #######################################################################################


// ################## info layer selected ################################################




window.onload = function(){
    $('select').select2();
    setForm();
    setFormInSitu();
}
