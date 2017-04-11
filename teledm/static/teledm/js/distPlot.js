colorMaps = {
    "jaune": ["#ffffcc", "#ff6600"],
    "bleu": ["#e6f2ff", "#0059b3"],
    "brun": ["#f2e6d9", "#86592d"],
    "brun2": ["#d1e0e0", "#476b6b"],
    "vert": ["#73e600", "#264d00"],
    
};

var dataset = {
    pays: '',
    decoupage: '',
    dates: [],
    datas: [],
    urlShape: '',
    fileOut: ''
};

var datasetInSitu = {
    header: "",
    variable: "",
    dates: [],
    datas: []
};


function verifForm(){
    if($('#typeSel').val() == 'Type de données'){
        alert("Erreur ! Aucun type de données sélectionné !");
        throw new Exception();
    }
    if($('#capteurSel').val() == 'Capteur/Source')
    {
        alert("Erreur ! Aucune source de données sélectionnée !");
        throw new Exception();
    }
    if($('#produitSel').val() == 'Produit'){    
        alert("Erreur ! Aucun produit sélectionné !");
        throw new Exception();
    }
    if($('#resospatialeSel').val() == 'Résolution spatiale'){     
        alert("Erreur ! Aucune résolution spatiale sélectionnée !");
        throw new Exception();
    }
    var restempo = $('#pasdetempsSel').val();
    if(restempo == 'Résolution temporelle')
    {
        alert("Erreur ! Aucun type de données sélectionné !");
        throw new Exception();
    }
    if($("#variableSel option:selected").text() == 'Variable'){
        alert("Erreur ! Aucune variable selectionnée !");
        throw new Exception();
    }
    var level = $("#levelS1").val();
    if((level=='Layer') & ($('#levelS1').is(':disabled') == false))
    {
        
        alert("Erreur ! Aucun niveau de couche sélectionné !");
        throw new Exception();
    }
    var date1 = $("#date1").val();
    if(date1 == '' || isNaN(Date.parse(date1)) == true){
        alert("Erreur ! Aucune saisie date debut!");
        throw new Exception();
    }else{
        if (restempo == 'w'){
            var deb = moment(date1).startOf('isoWeek').format('YYYY-MM-DD');
        }else if (restempo == 'm'){
            var deb = moment(date1).startOf('Month').format('YYYY-MM-DD');
        }else if (restempo == 't'){
            var deb = moment(date1).startOf('quarter').format('YYYY-MM-DD');
        }else{
            var deb = date1;
        }
        $("#date1").val(deb);
    }
    var date2 = $("#date2").val();
    if( date2 == '' || isNaN(Date.parse(date2)) == true){
        alert("Erreur ! Aucune saisie date de fin!");
        throw new Exception();
    }else{
        if (restempo == 'w'){
            var fin = moment(date2).startOf('isoWeek').format('YYYY-MM-DD');
        }else if (restempo == 'm'){
            var fin = moment(date2).startOf('Month').format('YYYY-MM-DD');
        }else if (restempo == 't'){
            var fin = moment(date2).startOf('quarter').format('YYYY-MM-DD');
        }else{
            var fin = date2;
        }
        $("#date2").val(fin);
    }    
    if($("#pays").val() == 'Pays'){
       alert("Erreur ! Aucune zone d'extraction selectionnée !");
        throw new Exception(); 
    }
    if($("#decoupage").val() == 'Echelle de découpage'){
       alert("Erreur ! Aucun découpage géographique selectionné !");
        throw new Exception(); 
    }
}


function updateDate(dates){
    var option = '';
    for (var i=0;i<dates.length;i++){
       option += '<option value="'+ i + '">' + dates[i] + '</option>';
    }
    $("#dates").empty().append(option);
}




$("#dates").on('change', function(){
    console.log($(this).val());
    var idates = $(this).val();
    while($("#mapcontainer").highcharts().series.length > 0){
        $("#mapcontainer").highcharts().series[0].remove(true);
    }
    //while($("#plotcontainer").highcharts().series.length > 0){
        //$("#plotcontainer").highcharts().series[0].remove(true);
    //}
    $.getJSON(dataset.urlShape, function(geojson){
        $("#mapcontainer").highcharts().addSeries({
            mapData: geojson,
            data: dataset.datas[$("#calcul").val()].all_dist[$("#dates").val()],
            joinBy: ['name','code'],
            nullColor: 'white'
        });
        $("#mapcontainer").highcharts().setTitle({ text: $("#dates option:selected").text() + ' ' + dataset.pays + ": Stats mean" }, { text:   "decoupage geographique: "+dataset.decoupage});
    });
});


$("#calcul").on('change', function(){
    console.log($(this).val().substr(2, $(this).val().length));
    var icalcul = $(this).val();
    var idates = $("#dates").val();
    while($("#mapcontainer").highcharts().series.length > 0){
        $("#mapcontainer").highcharts().series[0].remove(true);
    }
    //while($("#plotcontainer").highcharts().series.length > 0){
        //$("#plotcontainer").highcharts().series[0].remove(true);
    //}
    $.getJSON(dataset.urlShape, function(geojson){
        $("#mapcontainer").highcharts().addSeries({
            mapData: geojson,
            data: dataset.datas[$("#calcul").val()].all_dist[$("#dates").val()],
            joinBy: ['name','code'],
            nullColor: 'white'
        });
        $("#mapcontainer").highcharts().setTitle({ text: $("#dates option:selected").text() + ' ' + dataset.pays +": "+ $("#variableSel").val() + "(" + $("#calcul").val().substr(2, $("#calcul").val().length) + ")"}, { text:   "decoupage geographique: "+dataset.decoupage});
    });
});


$("#colorAxis").on('change', function(){
    colors = colorMaps[$("#colorAxis").val()];
    $("#mapcontainer").highcharts().colorAxis[0].update({
        nullColor: 'white',
        minColor: colors[0],
        maxColor: colors[1]
    });
});

$("#moyenne").on('submit', function(e){
    e.preventDefault();
    verifForm();
    while($("#mapcontainer").highcharts().series.length > 0){
        $("#mapcontainer").highcharts().series[0].remove(true);
    }
    while($("#plotcontainer").highcharts().series.length > 0){
        $("#plotcontainer").highcharts().series[0].remove(true);
    }
    $.ajax({
        async: false,
        type: "POST",
        url: '',
        dataType: 'json',
        data: $("#moyenne").serialize(),
        beforeSend: function(xhr, settings) {
            xhr.setRequestHeader("X-CSRFToken", $.cookie('csrftoken'));
            $("#mapcontainer").highcharts().showLoading();
            $("#plotcontainer").highcharts().showLoading();
        },
        complete: function(){
            $("#mapcontainer").highcharts().hideLoading();
            $("#plotcontainer").highcharts().hideLoading();
        },
        success: function(data){
            console.log("success");
            var d = data.dates;
            var tmp = [];
            $.each(d, function(i,v){
                var dateISO = v.replace(/\D/g, " ")
                var dateCompo = dateISO.split(" ");
                dateCompo[1]--;
                var dateUTC = Date.UTC(dateCompo[0], dateCompo[1], dateCompo[2]);
                tmp.push(dateUTC)
            });
            dataset.dates = data.dates;
            dataset.datas = data.datas;
            $("#filename").val(data.filename);
            var shape = data.shape;
            dataset.pays = shape.split('_')[0];
            dataset.decoupage = shape.split('_')[1];
            dataset.urlShape = addr + shape;
            updateDate(dataset.dates);
            $.getJSON(dataset.urlShape, function(geojson){
                $("#mapcontainer").highcharts().addSeries({
                    mapData: geojson,
                    data: dataset.datas.lvmean.all_dist[0],
                    joinBy: ['name','code'],
                });
                $("#mapcontainer").highcharts().setTitle({ text: $("#dates option:selected").text() + ' ' + dataset.pays +": "+ $("#variableSel").val() + "(" + $("#calcul").val().substr(2, $("#calcul").val().length) + ")"}, { text:   "decoupage geographique: "+dataset.decoupage});
                $("#plotcontainer").highcharts().setTitle({ text: "Profil temporel"}, { text: $("#variableSel").val()});
            });                    
        },
        error : function(xhr,errmsg,err) {
            console.log('erreur: '+errmsg);
            console.log(xhr.status + ": " + xhr.responseText); // provide a bit more info about the error to the console
        }
    })
});



// ########################## add plots ########################################################################

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
    $.ajax({
        async: false,
        type: "POST",
        url: '',
        dataType: 'json',
        data: $("[id$='IS']").serialize(),
        beforeSend: function(xhr, settings) {
            xhr.setRequestHeader("X-CSRFToken", $.cookie('csrftoken'));
            $("#plotcontainer").highcharts().showLoading();
        },
        complete: function(){
            $("#plotcontainer").highcharts().hideLoading();
        },
        success: function(data){
            datasetInSitu.header = data.header;
            datasetInSitu.variable = data.varName;
            datasetInSitu.datas = [];
            datasetInSitu.dates = [];
            $.each(data.dates, function(dateNo, date){
                var tmp=[];
                var dateISO = date.replace(/\D/g, " ");
                var dateCompo = dateISO.split(" ");
                dateCompo[1]--;
                var dateUTC = Date.UTC(dateCompo[0], dateCompo[1], dateCompo[2],dateCompo[3], dateCompo[4], dateCompo[5]);
                tmp.push(dateUTC, parseFloat(data.datas[dateNo]));
                datasetInSitu.datas.push(tmp);
            });
            if(typeof $("#plotcontainer").highcharts().get(datasetInSitu.variable) == 'undefined'){
                $("#plotcontainer").highcharts().addAxis({
                    id: datasetInSitu.variable,
                    title: {
                        text: datasetInSitu.variable
                    },
                    lineWidth: 2,
                    //lineColor: '#08F',
                    opposite: true
                });
            }
            $("#plotcontainer").highcharts().addSeries({
                yAxis: datasetInSitu.variable,
                name: datasetInSitu.header+'_'+datasetInSitu.variable,
                data: datasetInSitu.datas,
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
    $.ajax({
        async: false,
        type: "POST",
        url: '',
        dataType: 'json',
        data: $("[id$='EP']").serialize(),
        beforeSend: function(xhr, settings) {
            xhr.setRequestHeader("X-CSRFToken", $.cookie('csrftoken'));
            $("#plotcontainer").highcharts().showLoading();
        },
        complete: function(){
            $("#plotcontainer").highcharts().hideLoading();
        },
        success: function(data){
            datasetInSitu.header = data.header;
            datasetInSitu.variable = data.varName;
            datasetInSitu.datas = [];
            datasetInSitu.dates = [];
            $.each(data.dates, function(dateNo, date){
                var tmp=[];
                var dateISO = date.replace(/\D/g, " ");
                var dateCompo = dateISO.split(" ");
                dateCompo[1]--;
                var dateUTC = Date.UTC(dateCompo[0], dateCompo[1], dateCompo[2],dateCompo[3], dateCompo[4], dateCompo[5]);
                tmp.push(dateUTC, parseFloat(data.datas[dateNo]));
                datasetInSitu.datas.push(tmp);
            });
            if(typeof $("#plotcontainer").highcharts().get(datasetInSitu.variable) == 'undefined'){
                $("#plotcontainer").highcharts().addAxis({
                    id: datasetInSitu.variable,
                    title: {
                        text: datasetInSitu.variable
                    },
                    lineWidth: 2,
                    //lineColor: '#08F',
                    opposite: true
                });
            }
            $("#plotcontainer").highcharts().addSeries({
                yAxis: datasetInSitu.variable,
                name: datasetInSitu.header+'_'+datasetInSitu.variable,
                data: datasetInSitu.datas,
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


$('#mapcontainer').highcharts('Map', {
    title : {
        text : 'Statistiques',
    },
    subtitle: {
        text: '' ,
        x: -10
    },
    mapNavigation: {
        enabled: true,
        buttonOptions: {
            verticalAlign: 'bottom'
        }
    },
    colorAxis: {
        nullColor: 'white',
        minColor: "#FFF8DC",
        maxColor: "#B22222"
    },
    plotOptions:{
    	series:{
        	point:{
                	events:{
                    	click: function(){
                            var newserie = dataset.datas[$("#calcul").val()].series_temporelles[this.name];
                            newserie.data = $.map(newserie.data, function (value) {
                                return isNaN(value) ? { y: null } : value;
                            });
                            var newDataset = [];
                            console.log(dataset.dates);
                            $.each(dataset.dates, function(dateNo, date){
                                var tmp=[];
                                var dateISO = date.replace(/\D/g, " ");
                                var dateCompo = dateISO.split(" ");
                                dateCompo[1]--;
                                var dateUTC = Date.UTC(dateCompo[0], dateCompo[1], dateCompo[2]);
                                tmp.push(dateUTC, parseFloat(newserie.data[dateNo]));
                                newDataset.push(tmp);
                            });
                            console.log(newDataset);
                            $("#plotcontainer").highcharts().addSeries({
                                name: newserie.name+' '+$("#calcul").val().substr(2, $("#calcul").val().length),
                                data: newDataset
                            });
                            //$("#plotcontainer").highcharts().xAxis[0].setCategories(dataset.dates);
                            $("#plotcontainer").highcharts().setTitle({ text: "Profil temporel"}, { text: $("#variableSel").val()});          
                        }
                    }
            }
        }
    },
    series : [{
        allowPointSelect: true,
        cursor: 'pointer',
        states: {
            hover: {
                color: '#BADA55'
            }
        },
        dataLabels: {
            enabled: true,
            format: '{point.properties.name}'
        }
    }],
    credits: {
        enabled: false                
    },
});


$('#plotcontainer').highcharts({
    chart:{
        type: 'spline',
        zoomType: 'xy',
    },
    lang:{
        decimalPoint: ','
    },
    credits:{
        enabled: false
    },
    title: {
        text: 'Profil temporel'
    },
    subtitle: {
        text: ' '
    },
    legend: {
        enabled: true,
    },
    rangeSelector : {
        selected : 1
    },
    plotOptions: {
        series:{
            //pointInterval: 24*3600*1000
        },
    },        
    tooltip: {
        xDateFormat: '%Y-%m-%d',
        valueDecimals: 9
    },
    xAxis: [{
        type: 'datetime',
    }],
    yAxis: [{
        title: {
            text: ''
        }
    }],
    exporting:{
        enabled: true
    },
});

//$("#load").hide();
$("#clear").on('click', function(){
    while($("#plotcontainer").highcharts().series.length > 0){
                $("#plotcontainer").highcharts().series[0].remove(true);
            }
    //while ($("#plotcontainer").highcharts().yAxis.length != 0){
            //for (var i=0; i < $("#plotcontainer").highcharts().yAxis.length; i++){
                //$("#plotcontainer").highcharts().yAxis[i].remove(true);
            //}
        //}
});