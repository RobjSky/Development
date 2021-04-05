(function () {
    // Define this code as a plugin in the mstrmojo object
    if (!mstrmojo.plugins.AZoomableDateTime) {
        mstrmojo.plugins.AZoomableDateTime = {};
    }
    // All mojo visualizations require the CustomVisBase library to render
    mstrmojo.requiresCls("mstrmojo.CustomVisBase");
    var colors = []; //to maintain the color object for each metric
    var metricColors = [];

    /**
     * A visualization that integrates Microstrategy data with Google Charts code
     * @extends mstrmojo.CustomVisBase
     */
    // Declare the visualization object
    mstrmojo.plugins.AZoomableDateTime.AZoomableDateTime = mstrmojo.declare(
        // Declare that this code extends CustomVisBase
        mstrmojo.CustomVisBase,
        null, {
            // Define the JavaScript class that renders your visualization as mstrmojo.plugins.{plugin name}.{js file name}
            scriptClass: 'mstrmojo.plugins.AZoomableDateTime.AZoomableDateTime',
            // Define the CSS class that will be appended to container div
            cssClass: "AZoomableDateTime",
            // Define the error message to be displayed if JavaScript errors prevent data from being displayed
            errorDetails: "This visualization requires one or more attributes and one metric. :-) Expected Date-Format: [dd.mm.yy](-:",
            // Define the external libraries to be used - in this sample. the Google Charts library
            externalLibraries: [{
                    url: "//cdn.amcharts.com/lib/4/core.js"
                },
                {
                    url: "//cdn.amcharts.com/lib/4/charts.js"
                }, {
                    url: "//cdn.amcharts.com/lib/4/themes/animated.js"
                }
            ],

            // Define whether a tooltip should be displayed with additional information
            useRichTooltip: true,
            // Define whether the DOM should be reused on data/layout change or reconstructed from scratch
            reuseDOMNode: false,



            plot: function () {
                var me = this;
                var domNode = this.domNode,
                    dp = this.dataInterface;


                // set metric colors from Properties or default value
                // me.getProperty("lineColor0") --> {"fillColor":"#ffff00"}
                // metricColors --> [{"fillColor":"#ffff00"},{"fillColor":"#000000"}]
                // metricColors[0] --> {"fillColor": "#ffff00"}
                if (me.getProperty("lineColor0")) {
                    //metricColors.push(me.getProperty("lineColor0"));
                    metricColors[0] = me.getProperty("lineColor0");
                } else {
                    metricColors[0] = {
                        fillColor: "#00ff00"
                    };
                }
                if (me.getProperty("lineColor1")) {
                    metricColors[1] = me.getProperty("lineColor1");
                } else {
                    metricColors[1] = {
                        fillColor: "#D65DB1"
                    };
                }


                //------------------ POPUP for Debugging INPUT------------------//
                var Say1 = 'metricColors: <br>' + JSON.stringify(metricColors) +
                    ' <br> metricColors[0]: <br>' + JSON.stringify(metricColors[0]);
                var Say2 = 'me.getProperty("lineColor0"): <br>' + JSON.stringify(me.getProperty("lineColor0"))
                //var myWindow2 = PopUp(Say1, Say2);


                this.setDefaultPropertyValues({
                    showLegend: 'true',
                    positionLegend: 'bottom',
                });

                //* ---------------------------------------
                //* https://codepen.io/team/amcharts/pen/moyWJW/
                //* For more information visit:                 * https://www.amcharts.com/
                //* Documentation is available at:              * https://www.amcharts.com/docs/v4/
                //* ---------------------------------------

                am4core.useTheme(am4themes_animated);
                // ! Alert window
                // ! window.alert('am4core'); //Karina
                // ! window.alert(typeof am4core); //Karina     check if library loaded (if undefined, not loaded)
                // Create chart instance
                var chart2 = am4core.create(this.domNode, am4charts.XYChart);

                chart2.colors.list = [
                    am4core.color(metricColors[0].fillColor),
                    am4core.color(metricColors[1].fillColor),
                    am4core.color("#FF6F91"),
                    am4core.color("#FF9671"),
                    am4core.color("#FFC75F"),
                    am4core.color("#F9F871")
                ];


                // Add data
                var datapool = prepareData();
                //window.alert("datapool: " + JSON.stringify(datapool.rows));
                chart2.data = datapool.rows;
                //window.alert("chart2.Data: " + JSON.stringify(chart2.data));

                // Create axes
                var dateAxis = chart2.xAxes.push(new am4charts.DateAxis());
                dateAxis.renderer.grid.template.location = 0;

                var valueAxis = chart2.yAxes.push(new am4charts.ValueAxis());

                // Create series
                function createSeries(field, name, hiddenInLegend) {
                    var series = chart2.series.push(new am4charts.LineSeries());
                    series.dataFields.valueY = field;
                    series.dataFields.dateX = "date";
                    series.name = name;
                    series.tooltipText = "{dateX}: {name}: [b]{valueY}[/]";
                    series.strokeWidth = 2;
                    if (me.getProperty("displayFill") === 'true') {
                        //series.fillOpacity = 0.1;
                        series.fillOpacity = me.getProperty("amountFillOpacity") / 10;
                    }
                    if (hiddenInLegend) {
                        series.hiddenInLegend = true;
                    }

                    var bullet = series.bullets.push(new am4charts.CircleBullet());
                    bullet.circle.stroke = am4core.color("#fff");
                    bullet.circle.strokeWidth = 2;

                    return series;
                }

                let allSeries = [];

                datapool.cols.forEach((col, i) => {
                    var s = createSeries("values" + i, col);
                    allSeries.push(s);
                })

                // And, for a good measure, let's add a legend and a cursor
                if (me.getProperty("showLegend") === 'true') {
                    chart2.legend = new am4charts.Legend();
                    chart2.legend.position = me.getProperty("positionLegend");
                }
                if (me.getProperty("displayXYCursor") === 'true') {
                    chart2.cursor = new am4charts.XYCursor();
                }








                //------------------ POPUP for Debugging INPUT------------------//
                var Say1 = 'datapool: <br>' + JSON.stringify(datapool.rows);
                var Say2 = 'ende'
                //var myWindow2 = PopUp(Say1, Say2);


                // Create a horizontal scrollbar with previe and place it underneath the date axis
                if (me.getProperty("displayXYChartScrollbar") === 'true') {
                    allSeries[0].show(); // hardcoded reference for series1
                    chart2.scrollbarX = new am4charts.XYChartScrollbar();
                    chart2.scrollbarX.series.push(allSeries[0]);
                    chart2.scrollbarX.parent = chart2.bottomAxesContainer;
                    chart2.scrollbarX.scrollbarChart.plotContainer.filters.clear(); // remove desaturation
                    //chart2.scrollbarX.scrollbarChart.plotContainer.filters.DesaturateFilter.saturation = 0.5;
                }



                // ! Prepare Data
                // https://lw.microstrategy.com/msdz/MSDL/GARelease_Current/_GARelease_Archives/103/docs/projects/VisSDK_All/Default.htm#topics/HTML5/Data_Interface_API.htm
                function prepareData() {
                    // Create a new array (datapool) and push the objects datarecords to the new array. each datarecord is one single object in the array.
                    // additional a check on "how many attributes?" and "how many metrics are being used?" must be performed to derive the FOR-Indicators
                    // additional a check is needed to format the datetime attribute from MSTR to a datetime attibute in JS.
                    // datapool = {"cols" : [mtr1.Name, mtr2.Name],
                    //             "rows" : [{ "attr.Name" : attr.Value1,
                    //                         "mtr1.Name" : mtr1.Value1,
                    //                         "mtr2.Name" : mtr2.Value1 }, {"attr.Name" : attr.Value2, ...}, {...}], 

                    var datapool = {};
                    datapool.cols = [];
                    // set metric column names ["metricname1","metricname2"]
                    for (var z = 0; z < dp.getColumnHeaderCount(); z++) {
                        datapool.cols[z] = dp.getColHeaders(0).getHeader(z).getName();
                    }

                    //set rows data
                    var rows = [];
                    //go thru all rows
                    for (i = 0; i < dp.getTotalRows(); i++) {
                        var c = {}
                        // get date from data. date needs to be in the form of dd.mm.yy
                        c.date = dp.getRowHeaders(i).getHeader(0).getName();
                        // if date then (Input dd.mm.yy)
                        var parts = c.date.split('.');
                        // convert to Datetime-Format yyyy-mm-ddThh:mm:ss.000Z
                        c.date = new Date('20' + parts[2], parts[1] - 1, parts[0])
                        c.values = [];
                        for (var z = 0; z < dp.getColumnHeaderCount(); z++) {
                            c['values' + z] = dp.getMetricValue(i, z).getRawValue()
                        }
                        // push c to current position in rows-Array. Meaning c.date and c.values, resulting in {"date" : "yyyy-mm-ddThh:mm:ss.000Z" , "values" : 123 , "values0" : 456}
                        rows[i] = c;
                        //window.alert('rows[i]: ' + JSON.stringify(rows[i]));
                    }
                    datapool.rows = rows;
                    //window.alert('datapool.rows[]: ' + JSON.stringify(datapool.rows));
                    //window.alert('datapool: ' + JSON.stringify(datapool));

                    return datapool;
                };
                //------------------ POPUP for Debugging ------------------//
                function PopUp(Say1, Say2) {
                    //window.alert("hello");
                    //var ScreenWidth = window.screen.width;
                    //var ScreenHeight = window.screen.height;
                    //placementx = (ScreenWidth / 2) - ((400) / 2);
                    //placementy = (ScreenHeight / 2) - ((300 + 50) / 2);
                    var myWindow = window.open("", "", "width=400,height=500");
                    //myWindow.document.write('<html>\n<head>\n</head>\n<body>' + 'Some TExt: ' + Say1 + '</body></html>');
                    var SayWhat = "<p><font color='blue'>" + Say1 + "</font></p><p><font color='black'>" + Say2 + "</font></p>";
                    myWindow.document.write('<html>\n<head>\n</head>\n<body>' + SayWhat + '</body></html>');
                }
            }
        },
    );
}());