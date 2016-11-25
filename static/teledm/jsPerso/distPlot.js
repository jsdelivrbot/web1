function chart(jsdatas, map) {
        var datas = jsdatas.datas;
        var series_temporelles = datas.lvmean.series_temporelles;
        //fonction d affichage carto
        $.getJSON(map, function (geojson) {
            mapChart = $('#mapcontainer').highcharts('Map', {
                title : {
                    text : 'Statistiques de '+jsdatas.shape
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
                    data : datas.lvmean.all_dist[0],
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
        });
        // load dates
        var numbers = jsdatas.dates;
        var option = '';
        for (var i=0;i<numbers.length;i++){
           option += '<option value="'+ i + '">' + numbers[i] + '</option>';
        }
        $('#dates').append(option);
        // fonction graphe serie temporelle
        var chart = new Highcharts.Chart({
            chart: {
                type:'line',
                renderTo:'plotcontainer',
                zoomType: 'xy',
                panKey: 'ctrl',
            },
            title: {
                text: 'Daily ',
                x: -20 //center
            },
            subtitle: {
                text: 'Climatologie CRC',
                x: -20
            },
            xAxis: {
                categories: jsdatas.dates
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
                name: 'Garango',
                data: series_temporelles.Garango,
                dashStyle: 'shortdot',
            }],
            credits: {
                enabled: false                
            },
        });
    $('#dates').change(function() {
        alert($(this).val());
        //mapChart.series[0].update(mapdatas.vmean[$(this).val()]);
    });
};