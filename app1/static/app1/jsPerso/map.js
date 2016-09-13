var listvar = {"satellite":{"modis":{
                                    "MYD04":{
                                              "reso_spatiale":["009","025","075","125"],
                                              "datedebut":["2004-07-01"],
                                              "datefin":["2016-01-31"],
                                              "variables":[
                                                            "AerosolAbsOpticalDepthVsHeight_354_nm",
                                                            "Deep_Blue_Surface_Reflectance_Land_412_nm",
                                                            "Deep_Blue_Aerosol_Optical_Depth_550_Land",
                                                            ]
                                             },
                                     "MYD05":{
                                              "reso_spatiale":["005","009","025","075","125"],
                                              "datedebut":["2004-07-01"],
                                              "datefin":["2016-01-31"],
                                              "variables":[
                                                            "Water_Vapor_Infrared",
                                                            ]
                                             },
                                     "MYD07":{
                                              "reso_spatiale":["005","009","025","075","125"],
                                              "datedebut":["2004-07-01"],
                                              "datefin":["2016-01-31"],
                                              "variables":[
                                                            "Total_Ozone",
                                                            "Lifted_Index",
                                                            "Surface_Temperature",
                                                            ]
                                             }  
                                    },
                            "msg":{
                                  },
                            "aura_omi":{
                                        "omaeruv":{
                                                   "reso_spatiale":["025","075","125"],
                                                   "datedebut":["2004-10-01"],
                                                   "datefin":["2016-01-31"],
                                                   "variables":[
                                                                "FinalAerosolOpticalDepth_358_nm",
                                                                "AerosolAbsOpticalDepthVsHeight_500_nm",
                                                                ]
                                                    }
                                                    
                                        },
                            "toms":{
                                    }
                            },
                "re_analyse":{
                              "ecmwf":{
                                        "era_interim":{
                                                      "reso_spatiale":["075","125"],
                                                      "datedebut":["1980-01-01"],
                                                      "datefin":["2016-01-31"],
                                                      "variables":[
                                                                    "tclw",
                                                                    "tco3",
                                                                    ]
                                                      }
                                       },
                            },
                "modele":{
                          },
            };

var level2 = [];
var level3 = [];
var level30 = ['AerosolAbsOpticalDepthVsHeight_354_nm', 'FinalAerosolOpticalDepth_358_nm'];

//Variables globales composant la carte
var map;
var fond;
var mapPanel;

//Racine de l'URL de la requete (nom du serveur TDS)
const ROOT = "http://localhost:8080/thredds/";

//Objet contenant les informations choisies par l'utilisateur
var lstInfos = {
    date:"",
    param:"",
    unite:"",
    nomDataset:"",
    capteur:"",
    produit:"",
    resspatiale:"",
    restempo:"",
    layer:"",
    nomFichier:"",
    colorbar:"",
    scaleMin:"",
    scaleMax:"",
    bbox:'',
    colorbarBand:'',
    opacity:''
    };
    
//Tableau des catalogues disponibles
var tabCatalog=[];


//*********************************FORMULAIRE***************************************//

function setSelect(array, bx){
    for (var tp in array) {
            bx.options[bx.options.length] = new Option(tp, tp);
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
    setSelect(listvar, selectSource1[0]);

    //choix du type
    selectSource1[0].onchange =  function(){
        //reinitialise les menus deroulants
        resetSelect(selectSource1, 1);
        if (this.selectedIndex < 1)
            return; // absence de choix
        //charge les choix de capteur
        setSelect(listvar[this.value], selectSource1[1]);
        $("[id^='date']").datepicker("setDate", null);
        };
    
    //choix du capteur
    selectSource1[1].onchange = function(){         
        //reinitialise les menus deroulants
        resetSelect(selectSource1, 2);
        if (this.selectedIndex < 1)
            return; // absence de choix
        //chargement des choix de produits
        setSelect(listvar[typeS1.value][this.value], selectSource1[2]);
        $("[id^='date']").datepicker("setDate", null);
    };
        
    //choix du produit
    selectSource1[2].onchange = function(){

        var resospatiale = listvar[selectSource1[0].value][selectSource1[1].value][this.value]['reso_spatiale'];
        var debut = listvar[selectSource1[0].value][selectSource1[1].value][this.value]['datedebut'];
        var fin = listvar[selectSource1[0].value][selectSource1[1].value][this.value]['datefin'];
        var vbl = listvar[selectSource1[0].value][selectSource1[1].value][this.value]['variables'];

        //reinitialise les menus deroulants
        resetSelect(selectSource1, 3);
        if (this.selectedIndex < 1)
            return; // absence de selection

        for (var i = 0; i < resospatiale.length; i++) {
            selectSource1[4].options[selectSource1[4].options.length] = new Option(resospatiale[i][0]+'.'+resospatiale[i].slice(1,5)+' deg', resospatiale[i]);
        }

        for (var v in vbl) {
            selectSource1[3].options[selectSource1[3].options.length] = new Option(vbl[v], vbl[v]);
        }
        
        //dates debut/fin
        $( "#date1" ).datepicker({
            yearRange: '1979:2025',
            dateFormat: 'yy-mm-dd',
            changeMonth: true,
            changeYear: true,
            showMonthAfterYear: true,
            minDate: new Date(debut),
            maxDate: new Date(fin),
            onSelect: function( selectedDate ) {
                $( "#date2" ).datepicker( "option", "minDate", selectedDate );
            }
        });
        
        $( "#date2" ).datepicker({
            yearRange: '1979:2025',
            dateFormat: 'yy-mm-dd',
            changeMonth: true,
            changeYear: true,
            showMonthAfterYear: true,
            minDate: new Date(debut),
            maxDate: new Date(fin),
                onSelect: function( selectedDate ) {
                $( "#date1" ).datepicker( "option", "maxDate", selectedDate );
                }
        });
        };
    
    //variable Changed
    selectSource1[3].onchange = function(){         
    
        resetSelect(selectSource1, 5);                     
        if (this.selectedIndex < 1)
            return; // done
        
        if (level30.indexOf(this.value) > -1) {
            for (var lev = 1; lev < 31; lev++) {
                selectSource1[5].options[selectSource1[5].options.length] = new Option(lev, lev);
            }
        }
        else {        
            levelS1.options[selectSource1[5].options.length] = new Option(1, '');
        }
    };
}



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
    lstInfos.colorbar="";
    lstInfos.scaleMin="";
    lstInfos.scaleMax="";
    lstInfos.colorbarBand='';
    lstInfos.opacity='';
    lstInfos.unite='';
    
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

    var restempo = $('#pasdetempsSel1').val();
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
    var dateForm= $("input[id='date1']").val();
    if(dateForm=='')
    {
        alert("Erreur ! Aucune date saisie !");
        throw new Exception();
    }
    else
    {
        lstInfos.date=dateForm;
    }

    var nomFichier = produit + "_r" + resospatiale + "_" + restempo + ".nc";
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


function initMap()
{
    map = new OpenLayers.Map('map',
        {
            projection: new OpenLayers.Projection("EPSG:4326"),
            resolutions: [0.03, 0.05,0.09, 0.15, 0.4]
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
    map.events.register('click', map, getInfosMap);
    
    
}

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
    var img = "<img height='200px' width='50px' src='http://localhost:8080/thredds/wms/satellite/modis/MYD07/res009/MYD07_r009_d.nc?REQUEST=GetLegendGraphic&LAYER=Surface_Temperature&NUMCOLORBANDS" + nbColorband + "&PALETTE=" + nomColorbar + "&COLORBARONLY=true'/>";
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
//******************************TRAITEMENT****************************************//


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
    var URL = ROOT+ "wms/" +
        lstInfos.nomDataset +
        "/" + lstInfos.capteur +
        "/" + lstInfos.produit +
        "/res" + lstInfos.resspatiale +
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
            numcolorbands : "100", //100//$("select[name='colorbandNum']").val(),
            opacity : "100" //lstInfos.opacity
            },
        {isBaseLayer: false}
    );    
    map.addLayer(layer);

    setMinMax(); //met a jour les valeurs min max du colorbar présent sur la carte
}




function updateMap()
{
    majLayer();
}


window.onload = function(){
    $('select').select2();
    setForm();
    initMap();
}
