var selection_geographique = {"benin":["district","pays"],
                              "burkina":["aire","district","pays"],
                              "mali":["district","pays"],
                              "senegal":["pays"]
                            };
var listvar = {"satellite":{"modis":{"MYD04":{"reso_spatiale":["009","025","075","125"],
                                              "datedebut":["2004-07-01"],
                                              "datefin":["2016-01-31"],
                                              "reso_temporelle":["daily","weekly","monthly","trimestre"],
                                              "variables":["AerosolAbsOpticalDepthVsHeight_354_nm","Deep_Blue_Surface_Reflectance_Land_412_nm","Deep_Blue_Aerosol_Optical_Depth_550_Land"]
                                     },
                                     "MYD05":{"reso_spatiale":["005","009","025","075","125"],
                                              "reso_temporelle":["daily","weekly","monthly","trimestre"],
                                              "variables":["Water_Vapor_Infrared"]
                                     },
                                     "MYD07":{"reso_spatiale":["005","009","025","075","125"],
                                              "reso_temporelle":["daily","weekly","monthly","trimestre"],
                                              "variables":["Total_Ozone","Lifted_Index","Surface_Temperature"],
                                     }  
                            },
                            "msg":{
                            },
                            "aura_omi":{"omaeruv":{"reso_spatiale":["025","075","125"],
                                                   "reso_temporelle":["daily","weekly","monthly","trimestre"],
                                                   "variables":["FinalAerosolOpticalDepth_358_nm","AerosolAbsOpticalDepthVsHeight_500_nm"],
                                        }
                                                    
                            },
                            "toms":{
                            }
                },
                "re_analyse":{"ecmwf":{"era_interim":{"reso_spatiale":["075","125"],
                                                      "reso_temporelle":["daily","weekly","monthly","trimestre"],
                                                      "variables":["tclw","tco3"]
                                                      }
                                       },
                },
                "modele":{
                },
    };
window.onload = function () {
	
	//Get html elements
     $('select').select2();
	var type = document.getElementById("typeSel");
	var capteur = document.getElementById("capteurSel");	
	var produit = document.getElementById("produitSel");
	var variable = document.getElementById("variableSel");
     var resospatiale = document.getElementById("resospatialeSel");
	var pasdetemps = document.getElementById("pasdetempsSel");
	var pays = document.getElementById("paysSel");
	var decoupage = document.getElementById("decoupageSel");
	//Load type
	for (var tp in listvar) {
		typeSel.options[typeSel.options.length] = new Option(tp, tp);
	}
	
	//type Changed
	type.onchange = function () {
		 
		 capteurSel.length = 1; // remove all options bar first
		 produitSel.length = 1; // remove all options bar first
		 variableSel.length = 1; // remove all options bar first
           resospatialeSel.length = 1;            		 
           pasdetempsSel.length = 1;
		 if (this.selectedIndex < 1)
			 return; // done
		 
		 for (var cp in listvar[this.value]) {
			 capteurSel.options[capteurSel.options.length] = new Option(cp, cp);
		 }
	}
	
	//capteur Changed
	capteurSel.onchange = function () {		 
		 
		 produitSel.length = 1; // remove all options bar first
		 variableSel.length = 1; // remove all options bar first
           resospatialeSel.length = 1;            		 
           pasdetempsSel.length = 1;
		 
		 if (this.selectedIndex < 1)
			 return; // done
		 
		 for (var prod in listvar[type.value][this.value]) {
			 produitSel.options[produitSel.options.length] = new Option(prod, prod);
		 }
	}
	
	//produit Changed
	produitSel.onchange = function () {
		variableSel.length = 1; // remove all options bar first
          resospatialeSel.length = 1;            		 
          pasdetempsSel.length = 1;
		
		if (this.selectedIndex < 1)
			return; // done
		
		var resospatiale = listvar[typeSel.value][capteurSel.value][this.value]['reso_spatiale'];
		var resotemporelle = listvar[typeSel.value][capteurSel.value][this.value]['reso_temporelle'];
		var debut = listvar[typeSel.value][capteurSel.value][this.value]['datedebut'];
		var fin = listvar[typeSel.value][capteurSel.value][this.value]['datefin'];
		var vbl = listvar[typeSel.value][capteurSel.value][this.value]['variables'];
		for (var i = 0; i < resospatiale.length; i++) {
			resospatialeSel.options[resospatialeSel.options.length] = new Option(resospatiale[i][0]+'.'+resospatiale[i].slice(1,5)+' deg', resospatiale[i]);
		}
		for (var i = 0; i < resotemporelle.length; i++) {
			pasdetempsSel.options[pasdetempsSel.options.length] = new Option(resotemporelle[i], resotemporelle[i][0]);
		}
		for (var i = 0; i < vbl.length; i++) {
			variableSel.options[variableSel.options.length] = new Option(vbl[i], vbl[i]);
		}
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
	}
	//Load pays
	for (var ps in selection_geographique) {
		paysSel.options[paysSel.options.length] = new Option(ps, ps);
	}
	
	//pays Changed
	pays.onchange = function () {
		 
		 decoupageSel.length = 1; // remove all options bar first
		 if (this.selectedIndex < 1)
			 return; // done
		 
           var dist = selection_geographique[this.value];
		 for (var i = 0; i< dist.length; i++) {
			 decoupageSel.options[decoupageSel.options.length] = new Option(dist[i], dist[i]);
		 }
	}
}
