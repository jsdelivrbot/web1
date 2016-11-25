function scatterPlot(data) {
    $('#plot1').highcharts({
        xAxis: {
            title: {
                enabled: true,
                text: data.prd1 + ' (' + data.prd1Var + ')'
            },
        },
        yAxis: {
            title: {
                text: data.sat + ' (' + data.satVar + ')'
            }
        },
        title: {
            text: data.prd1 + ' ' + data.station1 + '/' + data.sat + ' ' + data.zone
        },
        subtitle: {
            text: 'Source: CRCT'
        },
        legend: {
            layout: 'vertical',
            align: 'left',
            x: 80,
            verticalAlign: 'top',
            y: 55,
            floating: true,
            backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#F5F5F5'
        },
        series: [{
            type: 'line',
            name: 'y=' +data.a1.toFixed(4) + 'x+' + data.b1.toFixed(2) + ', r2=' + data.rCarre1.toFixed(2),
            data: data.line1,
            color: 'rgb(255, 102, 102)',
            marker: {
                enabled: false
            },
            states: {
                hover: {
                    lineWidth: 0
                }
            },
            enableMouseTracking: false
        }, {
            type: 'scatter',
            name: 'Observations',
            data: data.scatterValues1,
            color: 'rgb(80,80,80)',
            marker: {
                radius: 2,
            }
        }]
    });


    $('#plot2').highcharts({
        xAxis: {
            title: {
                enabled: true,
                text: data.prd2 + ' (' + data.prd2Var + ')'
            },
        },
        yAxis: {
            title: {
                text: data.sat + ' (' + data.satVar + ')'
            }
        },
        title: {
            text: data.prd2 + ' ' + data.station2 + '/' + data.sat + ' ' + data.zone
        },
        subtitle: {
            text: 'Source: CRCT'
        },
        legend: {
            layout: 'vertical',
            align: 'left',
            x: 80,
            verticalAlign: 'top',
            y: 55,
            floating: true,
            backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#F5F5F5'
        },
        series: [{
            type: 'line',
            name: 'y=' +data.a2.toFixed(4) + 'x+' + data.b2.toFixed(2) + ', r2=' + data.rCarre2.toFixed(2),
            data: data.line2,
            color: 'rgb(255, 102, 102)',
            marker: {
                enabled: false
            },
            states: {
                hover: {
                    lineWidth: 0
                }
            },
            enableMouseTracking: false
        }, {
            type: 'scatter',
            name: 'Observations',
            data: data.scatterValues2,
            color: 'rgb(80,80,80)',
            marker: {
                radius: 2,
            }
        }]
    });

    $('#plot3').highcharts({
        chart: {
            zoomType: 'xy'
        },
        title: {
            text: data.periode + ' Average'
        },
        subtitle: {
            text: 'Source: CRCT'
        },
        xAxis: [{
            categories: data.dates,
            crosshair: true
        }],
        yAxis: [{ // Primary yAxis
            labels: {
                format: '{value}',
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            },
            title: {
                text: data.sat,
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            },
            opposite: true
        }, { // Secondary yAxis
            gridLineWidth: 0,
            title: {
                text: data.prd1,
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            },
            labels: {
                format: '{value}',
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            }

        }, { // Tertiary yAxis
            gridLineWidth: 0,
            title: {
                text: data.prd2,
                style: {
                    color: Highcharts.getOptions().colors[2]
                }
            },
            labels: {
                format: '{value}',
                style: {
                    color: Highcharts.getOptions().colors[2]
                }
            },
            opposite: true
        }, { // 4th yAxis
            gridLineWidth: 0,
            title: {
                text: 'Incidence',
                style: {
                    color: Highcharts.getOptions().colors[3]
                }
            },
            labels: {
                format: '{value}',
                style: {
                    color: Highcharts.getOptions().colors[3]
                }
            },
        }],
        tooltip: {
            shared: true
        },
        legend: {
            layout: 'vertical',
            align: 'left',
            x: 80,
            verticalAlign: 'top',
            y: 55,
            floating: true,
            backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
        },
        series: [{
            name: data.sat + '( ' + data.satVar + ')',
            type: 'spline',
            yAxis: 2,
            data: data['moy_'+data.sat],
            tooltip: {
                valueSuffix: ''
            }

        }, {
            name: data.prd1 + '( ' + data.prd1Var + ')',
            type: 'spline',
            yAxis: 1,
            data: data['moy_'+data.prd1],
            marker: {
                enabled: false
            },
            dashStyle: 'shortdot',
            tooltip: {
                valueSuffix: ''
            }

        }, {
            name: data.prd2 + '( ' + data.prd2Var + ')',
            type: 'spline',
            yAxis: 2,
            data: data['moy_'+data.prd2],
            tooltip: {
                valueSuffix: ''
            }
        }, {
            name: 'Incidence',
            type: 'spline',
            yAxis: 1,
            data: data.incidence,
            tooltip: {
                valueSuffix: ''
            }
        }]
    });
});