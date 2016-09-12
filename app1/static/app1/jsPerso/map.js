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


function affiche(a){
    alert(a);
}

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


window.onload = function(){
    $('select').select2();
    setForm();
}