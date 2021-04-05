(function () {
    // Define this code as a plugin in the mstrmojo object
    if (!mstrmojo.plugins.ApexLineChart) {
        mstrmojo.plugins.ApexLineChart = {};
    }
    // All mojo visualizations require the CustomVisBase library to render
    mstrmojo.requiresCls("mstrmojo.CustomVisBase");

    mstrmojo.plugins.ApexLineChart.APLC_PROPERTIES = {
        LABEL_FONT: 'labelFont',
        NODE_WIDTH: 'nodeWidth',
        SHOW_LABEL: 'showLabel',
        LEGEND_POSITION: 'legendPosition',
        CHART_TYPE: 'chartType',
        COLORS_1: 'labelFillColor'
    };

    /**
     * A visualization that integrates Microstrategy data with Google Charts code
     * @extends mstrmojo.CustomVisBase
     */
    // Declare the visualization object
    mstrmojo.plugins.ApexLineChart.ApexLineChart = mstrmojo.declare(
        // Declare that this code extends CustomVisBase
        mstrmojo.CustomVisBase,
        null, {
            // Define the JavaScript class that renders your visualization as mstrmojo.plugins.{plugin name}.{js file name}
            scriptClass: 'mstrmojo.plugins.ApexLineChart.ApexLineChart',
            // Define the CSS class that will be appended to container div
            cssClass: "ApexLineChart",
            // Define the error message to be displayed if JavaScript errors prevent data from being displayed
            errorDetails: "This visualization requires one or more attributes and one metric.",
            // Define the external libraries to be used - in this sample. the Google Charts library
            externalLibraries: [{
                url: "//cdn.jsdelivr.net/npm/apexcharts"
            }],
            // Define whether a tooltip should be displayed with additional information
            useRichTooltip: true,
            // Define whether the DOM should be reused on data/layout change or reconstructed from scratch
            reuseDOMNode: false,



           // ANCHOR CUSTOM PROPERTIES
            updateLabelSize: function (labelsize) {
                    //chart.updateOptions({
                    chart5546.updateOptions({
                        title: {
                            text: 'Testing Mario' + labelsize,
                            align: 'left'
                        },
                    });
            },
            getNodeWidth: function getNodeWidth() {
                 var APLC_PROPERTIES = mstrmojo.plugins.ApexLineChart.APLC_PROPERTIES,
                     getNodeWidth = this.getProperty(APLC_PROPERTIES.NODE_WIDTH);
                 return getNodeWidth;
             },
             getLegendPosition: function getLegendPosition() {
                 var APLC_PROPERTIES = mstrmojo.plugins.ApexLineChart.APLC_PROPERTIES,
                     getLegendPosition = this.getProperty(APLC_PROPERTIES.LEGEND_POSITION);
                     if (getLegendPosition.l === "true") {
                         var legendPositionstr = 'left'
                     } else if (getLegendPosition.r === "true") {
                         var legendPositionstr = 'right'
                     } else if (getLegendPosition.b === "true") {
                         var legendPositionstr = 'bottom'
                     } else {
                         var legendPositionstr = 'top'
                     }
                 return legendPositionstr;
             },
             getChartType: function getChartType() {
                 var APLC_PROPERTIES = mstrmojo.plugins.ApexLineChart.APLC_PROPERTIES,
                     getChartType = this.getProperty(APLC_PROPERTIES.CHART_TYPE);
                     if (getChartType.area === "true") {
                         var charttypestr = 'area'
                     } else {
                         var charttypestr = 'line'
                     }
                 return charttypestr;
             },
             getShowLabel: function getShowLabel() {
                 var APLC_PROPERTIES = mstrmojo.plugins.ApexLineChart.APLC_PROPERTIES,
                     getShowLabel = this.getProperty(APLC_PROPERTIES.SHOW_LABEL);
                 return getShowLabel;
             },
             getColors: function getColors() {
                 var APLC_PROPERTIES = mstrmojo.plugins.ApexLineChart.APLC_PROPERTIES,
                     getColors = this.getProperty(APLC_PROPERTIES.COLORS_1);
                 return getColors;
             },



            plot: function () {
                var me = this;
                var domNode = this.domNode,
                dp = this.dataInterface;
                // Set the default values for adjustable properties
                this.setDefaultPropertyValues({
                    labelFont: {
                        fontSize: '12pt',
                        fontFamily: 'Arial',
                        fontColor: '#000'
                    },
                    nodeWidth: 2,
                    legendPosition: {t: 'true', l: 'false', r: 'false', b: 'false'},
                    chartType: {line: 'true', area: 'false'}
                });

                function prepareData() {
                    var dataobject = {};
                            dataobject.attrnames = [] // "attrnames": [ROW TITLE], Namen der Attribute
                            dataobject.metricnames = [] // "metricnames" : [COLUMN HEADER], Namen der Metriken
                            dataobject.attr = {} // attr = {'attrname': "values"}, [ROW HEADER],
                            dataobject.metr = {} // metr = {'metricname' : "values"}, [METRIC VALUE]

                    var i;
                    // Set Attribute names / Row title
                    for (i = 0; i < dp.getRowTitles().size(); i++) {
                        var attrName = dp.getRowTitles().getTitle(i).getName()
                        dataobject.attrnames.push(attrName)
                        dataobject.attr[attrName] = [];
                    }
                    // Set metrics names / columns header/type
                    for (i = 0; i < dp.getColumnHeaderCount(); i++) {
                        var metricName = dp.getColHeaders(0).getHeader(i).getName();
                        dataobject.metricnames.push(metricName)
                        dataobject.metr[metricName] = [];
                    }
                    // Iterate thru all rows / get total amount of rows
                    for (i = 0; i < dp.getTotalRows(); i++) {
                        // Set attribute values to single string for row
                        var a;
                        // iterate thru all columns
                        for (a = 0; a < dp.getRowHeaders(i).size(); a++) {
                            //Set Attribute name to the correct property
                            var attributename = dp.getRowTitles().getTitle(a).getName();
                            // get the value for the set attribute name
                            dataobject.attr[attributename].push(dp.getRowHeaders(i).getHeader(a).getName())
                        }

                        // Set metrics values in row
                        var z;
                        for (z = 0; z < dp.getColumnHeaderCount(); z++) {
                            //Set Metric name to the correct property
                            var metricname = dp.getColHeaders(0).getHeader(z).getName();
                            dataobject.metr[metricname].push(dp.getMetricValue(i, z).getRawValue())
                        }
                    }
                    return dataobject;
                }

                function renderGraph() {
                    var datatb = {};
                    datatb = prepareData();


                    var varseries = [];
                    // Set series of metric values
                    for (i = 0; i < datatb.metricnames.length; i++) {
                        varseries.push({ name: datatb.metricnames[Object.keys(datatb.metricnames)[i]],
                                         data: datatb.metr[Object.keys(datatb.metr)[i]]
                                       });
                    }


                    // read from format panel
                    var nodeWidth = me.getNodeWidth();
                    var legendPositionstr = me.getLegendPosition();
                    var charttypestr = me.getChartType();
                    var getShowLabel = me.getShowLabel();
                    var colors = me.getColors();
                    window.alert('Object.keys(datatb): ' + color.attr.fill.toString());
                    //window.alert('Object.keys(datatb): ' + colors.fillColor.toString());

                    // set options
                    var options = {
                        chart: {
                            type: charttypestr,
                            width: '100%',
                            height: '100%'
                        },
                        title: {
                            text: 'charttypestr: ' + charttypestr + ' //nodeWidth: ' + nodeWidth + ' // getShowLabel: ' + getShowLabel + ' // legendPositionstr: ' + legendPositionstr,
                            offsetX: 10
                        },
                        stroke: {
                            width: nodeWidth
                        },
                        dataLabels: {
                            enabled: getShowLabel,
                        },
                        legend: {
                            position: legendPositionstr
                        },
                        series: varseries,
                        xaxis: {
                            categories: datatb.attr[Object.keys(datatb.attr)[0]]
                            //categories: ["1991", "1992", "1993", "1994", "1995", "1996", "1997", "1998", "1999"]
                        },
                        yaxis: {
                            decimalsInFloat: 2,
                        }
                    }


                    //var chart = new ApexCharts(document.querySelector("#chart"), options);
                    //chart = new ApexCharts(domNode, options);
                    window.chart5546 = new ApexCharts(domNode, options);

                    //chart.render();
                    chart5546.render();


/*
                    // Accessing Keys
                    window.alert('Object.keys(datatb): ' + Object.keys(datatb));
                    window.alert('Object.keys(options): ' + Object.keys(options));
                    
                    // Accessing Values
                    window.alert('Object.JSON.stringify(options): ' + JSON.stringify(options));
                    window.alert('datatb.cols[0].type: ' + datatb.cols[0].type + '\n' + 'datatb.cols[0].id: ' + datatb.cols[0].id + '\n' + 'datatb.cols[0].label: ' + datatb.cols[0].label);
                    window.alert('datatb.rows[0].c[0].v: ' + datatb.rows[0].c[0].v + '\n' + 'datatb.rows[0].c[1].v: ' + datatb.rows[0].c[1].v + '\n' + 'datatb.rows[1].c[1].v: ' + datatb.rows[1].c[1].v);
*/
                    //------------------ POPUP for Debugging INPUT------------------//
                    var Say1 = 'Stringify datatb ' + JSON.stringify(datatb);
                    var Say2 =  'Attribute names:    ' + datatb.attrnames + '<br>'
                               +'Metric names:       ' + datatb.metricnames + '<br>'
                               +'Attribute #1:       ' + datatb.attrnames[Object.keys(datatb.attrnames)[0]] + '<br>'
                               +'Metric    #1:       ' + datatb.metricnames[Object.keys(datatb.metricnames)[0]] + '<br>'
                               +'1st metric values:  ' + datatb.metr[dp.getColHeaders(0).getHeader(0).getName()] + '<br>'
                               +'1st metric values:  ' + JSON.stringify(datatb.metr[Object.keys(datatb.metr)[0]]) + '<br>'
                               +'1st attr values:    ' + datatb.attr[Object.keys(datatb.attr)[0]] + '<br>'
                               +'1st attr values:    ' + JSON.stringify(datatb.attr[Object.keys(datatb.attr)[0]]) + '<br>'
                    ;
                    //PopUp(Say1,Say2);
                }
                renderGraph();



                //------------------ POPUP for Debugging ------------------//
                function PopUp(Say1,Say2) {
                    var ScreenWidth = window.screen.width;
                    var ScreenHeight = window.screen.height;
                    placementx = (ScreenWidth / 2) - ((400) / 2);
                    placementy = (ScreenHeight / 2) - ((300 + 50) / 2);
                    WinPop = window.open("MyDebuggerWindow:Blank", "", "width=400,height=300,toolbar=0,location=0,directories=0,status=0,scrollbars=0,menubar=0,resizable=0,left=" + placementx + ",top=" + placementy + ",scre enX=" + placementx + ",screenY=" + placementy + ",");
                    var SayWhat = "<p><font color='blue'>" + Say1 + "</font></p><p><font color='blue'>" + Say2 + "</font></p>";
                    WinPop.document.write('<html>\n<head>\n</head>\n<body>' + SayWhat + '</body></html>');
                }
            }
        }
    );
}());