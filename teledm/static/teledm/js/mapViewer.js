var resoTemp = [['d','quotidien'],['w','hebdomadaire'], ['m','mensuel'], ['t','trimestriel']];
var geoDist = ['niger_district_sante', 'mali_district_sante','burkina_aire_sante', 'burkina_district_sante',];
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
        getDateRange(urlInfo);
        setSelect(varInfos.variables, selectSource1[5]);
        changeDates(varInfos.debut,varInfos.fin,this.value);
        //dates debut/fin     
    };
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


function changeDates(start,end,period){
    $('#date').datepicker('destroy');
    $( "#date" ).datepicker({
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

    var level = $('#levelS1').val();
    if(level=='layer')
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

function getInfosMap1(e){
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
    }
    else
    {
        if(map.maxExtent.containsLonLat(lonLat))
        {
            var tempPopup = new OpenLayers.Popup (
                "temp",
                lonLat,
                new OpenLayers.Size(100, 50),
                "Loading...",
                true, //ajout un bouton "fermer la fenetre"
                null  //action apres close
			);
			//tempPopup.autoSize = true;
			//map.addPopup(tempPopup);
            var lonlat = map.getLonLatFromViewPortPx(e.xy);
            //mise a jour date
            var dateForm= $("input[id='date']").val();
            lstInfos.date=dateForm;
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
            $.ajax({
                type: "GET",
                url: URLRequest,
                dataType: "xml",
                async: false,
                success: function(xml) 
                {
                    var lon = parseFloat($(xml).find('data[name="lon"]').text());
                    var lat = parseFloat($(xml).find('data[name="lat"]').text());
                    var val = parseFloat($(xml).find('data[name="'+lstInfos.param+'"]').text());
                    var res = "";
                    if (lon) 
                    {
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
                    else 
                    {
                        res = "Impossible d'obtenir les informations demandées";
                    }
                    //map.removePopup(tempPopup);   //supprime le popup temporaire
                    
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
                    console.log(urlInfo);
                    $.ajax({
                        type: "GET",
                        url: urlInfo,
                        dataType: "text",
                        async: true,
                        beforeSend: function(){
                            $("#container").highcharts().showLoading();
                        },
                        complete: function(){
                            $("#container").highcharts().hideLoading();
                        },
                        success: function(text) {
                            var lines = text.split('\n');
                            dataset.header = '';
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
                                    dataset.header = items[3];
                                }
                            });
                            console.log(dataset.dates);
                            console.log(dataset.lon);
                            console.log(dataset.header);
                            updatePlot(dataset);
                        },
                        error: function(res,statut,erreur){
                        }
                    })
                    //plotSerie(dataset, lonlat);
                },
                error: function(request, status, error){
                    console.log(error);
                }
            });
        }
    }//fin else
}


function updatePlot(datas){
    if($("#container").highcharts().series.length !=0){
        $("#container").highcharts().series[0].remove(true);
    }
    $("#container").highcharts().setTitle({ text: "Periode du: "+datas.dates[0]+" au :"+datas.dates[datas.dates.length-1] }, { text: "Longitude: "+datas.lon+", Latitude: "+datas.lat });
    $("#container").highcharts().addSeries({
        name: datas.header,
        data: datas.datas,
        lineWidth: 1,
        color: "#000000",
        marker: { fillColor: '#000000', radius: 2 }
    });
    $("#container").highcharts().redraw();
}


function getInfosMap2(e){
    console.log('ok');
    var lonLat = map.getLonLatFromViewPortPx(e.xy);  //latitude/longitude du clic
    if(map.layers[1].name !== 'wms')  //si pas de layers
    {
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
    }
    else
    {
        console.log('ok');
        if(map.maxExtent.containsLonLat(lonLat))
        {
            var tempPopup = new OpenLayers.Popup (
                "temp",
                lonLat,
                new OpenLayers.Size(100, 50),
                "Loading...",
                true, //ajout un bouton "fermer la fenetre"
                null  //action apres close
			);
			//tempPopup.autoSize = true;
			//map.addPopup(tempPopup);
            var lonlat = map.getLonLatFromViewPortPx(e.xy);
            //mise a jour date
            var dateForm= $("input[id='date']").val();
            lstInfos.date=dateForm;
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
            $.ajax({
                type: "GET",
                url: URLRequest,
                dataType: "xml",
                async: false,
                success: function(xml) 
                {
                    var lon = parseFloat($(xml).find('data[name="lon"]').text());
                    var lat = parseFloat($(xml).find('data[name="lat"]').text());
                    var val = parseFloat($(xml).find('data[name="'+lstInfos.param+'"]').text());
                    var res = "";
                    if (lon) 
                    {
                        // We have a successful result
                        var truncVal = val.toPrecision(3);
                        if(truncVal > 200)  //Kelvin -> Celsius
                        {
                            truncVal-=273,15
                        }
                        res = "Lon: "+ lon.toFixed(6) + 
                              " </br>Lat: " + lat.toFixed(6) +
        				   " </br>Value: " + truncVal;
                    } 
                    else 
                    {
                        res = "Impossible d'obtenir les informations demandées";
                    }
                    //map.removePopup(tempPopup);   //supprime le popup temporaire
                    var popup = new OpenLayers.Popup (
                        "id", // TODO: does this need to be unique?
                        lonLat,
                        new OpenLayers.Size(100, 50),
                        res,
                        true, //bouton fermer
                        null  //action additionnel du bouton fermer
                    );
                    popup.autoSize = true;
                    map.addPopup(popup);
                },
                error: function(request, status, error){
                    console.log(error);
                }
            });
        }
    }//fin else
}


//Création du chart dans le div #container
$('#container').highcharts({
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
            text: dataset.header
        }
    },
    series: [{
        lineWidth: 1,
        color: "#000000"
    }],
    exporting:{
        enabled: true
    },
});


$("#container").hide();
$('#btn').click(function() {
    $(this).toggleClass("active");
    if($(this).hasClass('active')){
        var getInfosMap = getInfosMap1;
        if($("#container").highcharts().series.length !=0){
            $("#container").highcharts().series[0].remove(true);
        }
        $("#container").show();
    }else{
        $("#container").hide();
        //var getInfosMap = getInfosMap2;
    }
});


// #############################################################################################################

// ################################################ map init update ############################################
function layerInfo(l){
        alert(l.geometry.getBounds());
    }


function drawPolygon(){
    var polygon = new OpenLayers.Layer.Vector('Polygon', {'displayInLayerSwitcher':false});
    polygon.setVisibility(true);
    map.addLayer(polygon);
    var polygonEditor = new OpenLayers.Control.DrawFeature(polygon, OpenLayers.Handler.RegularPolygon, {callbacks: {done: function(){console.log('ok')}},
                                                                                                        handlerOptions: {persist: true},
                                                                                                        featureAdded: layerInfo,
                                                                                                        });
    polygonEditor.events.register('FeatureAdded', polygonEditor);
    polygonEditor.events.register('refresh', polygonEditor, function(){polygon.removeAllFeatures()});
    map.addControl(polygonEditor);
    polygonEditor.events.on({
        featuresadded: function(l){console.log(l.geometry.getBounds());}
    });
    var _draw = new OpenLayers.Control.Button({
        displayClass: 'draw',
        type: OpenLayers.Control.TYPE_TOGGLE,
        eventListeners: {
            'activate': function(){
                polygonEditor.activate();
            },
            'deactivate': function(){
                polygonEditor.deactivate();
                polygon.removeAllFeatures();
            }
        },
    });
    return(_draw);
}


function initMap(){

    map = new OpenLayers.Map('map',{
        projection: new OpenLayers.Projection("EPSG:4326"),
        //resolutions: [0.001, 0.005, 0.01, 0.02, 0.03, 0.09, 0.15, 0.4],
        restrictedExtent: [-180, -90, 180, 90],
        maxResolution: 0.4,
        minResolution: 0.001,
    });
    var panel = new OpenLayers.Control.Panel({displayClass: 'panel'});
    map.addControl(panel);
    var controls = [
            //new OpenLayers.Control.Attribution(),
            new OpenLayers.Control.LayerSwitcher({'ascending':false}),
            //new OpenLayers.Control.ScaleLine(),
            //new OpenLayers.Control.MousePosition({prefix: 'Lon/Lat: ',separator: ', ',numDigits: 2,emptyString: ''}),
            //new OpenLayers.Control.OverviewMap(),
            new OpenLayers.Control.KeyboardDefaults(),
            new OpenLayers.Control.SelectFeature(),
    ];
    panel.addControls(controls);
    

    //fond = new OpenLayers.Layer.Stamen("terrain",{layers:"basic"}, {isBaseLayer: true});
    fond = new OpenLayers.Layer.WMS(
        "OSM",
        "http://vmap0.tiles.osgeo.org/wms/vmap0",
        {layers: 'basic',
        isBaseLayer: true}
    );
    map.addLayer(fond);


    // ajout des layers districts,aires de santé pour chaque pays
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

    selectControl = new OpenLayers.Control.SelectFeature([map.layers[1],map.layers[2],map.layers[3],map.layers[4],map.layers[5]], {
        onSelect: onFeatureSelect,
        onUnselect: onFeatureUnselect,
    });
    map.addControl(selectControl);
    selectControl.activate();
    

    // dessin carré pour coordonnees
    var draw = drawPolygon();
    panel.addControls(draw);
    

    
    // Activate the control.
    //
    map.zoomToMaxExtent();
    //map.events.register('click', map, getInfosMap1);
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
    setMinMax(); //met a jour les valeurs min max du colorbar présent sur la carte
    //setDescLayer();  //mise a jour description du layer
    //pour tout les dataset selectionnés : générer l'URL à parser
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
       
        csr = lstInfos.scaleMin+","+lstInfos.scaleMax;
        style = "boxfill/"+lstInfos.colorbar;
    if (typeof map.layers[1] !== 'undefined'){
        if (map.layers[1].name == 'wms'){
            map.removeLayer(map.layers[1])
        }
    }
    if($("#container").highcharts().series.length !=0){
        $("#container").highcharts().series[0].remove(true);
    }
    var wms = new OpenLayers.Layer.WMS(
        "wms",
        URL,
        {
            layers: "Deep_Blue_Aerosol_Optical_Depth_550_Land",
            transparent: "true",
            format: "image/png",
            styles: "boxfill/rainbow",
            colorscalerange: csr,
            time:lstInfos.date,
            numcolorbands : $("select[name='colorbandNum']").val(),
            opacity : "100" //lstInfos.opacity
            },
        {isBaseLayer: false}
    );
    map.addLayer(wms);
    map.setLayerIndex(wms, 1);
}


function updateMap()
{
    majLayer();
}



// #############################################################################################################


// ###################################################set scale colorbar minmax ################################

function autoScale()
{
    getInfos();
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
    var src_img = "http://localhost:8080/thredds/wms/satellite/modis/MYD07/res009/MYD07_r009_d.nc?REQUEST=GetLegendGraphic&LAYER=Surface_Temperature&NUMCOLORBANDS=" + nbColorband + "&PALETTE=" + nomColorbar + "&COLORBARONLY=true"
    var img = "<img height='200px' width='50px' src='http://localhost:8080/thredds/wms/satellite/modis/MYD07/res009/MYD07_r009_d.nc?REQUEST=GetLegendGraphic&LAYER=Surface_Temperature&NUMCOLORBANDS" + nbColorband + "&PALETTE=" + nomColorbar + "&COLORBARONLY=true'/>";
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
    var src_img = "http://localhost:8080/thredds/wms/satellite/modis/MYD07/res009/MYD07_r009_d.nc?REQUEST=GetLegendGraphic&LAYER=Surface_Temperature&NUMCOLORBANDS" + nbColorband + "&PALETTE=" + nomColorbar + "&COLORBARONLY=true"
    var img = "<img height='200px' width='50px' marging='100px' padding='0px' src='http://localhost:8080/thredds/wms/satellite/modis/MYD07/res009/MYD07_r009_d.nc?REQUEST=GetLegendGraphic&LAYER=Surface_Temperature&NUMCOLORBANDS" + nbColorband + "&PALETTE=" + nomColorbar + "&COLORBARONLY=true'/>";
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
    setColorbar();
}