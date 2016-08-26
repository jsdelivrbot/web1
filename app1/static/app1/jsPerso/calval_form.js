var selection_geographique = {"benin":["tanguita", "Nikki"],
                              "burkina":["Diapaga","Bogande"],
                              "mali":["San", "Koro"],
                              "senegal":["Dakar", "Saint-Louis"],
                            };
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
                                              "variables":[
                                                            "Water_Vapor_Infrared",
                                                            ]
                                             },
                                     "MYD07":{
                                              "reso_spatiale":["005","009","025","075","125"],
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


//*********************************FORMULAIRE***************************************//


function active(){
    if(document.getElementById('checkbox').checked){
        document.getElementsByName('type2')[0].disabled=false;
        document.getElementsByName('capteur2')[0].disabled=false;
        document.getElementsByName('produit2')[0].disabled=false;
        document.getElementsByName('variable2')[0].disabled=false;
        document.getElementsByName('resospatiale2')[0].disabled=false;
        document.getElementsByName('level2')[0].disabled=false;
    }
    else{
        document.getElementsByName('type2')[0].disabled=true;
        document.getElementsByName('capteur2')[0].disabled=true;
        document.getElementsByName('produit2')[0].disabled=true;
        document.getElementsByName('variable2')[0].disabled=true;
        document.getElementsByName('resospatiale2')[0].disabled=true;
        document.getElementsByName('level2')[0].disabled=true;
    }
} 


function setForm(){
    $('select').select2();
    //Load type
    for (var tp in listvar) {
        typeSel1.options[typeSel1.options.length] = new Option(tp, tp);
    }
    
    //type Changed
    $('#typeSel1').on('change', function(){
    
        capteurSel1.length = 1; // remove all options bar first
        produitSel1.length = 1; 
        variableSel1.length = 1; 
        resospatialeSel1.length = 1;
        levelSel1.length = 1;     		 
        
        if (this.selectedIndex < 1)
            return; // done
        	 
        for (var cp in listvar[this.value]) {
            capteurSel1.options[capteurSel1.options.length] = new Option(cp, cp);
        }
    	});
    
    //capteur Changed
    $('#capteurSel1').on('change', function(){		 
    
        produitSel1.length = 1; // remove all options bar first
        variableSel1.length = 1; 
        resospatialeSel1.length = 1;            		 
        levelSel1.length = 1;
        	 
        if (this.selectedIndex < 1)
            return; // done
        
        for (var prod in listvar[typeSel1.value][this.value]) {
            produitSel1.options[produitSel1.options.length] = new Option(prod, prod);
        }
    });
    	
    //produit Changed
    $('#produitSel1').on('change', function(){
    
        variableSel1.length = 1; // remove all options bar first
        resospatialeSel1.length = 1;            		 
        levelSel1.length = 1;
        
        if (this.selectedIndex < 1)
            return; // done
        
        var resospatiale = listvar[typeSel1.value][capteurSel1.value][this.value]['reso_spatiale'];
        var resotemporelle = listvar[typeSel1.value][capteurSel1.value][this.value]['reso_temporelle'];
        var debut = listvar[typeSel1.value][capteurSel1.value][this.value]['datedebut'];
        var fin = listvar[typeSel1.value][capteurSel1.value][this.value]['datefin'];
        var vbl = listvar[typeSel1.value][capteurSel1.value][this.value]['variables'];
        
        for (var i = 0; i < resospatiale.length; i++) {
            resospatialeSel1.options[resospatialeSel1.options.length] = new Option(resospatiale[i][0]+'.'+resospatiale[i].slice(1,5)+' deg', resospatiale[i]);
        }
        for (var i = 0; i < vbl.length; i++) {
            variableSel1.options[variableSel1.options.length] = new Option(vbl[i], vbl[i]);
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
    	});
    
    //variable Changed
    $('#variableSel1').on('change', function(){		 
    
        levelSel1.length = 1;            		 
        if (this.selectedIndex < 1)
            return; // done
        
        if (level30.indexOf(this.value) > -1) {
            for (var lev = 1; lev < 31; lev++) {
                levelSel1.options[levelSel1.options.length] = new Option(lev, lev);
            }
        }
        else {        
            levelSel1.options[levelSel1.options.length] = new Option(1, '');
        }
    });
    
    //Load pays
    for (var ps in selection_geographique) {
        paysSel.options[paysSel.options.length] = new Option(ps, ps);
    }
    
    //pays Changed
    $('#paysSel').on('change', function(){
    
        districtSel.length = 1; // remove all options bar first
        if (this.selectedIndex < 1)
            return; // done
        	 
        var dist = selection_geographique[this.value];
        for (var i = 0; i< dist.length; i++) {
            districtSel.options[districtSel.options.length] = new Option(dist[i], dist[i]);
        }
    });

    $('.input-small').keypress(function(event) {

        if(event.which == 8 || event.keyCode == 9 || event.keyCode == 37 || event.keyCode == 39 || event.keyCode == 46) 
            return true;

        else if((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57))
            event.preventDefault();
    });

}


//**********************************MAIN*****************************************//

window.onload = function(){
    setForm();
    active();
}

