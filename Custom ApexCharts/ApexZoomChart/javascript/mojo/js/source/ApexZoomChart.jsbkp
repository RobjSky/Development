// https://apexcharts.com/javascript-chart-demos/area-charts/datetime-x-axis/
// https://codepen.io/junedchhipa/pen/zmbGPG

(function () {
   
    // Define this code as a plugin in the mstrmojo object
    if (!mstrmojo.plugins.ApexZoomChart) {
        mstrmojo.plugins.ApexZoomChart = {};
    }
    // All mojo visualizations require the CustomVisBase library to render
    mstrmojo.requiresCls("mstrmojo.CustomVisBase");
    /**
     * A visualization that integrates Microstrategy data with Google Charts code
     * @extends mstrmojo.CustomVisBase
     */
    // Declare the visualization object
    mstrmojo.plugins.ApexZoomChart.ApexZoomChart = mstrmojo.declare(
        // Declare that this code extends CustomVisBase
        mstrmojo.CustomVisBase,
        null, {
            // Define the JavaScript class that renders your visualization as mstrmojo.plugins.{plugin name}.{js file name}
            scriptClass: 'mstrmojo.plugins.ApexZoomChart.ApexZoomChart',
            // Define the CSS class that will be appended to container div
            cssClass: "ApexZoomChart",
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

            plot: function () {
                var domNode = this.domNode,
                    dp = this.dataInterface;

               
				
                function renderGraph() {
                    var options = {
                        chart: {
                            type: 'area',
                            width: '100%',
                            height: '100%'
                        },
                        title: {
                            text: '2018-09-24T00:00:00',
                            align: 'left',
                        },
                        dataLabels: {
                            enabled: false
                        },
                        stroke: {
                            width: 2
                        },
                        xaxis: {
                            labels: {datetimeFormatter: {year: 'yyyy', month: 'MMM \'yy', day: 'dd MMM', hour: 'HH:mm'}, },
                            type: 'datetime',
                            //'2018-09-24T00:00:00',
                            categories: ['2018-09-24T15:00:00',
                                         '2018-09-25T15:00:00',
                                         '2018-09-26T15:00:00',
                                         '2018-09-27T15:00:00',
                                         '2018-09-28T14:10:00',
                                         '2018-09-29T15:00:00',
                                         '2018-09-30T15:00:00',
                                         '2018-10-01T15:00:00',
                                         '2018-10-02T15:00:00',
                                         '2018-10-03T15:00:00',
                                         '2018-10-04T15:00:00',
                                         '2018-10-05T15:00:00',
                                         '2018-10-06T15:00:00',
                                         '2018-10-07T15:00:00',
                                         '2018-10-08T15:00:00',
                                         '2018-10-09T15:00:00',
                                         '2018-10-10T15:00:00',
                                         '2019-01-28T15:00:00'
                                         ],
                            min: new Date('24 Sep 2018').getTime(),
                            tickAmount: 6
                        },
                        series: [{
                            name: 'series1',
                            data: [30.95, 31.34, 31.18, 31.05, 31.00, 30.95, 31.24, 31.29, 38.89, 38.81, 38.61, 38.63, 38.99, 38.77, 38.34, 38.55, 38.11, 38.59]
                            }],
                        // yaxis: { decimalsInFloat: 2 },
                        fill: {
                            type: 'gradient',
                            gradient: {
                                shadeIntensity: 1,
                                opacityFrom: 0.7,
                                opacityTo: 0.9,
                                stops: [0, 100]
                            }
                        },
                    }



                    //var chart = new ApexCharts(document.querySelector("#chart"), options);
                    var chart = new ApexCharts(domNode, options);
                    
					debugger;
                    chart.render();
					
/*
                    // Accessing Keys
                    window.alert('Object.keys(datatb): ' + Object.keys(datatb));
                    // Accessing Values
                    window.alert('datatb.cols[0].type: ' + datatb.cols[0].type + '\n' + 'datatb.cols[0].id: ' + datatb.cols[0].id + '\n' + 'datatb.cols[0].label: ' + datatb.cols[0].label);
                    window.alert('datatb.rows[0].c[0].v: ' + datatb.rows[0].c[0].v + '\n' + 'datatb.rows[0].c[1].v: ' + datatb.rows[0].c[1].v + '\n' + 'datatb.rows[1].c[1].v: ' + datatb.rows[1].c[1].v);
*/
                    //------------------ POPUP for Debugging INPUT------------------//
                    var Say1 = 'This should be DateTime format: <br>'
                    for (i = 0; i < options.xaxis.categories.length; i++) {
                        Say1 += options.xaxis.categories[i] + "<br >";
                    }
                    
                    //'Stringify datatb ' + JSON.stringify(datatb);
                    var Say2 =  '1st Value from Category X_Axis:    ' + JSON.stringify(options.xaxis.categories[Object.keys(options.xaxis.categories)[0]]) + '<br>'
                               +'1st Value parsed as datetime:    ' + Date.parse(JSON.stringify(options.xaxis.categories[Object.keys(options.xaxis.categories)[0]])) + '<br>'
                               +'test as datetime:    ' + Date.parse("2018-09-24T00:00:00")

                    /*            'Attribute names:    ' + datatb.attrnames + '<br>'
                               +'Metric names:       ' + datatb.metricnames + '<br>'
                               +'Attribute #1:       ' + datatb.attrnames[Object.keys(datatb.attrnames)[0]] + '<br>'
                               +'Metric    #1:       ' + datatb.metricnames[Object.keys(datatb.metricnames)[0]] + '<br>'
                               +'1st metric values:  ' + datatb.metr[dp.getColHeaders(0).getHeader(0).getName()] + '<br>'
                               +'1st metric values:  ' + JSON.stringify(datatb.metr[Object.keys(datatb.metr)[0]]) + '<br>'
                               +'1st attr values:    ' + datatb.attr[Object.keys(datatb.attr)[0]] + '<br>'
                               +'1st attr values:    ' + JSON.stringify(datatb.attr[Object.keys(datatb.attr)[0]]) + '<br>'
                    */

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
                    WinPop = window.open("MyDebuggerWindow:Blank", "", "width=400,height=500,toolbar=0,location=0,directories=0,status=0,scrollbars=0,menubar=0,resizable=0,left=" + placementx + ",top=" + placementy + ",scre enX=" + placementx + ",screenY=" + placementy + ",");
                    var SayWhat = "<p><font color='blue'>" + Say1 + "</font></p><p><font color='blue'>" + Say2 + "</font></p>";
                    WinPop.document.write('<html>\n<head>\n</head>\n<body>' + SayWhat + '</body></html>');
                }
            }
        }
    );
}());