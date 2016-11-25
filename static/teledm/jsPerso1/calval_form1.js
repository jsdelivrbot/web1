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
function setSelect1(array, bx){
    $.each(array, function(value) {
        $('#'+bx)
            .append($("<option></option>")
            .attr("value",value)
            .text(value));
    });
    alert(bx);
}

function clearSelect(elt){
    for (var i = elt.options.length -1; i >= 0; i--){
        elt.remove(i);
    }
    alert(elt);
}




function activeSource2(){
    var select2 = document.querySelectorAll("[id^='type']");
    if(document.getElementById('checkbox').checked){
        document.getElementsById('typeS2').disabled=false;
        document.getElementsById('capteurS2').disabled=false;
        document.getElementsById('produitS2').disabled=false;
        document.getElementsById('variableS2').disabled=false;
        document.getElementsById('resospatialeS2').disabled=false;
        document.getElementsById('levelS2').disabled=false;
    }
    else{
        document.getElementsById('typeS2').disabled=true;
        document.getElementsById('capteurS2').disabled=true;
        document.getElementsById('produitS2').disabled=true;
        document.getElementsById('variableS2').disabled=true;
        document.getElementsById('resospatialeS2').disabled=true;
        document.getElementsById('levelS2').disabled=true;
    }
} 




function setSelect(array, bx){
    for (var tp in array) {
    		bx.options[bx.options.length] = new Option(tp, tp);
    	}
}

function setForm(){
    $('select').select2();
    //Load type
    setSelect(listvar, 'typeS1');
    //type Changed
    $('#typeS1').on('change', function(){
    
        document.getElementById("capteurS1").length = 1;
        document.getElementById("produitS1").length = 1;
        document.getElementById("variableS1").length = 1;
        document.getElementById("resospatialeS1").length = 1;
        document.getElementById("levelS1").length = 1;   		 
        
        if (this.selectedIndex < 1)
            return; // done
        	 
        setSelect(listvar[this.value], 'capteur1');
    	});
    
    //capteur Changed
    $('#capteurS1').on('change', function(){		 

        clearSelect("produit1");
        $('select[name=variable1] option').length = 1;
        $('select[name=resospatiale1] option').length = 1;
        $('select[name=level1] option').length = 1;
        	 
        if (this.selectedIndex < 1)
            return; // done

        setSelect(listvar[$('select[name=type1] :selected').val()][this.value], 'produit1');
    });
    	
    //produit Changed
    $('#produitS1').on('change', function(){	
        
        $('resospatialeS1').length = 1;
        $('#levelS1').length = 1;
        
        if (this.selectedIndex < 1)
            return; // done
        
        var resospatiale = listvar[$('select[name=type1] :selected').val()][$('select[name=capteur1] :selected').val()][this.value]['reso_spatiale'];
        var debut = listvar[$('select[name=type1] :selected').val()][$('select[name=capteur1] :selected').val()][this.value]['datedebut'];
        var fin = listvar[$('select[name=type1] :selected').val()][$('select[name=capteur1] :selected').val()][this.value]['datefin'];
        var vbl = listvar[$('select[name=type1] :selected').val()][$('select[name=capteur1] :selected').val()][this.value]['variables'];
        
        $.each(resospatiale, function(value) {
            $('select[name='+bx+']')
                .append($("<option></option>")
                .attr("value",value+'.'+value.slice(1,5)+' deg')
                .text(value));
        });
        
        setSelect(vbl, 'variable1');
        
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
    activeSource2();
}


