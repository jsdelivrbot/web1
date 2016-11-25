$(function (jsdatas, form, map) {
    var datas = jsdatas.datas;
    // load dates
    var numbers = jsdatas.dates;
    var option = '';
    for (var i=0;i<numbers.length;i++){
       option += '<option value="'+ i + '">' + numbers[i] + '</option>';
    }
    $('#dates').append(option);

    var series_temporelles = datas.lvmean.series_temporelles;
    $.getJSON(map, function (geojson) {

        // Initiate the chart
        var chart = Highcharts.mapChart('mapcontainer', {

            title: {
                text: 'Statistiques du '+ form.pays + '(par ' + form.decoupage + ')'
            },

            subtitle: {
                text: 'Periode du ' + form.datedebut + ' au ' + form.datefin,
                x: -10
            },

            colorAxis: {
            },

            series: [{
                data: datas.lvmean.all_dist[0],
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
            }]
        });

        // Activate the button
        $('#dates').change(function () {
            chart.series[0].update({
                name: 'Updated series name',
                borderColor: 'black',
                dashStyle: 'dot'
            });
        });
    });
});

