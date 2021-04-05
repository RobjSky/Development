(function () {
    // Define this code as a plugin in the mstrmojo object
    if (!mstrmojo.plugins.CustomGoogleCharts) {
        mstrmojo.plugins.CustomGoogleCharts = {};
    }
    // All mojo visualizations require the CustomVisBase library to render
    mstrmojo.requiresCls("mstrmojo.CustomVisBase");
    /**
     * A visualization that integrates Microstrategy data with Google Charts code
     * @extends mstrmojo.CustomVisBase
     */
    // Declare the visualization object
    mstrmojo.plugins.CustomGoogleCharts.CustomGoogleCharts = mstrmojo.declare(
        // Declare that this code extends CustomVisBase
        mstrmojo.CustomVisBase,
        null,
        {
            // Define the JavaScript class that renders your visualization as mstrmojo.plugins.{plugin name}.{js file name}
            scriptClass: 'mstrmojo.plugins.CustomGoogleCharts.CustomGoogleCharts',
	    // Define the CSS class that will be appended to container div
            cssClass: "CustomGoogleCharts",
	    // Define the error message to be displayed if JavaScript errors prevent data from being displayed
            errorDetails: "This visualization requires one or more attributes and one metric.",
	    // Define the external libraries to be used - in this sample. the Google Charts library
            externalLibraries: [
                {url: "//cdn.jsdelivr.net/npm/apexcharts"}
            ],
            // Define whether a tooltip should be displayed with additional information
            useRichTooltip: true,
            // Define whether the DOM should be reused on data/layout change or reconstructed from scratch
            reuseDOMNode: false,
            plot: function () {
                var domNode = this.domNode, width = this.width, height = this.height, dp = this.dataInterface;
                function prepareData() {
                    var data = {};
                    // Set cols //attributes column header/type
                    data.cols = [];
                    data.cols[0] = {"id": "ATT_NAME_JS", "label": "Attribute", "type": "string"};
                    // Set metrics columns header/type
                    var i;
                    for (i = 0; i < dp.getColumnHeaderCount(); i++) {
                        var metricName = dp.getColHeaders(0).getHeader(i).getName();
                        data.cols[1 + i] = {"id": metricName, "label": metricName, "type": "number"};
                    }
                    // Set rows data
                    data.rows = [];
                    // Iterate thru all rows
                    for (i = 0; i < dp.getTotalRows(); i++) {
                        data.rows[i] = {};
                        var c = [], attributesValue = "";
                        // Set attribute values to single string for row
                        var a;
                        for (a = 0; a < dp.getRowHeaders(i).size(); a++) {
                            attributesValue += dp.getRowHeaders(i).getHeader(a).getName() + " ";
                        }
                        c[0] = {"v": attributesValue};
                        // Set metrics values in row
                        var z;
                        for (z = 0; z < dp.getColumnHeaderCount(); z++) {
                            c[1 + z] = {"v": dp.getMetricValue(i, z).getRawValue()};
                        }
                        data.rows[i].c = c;
                    }
                    return data;
                }

                function renderGraph() {
                    //var data2 = new google.visualization.DataTable(prepareData());
//                    var options = {'title': 'Google chart', 'width': width, 'height': height};
//                    var chart = new google.visualization.LineChart(domNode);
//                    chart.draw(data, options);
					
					
					var options = {	chart: {type: 'line'},
									series: [{name: 'sales',    data: [30,40,35,50,49,60,70,91,125]  }],
									xaxis: {categories: [1991,1992,1993,1994,1995,1996,1997, 1998,1999]}
					}
					//var chart = new ApexCharts(document.querySelector("#chart"), options);
                    var chart = new ApexCharts(domNode, options);

                    chart.render();
                }

                renderGraph();
                


//                google.load("visualization", "1", {"callback": function () {
//                    renderGraph();
//                }, "packages": ["corechart"]});
            }
        }
    );
});