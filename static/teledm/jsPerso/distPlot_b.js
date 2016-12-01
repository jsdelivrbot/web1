function initMapChart(){
    $.getJSON(map, function (geojson) {
        $('#mapcontainer').highcharts('Map', {
            title : {
                text : '',
            },
            subtitle: {
                text: '',
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
                data : [],
                mapData: geojson,
                joinBy: ['name','code'],
                name: 'vmean',
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
    }

    var chart = new Highcharts.Chart({
        chart: {
            type:'line',
            renderTo:'plotcontainer',
            zoomType: 'xy',
            panKey: 'ctrl',
        },
        title: {
            text: '',
            x: -20 //center
        },
        subtitle: {
            text: 'Climatologie CRC',
            x: -20
        },
        xAxis: {
            categories: ''
        },
        yAxis: {
            title: {
                text: ' (°C)'
            },
            plotLines: [{
                value: 1,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            valueSuffix: '°C'
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        },
        plotOptions: {
            series: {
                connectNulls: false
            }
        },
        series: [{
            name: '',
            data: '',
            dashStyle: 'shortdot',
        }],
        credits: {
            enabled: false                
        },
    });
}   


function charts(jsdatas, form, map) {
        var datas = jsdatas.datas;
        // load dates
        var numbers = jsdatas.dates;
        var option = '';
        for (var i=0;i<numbers.length;i++){
           option += '<option value="'+ i + '">' + numbers[i] + '</option>';
        }
        $('#dates').append(option);
        $('#dates').change(function() {
            var d = $(this).val();
            alert(d);
            var newmap = datas.lvmean.all_dist[d];
            //mapchart.series[0].setData(newmap, true);  
        });
        var series_temporelles = datas.lvmean.series_temporelles;
        //initMapChart();
        //initChart();
}