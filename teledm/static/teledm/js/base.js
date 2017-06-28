//const ROOT = "http://localhost:8080/thredds";
const ROOT = "http://localhost:8000/climdata.u-bourgogne.fr/teledm"


//-----------------------------------------------------------------------------
//------------variables concernant les traitements donnees in situ-------------
//-----------------------------------------------------------------------------
var geoDist = ['niger_district_sante', 'mali_district_sante','burkina_aire_sante', 'burkina_district_sante',];
var mesures = ["aeronet", "teom", "meteo"];
var integration = ['+-1h','+-5h'];

//------------variables teom --------------------------------------
var stationsTeom = ["Banizoumbou", "Cinzana", "MBour", "Dedougou"];
var variablesTeom = ["concentration"];

//------------variables meteo -------------------------------------
var stationsMeteo = ["Banizoumbou", "Cinzana", "MBour"];
var variablesMeteo = ["wind", "wind_dir", "temp", "relh", "rain"];

//------------variables aeronet -----------------------------------
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

var variablesAeronet2 = ['Total_AOD_500nm[tau_a]', 'Fine_Mode_AOD_500nm[tau_f]', 'Coarse_Mode_AOD_500nm[tau_c]', 'FineModeFraction_500nm[eta]',
                         '2nd_Order_Reg_Fit_Error-Total_AOD_500nm[regression_dtau_a]', 'RMSE_Fine_Mode_AOD_500nm[Dtau_f]', 'RMSE_Coarse_Mode_AOD_500nm[Dtau_c]',
                         'RMSE_FineModeFraction_500nm[Deta]', 'Angstrom_Exponent(AE)-Total_500nm[alpha]', 'dAE/dln(wavelength)-Total_500nm[alphap]', 'AE-Fine_Mode_500nm[alpha_f]',
                         'dAE/dln(wavelength)-Fine_Mode_500nm[alphap_f]', 'Air_Mass', '870nm_Input_AOD', '675nm_Input_AOD', '667nm_Input_AOD', '555nm_Input_AOD',
                         '551nm_Input_AOD', '532nm_Input_AOD', '531nm_Input_AOD', '500nm_Input_AOD', '490nm_Input_AOD', '443nm_Input_AOD', '440nm_Input_AOD',
                         '412nm_Input_AOD', '380nm_Input_AOD', 'Number_of_Wavelengths', 'Exact_Wavelengths_for_Input_AOD', 'AOT_1640', 'AOT_1020', 'AOT_870',
                         'AOT_675', 'AOT_667', 'AOT_555', 'AOT_551', 'AOT_532', 'AOT_531', 'AOT_500', 'AOT_490', 'AOT_443', 'AOT_440', 'AOT_412', 'AOT_380',
                         'AOT_340', 'Water(cm)', '%TripletVar_1640', '%TripletVar_1020', '%TripletVar_870', '%TripletVar_675', '%TripletVar_667', '%TripletVar_555',
                         '%TripletVar_551', '%TripletVar_532', '%TripletVar_531', '%TripletVar_500', '%TripletVar_490', '%TripletVar_443', '%TripletVar_440',
                         '%TripletVar_412', '%TripletVar_380', '%TripletVar_340', '%WaterError', '440-870Angstrom', '380-500Angstrom', '440-675Angstrom',
                         '500-870Angstrom', '340-440Angstrom', '440-675Angstrom(Polar)', 'Solar_Zenith_Angle', 'SunphotometerNumber', 'AOT_1640-ExactWavelength(nm)',
                         'AOT_1020-ExactWavelength(nm)', 'AOT_870-ExactWavelength(nm)', 'AOT_675-ExactWavelength(nm)', 'AOT_667-ExactWavelength(nm)', 'AOT_555-ExactWavelength(nm)',
                         'AOT_551-ExactWavelength(nm)', 'AOT_532-ExactWavelength(nm)', 'AOT_531-ExactWavelength(nm)', 'AOT_500-ExactWavelength(nm)', 'AOT_490-ExactWavelength(nm)',
                         'AOT_443-ExactWavelength(nm)', 'AOT_440-ExactWavelength(nm)', 'AOT_412-ExactWavelength(nm)', 'AOT_380-ExactWavelength(nm)', 'AOT_340-ExactWavelength(nm)',
                         'Water(cm)-ExactWavelength(nm)', 'AOT_1640-Total', 'AOT_1640-AOT', 'AOT_1640-Rayleigh', 'AOT_1640-O3', 'AOT_1640-NO2', 'AOT_1640-CO2',
                         'AOT_1640-CH4', 'AOT_1640-Water', 'AOT_1020-Total', 'AOT_1020-AOT', 'AOT_1020-Rayleigh', 'AOT_1020-O3', 'AOT_1020-NO2', 'AOT_1020-CO2',
                         'AOT_1020-CH4', 'AOT_1020-Water', 'AOT_870-Total', 'AOT_870-AOT', 'AOT_870-Rayleigh', 'AOT_870-O3', 'AOT_870-NO2', 'AOT_870-CO2',
                         'AOT_870-CH4', 'AOT_870-Water', 'AOT_675-Total', 'AOT_675-AOT', 'AOT_675-Rayleigh', 'AOT_675-O3', 'AOT_675-NO2', 'AOT_675-CO2',
                         'AOT_675-CH4', 'AOT_675-Water', 'AOT_667-Total', 'AOT_667-AOT', 'AOT_667-Rayleigh', 'AOT_667-O3', 'AOT_667-NO2', 'AOT_667-CO2',
                         'AOT_667-CH4',  'AOT_667-Water', 'AOT_555-Total', 'AOT_555-AOT', 'AOT_555-Rayleigh', 'AOT_555-O3', 'AOT_555-NO2', 'AOT_555-CO2',
                         'AOT_555-CH4', 'AOT_555-Water', 'AOT_551-Total', 'AOT_551-AOT', 'AOT_551-Rayleigh', 'AOT_551-O3', 'AOT_551-NO2', 'AOT_551-CO2',
                         'AOT_551-CH4', 'AOT_551-Water', 'AOT_532-Total', 'AOT_532-AOT', 'AOT_532-Rayleigh', 'AOT_532-O3', 'AOT_532-NO2', 'AOT_532-CO2',
                         'AOT_532-CH4', 'AOT_532-Water', 'AOT_531-Total', 'AOT_531-AOT', 'AOT_531-Rayleigh', 'AOT_531-O3', 'AOT_531-NO2', 'AOT_531-CO2',
                         'AOT_531-CH4', 'AOT_531-Water', 'AOT_500-Total', 'AOT_500-AOT', 'AOT_500-Rayleigh', 'AOT_500-O3', 'AOT_500-NO2', 'AOT_500-CO2',
                         'AOT_500-CH4', 'AOT_500-Water', 'AOT_490-Total', 'AOT_490-AOT', 'AOT_490-Rayleigh', 'AOT_490-O3', 'AOT_490-NO2', 'AOT_490-CO2',
                         'AOT_490-CH4', 'AOT_490-Water', 'AOT_443-Total', 'AOT_443-AOT', 'AOT_443-Rayleigh', 'AOT_443-O3', 'AOT_443-NO2', 'AOT_443-CO2',
                         'AOT_443-CH4', 'AOT_443-Water', 'AOT_440-Total', 'AOT_440-AOT', 'AOT_440-Rayleigh', 'AOT_440-O3', 'AOT_440-NO2', 'AOT_440-CO2',
                         'AOT_440-CH4', 'AOT_440-Water', 'AOT_412-Total', 'AOT_412-AOT', 'AOT_412-Rayleigh', 'AOT_412-O3', 'AOT_412-NO2', 'AOT_412-CO2',
                         'AOT_412-CH4', 'AOT_412-Water', 'AOT_380-Total', 'AOT_380-AOT', 'AOT_380-Rayleigh', 'AOT_380-O3', 'AOT_380-NO2', 'AOT_380-CO2',
                         'AOT_380-CH4', 'AOT_380-Water', 'AOT_340-Total', 'AOT_340-AOT', 'AOT_340-Rayleigh', 'AOT_340-O3', 'AOT_340-NO2', 'AOT_340-CO2',
                         'AOT_340-CH4', 'AOT_340-Water', 'Pressure[hPa]', 'Total_O3[DobsonUnits]', 'Total_NO2[DobsonUnits]'];
var niveau = ['1_5','2'];
var resoTempo = {
    "aeronet":["diurne_15min", "diurne_h", "diurne_d", "diurne_w", "diurne_m", "diurne_t",
                        "h24_15min", "h24_h", "h24_d", "h24_w", "h24_m", "h24_t"],
    "teom":["diurne_15min", "diurne_h", "diurne_d", "diurne_w", "diurne_m", "diurne_t",
                        "h24_15min", "h24_h", "h24_d", "h24_w", "h24_m", "h24_t"],
    "meteo":['3h', '6h', '12h', 'd', 'w', 'm']
};

//------------variables epidemio ------------------------------------
var epidemio = ["meningite"];
var meningitePays = {
    'Burkina':['pays', 'district'],
    'Mali':['pays', 'district'],
    'Niger':['pays', 'district'],
    //'Senegal':['pays']
};
var echelle = ['pays', 'district', 'aire'];
var meningiteVar = {
    'pays':['deces', 'population', 'incidence'],
    'district':['cas', 'incidence', 'population']
};
var selection_geographique = {"benin":["district","pays"],
                              "burkina":["aire","district","pays"],
                              "mali":["district","pays"],
                              "senegal":["pays"]
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

//-----------------------------------------------------------------------------
//------------variables concernant les traitements donnees netcdf -------------
//-----------------------------------------------------------------------------
var resoTemp = [['d','quotidien'],['w','hebdomadaire'], ['m','mensuel'], ['t','trimestriel']];
var domaines = [['01', 'domaine 01'], ['02', 'domaine 02']];