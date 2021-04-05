(function () {
    // Define this code as a plugin in the mstrmojo object
    if (!mstrmojo.plugins.ApexLineChart) {
        mstrmojo.plugins.ApexLineChart = {};
    }
    // All mojo visualizations require the CustomVisBase library to render
    mstrmojo.requiresCls("mstrmojo.CustomVisBase");
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
            plot: function () {
                var domNode = this.domNode,
                    dp = this.dataInterface;

                function prepareData() {
                    var data = {};
                    // Set cols // attributes column header/type
                    data.cols = [];
                    data.cols[0] = {
                        "id": "ATT_NAME_JS",
                        "label": "Attribute",
                        "type": "string"
                    };
                    // Set metrics columns header/type
                    var i;
                    for (i = 0; i < dp.getColumnHeaderCount(); i++) {
                        var metricName = dp.getColHeaders(0).getHeader(i).getName();
                        data.cols[1 + i] = {
                            "id": metricName,
                            "label": metricName,
                            "type": "number"
                        };
                    }
                    // Set rows data
                    data.rows = [];
                    // Iterate thru all rows
                    for (i = 0; i < dp.getTotalRows(); i++) {
                        data.rows[i] = {};
                        var c = [],
                            attributesValue = "";
                        // Set attribute values to single string for row
                        var a;
                        for (a = 0; a < dp.getRowHeaders(i).size(); a++) {
                            attributesValue += dp.getRowHeaders(i).getHeader(a).getName() + " ";
                        }
                        c[0] = {
                            "v": attributesValue
                        };
                        // Set metrics values in row
                        var z;
                        for (z = 0; z < dp.getColumnHeaderCount(); z++) {
                            c[1 + z] = {
                                "v": dp.getMetricValue(i, z).getRawValue()
                            };
                        }
                        data.rows[i].c = c;
                    }
                    return data;
                }

                function renderGraph() {
                    var datatb = {};
                    datatb = prepareData();
                    //                    var data = new google.visualization.DataTable(prepareData());
                    //                    var options = {'title': 'Google chart', 'width': width, 'height': height};
                    //                    var chart = new google.visualization.LineChart(domNode);
                    //                    chart.draw(data, options);

                    var options = {
                        chart: {
                            type: 'line'
                        },
                        series: [{
                            name: 'sales',
                            data: [30, 40, 35, 50, 49, 60, 70, 91, 125]     // <-- get entire column 1 from datatb
                        }],
                        xaxis: {
                            categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999] // <-- get the entire column 0 from datatb
                        }
                    }
                    //var chart = new ApexCharts(document.querySelector("#chart"), options);
                    var chart = new ApexCharts(domNode, options);

                    chart.render();









                    
                    window.alert('Object.keys(datatb).length: ' + Object.keys(datatb).length);
                    window.alert('datatb.rows.length: ' + datatb.rows.length);















                    // Accessing Keys
                    window.alert('Object.keys(datatb): ' + Object.keys(datatb));
                    // Accessing Values
                    window.alert('datatb.cols[0].type: ' + datatb.cols[0].type + '\n' + 'datatb.cols[0].id: ' + datatb.cols[0].id + '\n' + 'datatb.cols[0].label: ' + datatb.cols[0].label);
                    window.alert('datatb.rows[0].c[0].v: ' + datatb.rows[0].c[0].v + '\n' + 'datatb.rows[0].c[1].v: ' + datatb.rows[0].c[1].v + '\n' + 'datatb.rows[1].c[1].v: ' + datatb.rows[1].c[1].v);


                    var Say1 = 'Stringify datatb ' + JSON.stringify(datatb);
                    var Say2 = 'Stringify datatb ' + Object.entries(datatb);
                    PopUp(Say1,Say2);

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

                //                google.load("visualization", "1", {"callback": function () {
                //                    renderGraph();
                //                }, "packages": ["corechart"]});
            }
        }
    );
}());