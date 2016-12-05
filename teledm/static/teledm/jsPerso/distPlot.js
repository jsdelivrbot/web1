var dataset = {
    pays: '',
    decoupage: '',
    dates: [],
    datas: [],
    urlShape: '',
    fileOut: ''
};


function updateDate(dates){
    var option = '';
    for (var i=0;i<dates.length;i++){
       option += '<option value="'+ i + '">' + dates[i] + '</option>';
    }
    $("#dates").empty().append(option);
}

function updateMap(datas, date, url){
    $.getJSON(url, function(geojson){
        $("#mapcontainer").highcharts().addSeries({
            mapData: geojson,
            data: datas,
            joinBy: ['name','code']
        });
    });
    $("#mapcontainer").highcharts().setTitle({ text: dataset.pays + ": Stats mean" }, { text:   date});
}

function updateMap(datas, url){
    $("#dates").on('change', function(){
        console.log(datas[this.values]);
        $.getJSON(url, function(geojson){
            $("#mapcontainer").highcharts().addSeries({
                mapData: geojson,
                data: datas[this.value],
                joinBy: ['name','code']
            });
        });
        //updateMap(dataset.data.lvmean[this.value], $("#dates option:selected").text(), dataset.urlShape);
    });
}


$("#moyenne").on('submit', function(e){
    e.preventDefault();    
    console.log("form submitted!");
    $.ajax({
        async: false,
        type: "POST",
        url: '',
        dataType: 'json',
        data: $("#moyenne").serialize(),
        //csrfmiddlewaretoken: '{{ csrf_token }}',
        beforeSend: function(xhr, settings) {
            xhr.setRequestHeader("X-CSRFToken", $.cookie('csrftoken'));
        },
        success: function(data){
            console.log("success");
            dataset.dates = data.dates;
            dataset.datas = data.datas;
            dataset.fileOut = data.filename;
            var shape = data.shape;
            dataset.pays = shape.split('_')[0];
            dataset.decoupage = shape.split('_')[1];
            dataset.urlShape = addr + shape;
            updateDate(dataset.dates);
            if($("#mapcontainer").highcharts().series.length !=0){
                $("#mapcontainer").highcharts().series[0].remove(true);
            }
            $.getJSON(dataset.urlShape, function(geojson){
                $("#mapcontainer").highcharts().addSeries({
                    mapData: geojson,
                    data: dataset.datas.lvmean.all_dist[0],
                    joinBy: ['name','code']
                });
                $("#mapcontainer").highcharts().setTitle({ text: dataset.pays + ": Stats mean" }, { text:   "decoupage geographique: "+dataset.decoupage});
            });
            console.log(dataset.datas.lvmean.all_dist[1]);
            updateMap(dataset.datas.lvmean.all_dist, dataset.urlShape);
                    
        },
        error : function(xhr,errmsg,err) {
            console.log('erreur: '+errmsg);
            console.log(xhr.status + ": " + xhr.responseText); // provide a bit more info about the error to the console
        }

    })
    console.log(dataset.dates);
});


$('#mapcontainer').highcharts('Map', {
    title : {
        text : 'Statistiques du (par )',
    },
    subtitle: {
        text: 'Periode du  au ' ,
        x: -10
    },
    mapNavigation: {
        enabled: true,
        buttonOptions: {
            verticalAlign: 'bottom'
        }
    },
    colorAxis: {
    },
    plotOptions:{
    	series:{
        	point:{
                	events:{
                    	click: function(){
                            var newserie = series_temporelles[this.name];
                            newserie.data = $.map(newserie.data, function (value) {
                                return isNaN(value) ? { y: null } : value;
                            });
                            chart.series[0].update(newserie);               
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
    exporting:{
        enabled: true
    },
});