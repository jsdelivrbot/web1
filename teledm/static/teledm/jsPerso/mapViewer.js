const ROOT = "http://localhost:8080/thredds";
var resoTemp = [['d','quotidien'],['w','hebdomadaire'], ['m','mensuel'], ['t','trimestriel']];
var map;
var fond;
var mapPanel;

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
        console.log(urlInfo);
        var listVariables = [];
        var dictVarDate = [];
        var debut = [];
        var fin = [];
        //$.each(urlPath, function(value){
        $.ajax({
            type: "GET",
            url: urlInfo,
            dataType: "xml",
            async: false,
            success: function(xml) {
                $(xml).find('Layer[queryable="1"]').each(function(){
                    listVariables.push($(this).find("Name").first().text());
                    var times = $(this).find('Dimension[name="time"]').text();
                    var ldates = times.split(',');
                    debut = ldates[1];
                    fin = ldates[ldates.length-1];
                })
            }
        })
        setSelect(listVariables, selectSource1[5]);
        changeDates1(debut,fin);
        //dates debut/fin     
    };
}

function changeDates1(start,end){
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
    if(restempo=='Résolution temoprelle')
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
        lstInfos.date=dateForm;
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

function nextDate()
{
    //forumlaire
    //var period = $("select[name='usrPeriod']").val();
    var dateA = $("input[id='date']").val();
    //moment js
    var dateAM = moment.utc(dateA);
    var periodM = moment.duration('P1D');
    //affichage
    var res = moment(dateAM).add(periodM);
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


function prevDate()
{
    //forumlaire
    //var period = $("select[name='usrPeriod']").val();
    var dateA = $("input[id='date']").val();
    //moment js
    var dateAM = moment.utc(dateA);
    //var periodM = moment.duration('P1D');
    //affichage
    var res = moment(dateAM).add(-1, 'days');
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

function handler(request) {
    // if the response was XML, try the parsed doc
    //alert(request.responseXML);
    // otherwise, you've got the response text
    if (request.status == 200){
        alert(request.responseXML);
        alert(request.getAllResponseHeaders());
    }
    else {
        alert('Echec de la connexion');
    }
}



function getInfosMap1(e)
{
    var lonLat = map.getLonLatFromViewPortPx(e.xy);  //latitude/longitude du clic
    if(typeof map.layers[1] =='undefined')  //si pas de layers
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
                    $(function () {
                        $('#popupContainer').highcharts({
                            chart: {
                                type: 'spline'
                            },
                            title: {
                                text: 'Snow depth at Vikjafjellet, Norway'
                            },
                            subtitle: {
                                text: 'Irregular time data in Highcharts JS'
                            },
                            xAxis: {
                                type: 'datetime',
                                dateTimeLabelFormats: { // don't display the dummy year
                                    month: '%e. %b',
                                    year: '%b'
                                },
                                title: {
                                    text: 'Date'
                                }
                            },
                            yAxis: {
                                title: {
                                    text: 'Snow depth (m)'
                                },
                                min: 0
                            },
                            tooltip: {
                                headerFormat: '<b>{series.name}</b><br>',
                                pointFormat: '{point.x:%e. %b}: {point.y:.2f} m'
                            },
                    
                            plotOptions: {
                                spline: {
                                    marker: {
                                        enabled: true
                                    }
                                }
                            },
                    
                            series: [{
                                name: 'Winter 2012-2013',
                                // Define the data points. All series have a dummy year
                                // of 1970/71 in order to be compared on the same x axis. Note
                                // that in JavaScript, months start at 0 for January, 1 for February etc.
                                data: [
                                    [Date.UTC(1970, 9, 21), 0],
                                    [Date.UTC(1970, 10, 4), 0.28],
                                    [Date.UTC(1970, 10, 9), 0.25],
                                    [Date.UTC(1970, 10, 27), 0.2],
                                    [Date.UTC(1970, 11, 2), 0.28],
                                    [Date.UTC(1970, 11, 26), 0.28],
                                    [Date.UTC(1970, 11, 29), 0.47],
                                    [Date.UTC(1971, 0, 11), 0.79],
                                    [Date.UTC(1971, 0, 26), 0.72],
                                    [Date.UTC(1971, 1, 3), 1.02],
                                    [Date.UTC(1971, 1, 11), 1.12],
                                    [Date.UTC(1971, 1, 25), 1.2],
                                    [Date.UTC(1971, 2, 11), 1.18],
                                    [Date.UTC(1971, 3, 11), 1.19],
                                    [Date.UTC(1971, 4, 1), 1.85],
                                    [Date.UTC(1971, 4, 5), 2.22],
                                    [Date.UTC(1971, 4, 19), 1.15],
                                    [Date.UTC(1971, 5, 3), 0]
                                ]
                            }, {
                                name: 'Winter 2013-2014',
                                data: [
                                    [Date.UTC(1970, 9, 29), 0],
                                    [Date.UTC(1970, 10, 9), 0.4],
                                    [Date.UTC(1970, 11, 1), 0.25],
                                    [Date.UTC(1971, 0, 1), 1.66],
                                    [Date.UTC(1971, 0, 10), 1.8],
                                    [Date.UTC(1971, 1, 19), 1.76],
                                    [Date.UTC(1971, 2, 25), 2.62],
                                    [Date.UTC(1971, 3, 19), 2.41],
                                    [Date.UTC(1971, 3, 30), 2.05],
                                    [Date.UTC(1971, 4, 14), 1.7],
                                    [Date.UTC(1971, 4, 24), 1.1],
                                    [Date.UTC(1971, 5, 10), 0]
                                ]
                            }, {
                                name: 'Winter 2014-2015',
                                data: [
                                    [Date.UTC(1970, 10, 25), 0],
                                    [Date.UTC(1970, 11, 6), 0.25],
                                    [Date.UTC(1970, 11, 20), 1.41],
                                    [Date.UTC(1970, 11, 25), 1.64],
                                    [Date.UTC(1971, 0, 4), 1.6],
                                    [Date.UTC(1971, 0, 17), 2.55],
                                    [Date.UTC(1971, 0, 24), 2.62],
                                    [Date.UTC(1971, 1, 4), 2.5],
                                    [Date.UTC(1971, 1, 14), 2.42],
                                    [Date.UTC(1971, 2, 6), 2.74],
                                    [Date.UTC(1971, 2, 14), 2.62],
                                    [Date.UTC(1971, 2, 24), 2.6],
                                    [Date.UTC(1971, 3, 2), 2.81],
                                    [Date.UTC(1971, 3, 12), 2.63],
                                    [Date.UTC(1971, 3, 28), 2.77],
                                    [Date.UTC(1971, 4, 5), 2.68],
                                    [Date.UTC(1971, 4, 10), 2.56],
                                    [Date.UTC(1971, 4, 15), 2.39],
                                    [Date.UTC(1971, 4, 20), 2.3],
                                    [Date.UTC(1971, 5, 5), 2],
                                    [Date.UTC(1971, 5, 10), 1.85],
                                    [Date.UTC(1971, 5, 15), 1.49],
                                    [Date.UTC(1971, 5, 23), 1.08]
                                ]
                            }]
                        });
                    });
                    var w = window.open('',"", "width=600, height=400, scrollbars=yes");
                    var html = $("#popup").html();
                    $(w.document.body).html(html);
                },
                error: function(request, status, error){
                    console.log(error);
                }
            });
        }
    }//fin else
}


function getInfosMap(e)
{
    var lonLat = map.getLonLatFromViewPortPx(e.xy);  //latitude/longitude du clic
    if(typeof map.layers[1] =='undefined')  //si pas de layers
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
                    var popup = new OpenLayers.Popup(
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
// #############################################################################################################

// ################################################ map init update ############################################



function initMap()
{
    map = new OpenLayers.Map('map',
    {
        projection: new OpenLayers.Projection("EPSG:4326"),
        resolutions: [0.03, 0.09, 0.15, 0.4],
        restrictedExtent: [-180, -90, 180, 90]
    }
    );
    fond = new OpenLayers.Layer.WMS(
        "OpenLayers WMS",
        "http://vmap0.tiles.osgeo.org/wms/vmap0",
        {
            layers: 'basic',
        },
        {isBaseLayer: true}
    );
    
    map.addLayer(fond);
    
    map.zoomToMaxExtent();
    map.events.register('click', map, getInfosMap1);
    map.addControl(
        new OpenLayers.Control.MousePosition({
            prefix: 'Lon/Lat: ',
            separator: ', ',
            numDigits: 2,
            emptyString: ''
        })
    );
}



function majLayer()
{
    //Récupère les infos saisies par l'utilisateur
    try
    {
    getInfos();
    }
    catch(e)
    {
        return null;
    }
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
    if(typeof map.layers[1] !=='undefined')    //si il existe déja un layer
    {   
        map.removeLayer(map.layers[1]);         //supprimer ce layer
    }


    var layer = new OpenLayers.Layer.WMS(
        "Layer Test",
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
    autoScale();
    setMinMax(); //met a jour les valeurs min max du colorbar présent sur la carte
    map.addLayer(layer);    
}


function updateMap()
{
    majLayer();
}
// #############################################################################################################


// ###################################################set scale colorbar minmax ################################

function setColorbar()
{
    var nomColorbar = $("#Colorbar").val();
    var nbColorband = $("select[name='colorbandNum']").val();
    var src_img = "http://localhost:8080/thredds/wms/satellite/modis/MYD07/res009/MYD07_r009_d.nc?REQUEST=GetLegendGraphic&LAYER=Surface_Temperature&NUMCOLORBANDS=" + nbColorband + "&PALETTE=" + nomColorbar + "&COLORBARONLY=true"
    var img = "<img height='200px' width='50px' src='http://localhost:8080/thredds/wms/satellite/modis/MYD07/res009/MYD07_r009_d.nc?REQUEST=GetLegendGraphic&LAYER=Surface_Temperature&NUMCOLORBANDS" + nbColorband + "&PALETTE=" + nomColorbar + "&COLORBARONLY=true'/>";
    $("#colorbar").html(img);

    if(typeof map.layers[1] !=='undefined')    //si il existe déja un layer
    {   
        map.layers[1].params.STYLES = "boxfill/"+nomColorbar;         //modifier la colorbar
        map.layers[1].redraw(true);
    }
}

function setColorband()
{
    var nomColorbar = $("#Colorbar").val();
    var nbColorband = $("select[name='colorbandNum']").val();
    var src_img = "http://localhost:8080/thredds/wms/satellite/modis/MYD07/res009/MYD07_r009_d.nc?REQUEST=GetLegendGraphic&LAYER=Surface_Temperature&NUMCOLORBANDS" + nbColorband + "&PALETTE=" + nomColorbar + "&COLORBARONLY=true"
    var img = "<img height='200px' width='50px' marging='100px' padding='0px' src='http://localhost:8080/thredds/wms/satellite/modis/MYD07/res009/MYD07_r009_d.nc?REQUEST=GetLegendGraphic&LAYER=Surface_Temperature&NUMCOLORBANDS" + nbColorband + "&PALETTE=" + nomColorbar + "&COLORBARONLY=true'/>";
    $("#colorbar").html(img);
    if(typeof map.layers[1] !=='undefined')    //si il existe déja un layer
    {   
        map.layers[1].params.NUMCOLORBANDS = nbColorband;
        map.layers[1].redraw(true);   //actualise la map
    }	
}

function setMinMax()
{
	if(lstInfos.unit=='K')
	{
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