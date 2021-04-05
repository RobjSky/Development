// Code explanation: 
//     - mstrmojo.plugins.MstrVisGoogleCharts.MstrVisGoogleCharts is the JavaScript file that holds the code for your visualization, constructed 
//       as mstrmojo.plugins.{plugin name}.{js file name}.
//     - mstrmojo.CustomVisBase is the mojo super class that your class extends.
//     - null represents the fact that you do not have any mixins at this point. Mixins are mojo objects that extend your class.
//     - scriptClass is a required variable that holds the name of your JavaScript class. It is constructed as mstrmojo.plugins.{plugin folder name}.{js file name}.
//     - plot is a function that triggers rendering the visualization. Since this is the starting point for all custom code, in this case all the code to render the 
//       visualization is placed inside this function.

//     - https://lw.microstrategy.com/msdz/MSDL/GARelease_Current/docs/projects/VisSDK/Content/topics/HTML5/SampleCode_GoogleChart.htm


// Declare the visualization object
mstrmojo.plugins.MstrVisValueSelectBox.MstrVisValueSelectBox = mstrmojo.declare (

     // Declare that this code extends CustomVisBase
     mstrmojo.CustomVisBase,
     null,
     {

         // Define the JavaScript class that renders the visualization as mstrmojo.plugins.{plugin name}.{js file name}
         scriptClass: 'mstrmojo.plugins.MstrVisGoogleCharts.MstrVisGoogleCharts',
         cssClass: "mstrvisgooglecharts",
         errorDetails: "This visualization requires one or more attributes and one metric.",
         externalLibraries: [
             {url: "http://www.google.com/jsapi"}
         ],

         useRichTooltip: true,
         reuseDOMNode: false,

         plot: function () {
             // Starting here is Preparation of the data moved from Microstrategy to Chart (in this case google charts)  -----------
             var domNode = this.domNode, width = this.width, height = this.height, dp = this.dataInterface;
             function prepareData() {
                 var data = {};
                 //https://lw.microstrategy.com/msdz/MSDL/GARelease_Current/docs/projects/VisSDK/Content/topics/HTML5/DataInterfaceAPI.htm
                 //set cols //attributes column header/type
                 data.cols = [];
                 data.cols[0] = {"id": "ATT_NAME_JS", "label": "Attribute", "type": "string"};
                 //metrics columns header/type
                 //getColHeaders(pos) = Returns metric headers for a given column, where pos is the index of the column, in the format mstrmojo.models.templates.Headers.
                 // Returns: Array of COLUMN HEADER objects - Name der Kennzahlen
                 var i;
                 for (i = 0; i < dp.getColumnHeaderCount(); i++) {
                     var metricName = dp.getColHeaders(0).getHeader(i).getName();
                     data.cols[1 + i] = {"id": metricName, "label": metricName, "type": "number"};
                 }
                 //set rows data
                 data.rows = [];
                 //go thru all rows
                 for (i = 0; i < dp.getTotalRows(); i++) {
                     data.rows[i] = {};
                     var c = [], attributesValue = "";
                     //attribute values to single string for row
                     // getRowHeaders(pos) = Returns attribute headers for a given row(an array), where pos is the index of the row, in the format mstrmojo.models.templates.Headers.
                     // Returns: Array of ROW HEADER objects - Attributausprägungen. Name der Attribute = getRowTitles()
                     var a;
                     for (a = 0; a < dp.getRowHeaders(i).size(); a++) {
                         attributesValue += dp.getRowHeaders(i).getHeader(a).getName() + " ";
                     }
                     c[0] = {"v": attributesValue};
                     //metrics values in row
                     // getMetricValue(row,col) = Returns the metric value for the specified row and column, in the format mstrmojo.models.templates.MetricValue.
                     // Returns: Integer - Kennzahlenwert.
                     var z;
                     for (z = 0; z < dp.getColumnHeaderCount(); z++) {
                         c[1 + z] = {"v": dp.getMetricValue(i, z).getRawValue()};
                     }
                     data.rows[i].c = c;
                }
                return data;
            }
            
            // Starting from here its Google Charts         ------------------------------------------------------------------------
            // https://developers.google.com/chart/interactive/docs/quick_start            
            // Equals the google function drawChart() {}
            function renderGraph() {
                var data = new google.visualization.DataTable(prepareData());
                var options = {'title': 'Google chart', 'width': width, 'height': height};
                
                // Instantiate your chart - Each chart type is based on a different class, listed in the chart 's documentation. For instance, the pie chart is based on the
                // google.visualization.PieChart class, the bar chart is based on the google.visualization.BarChart class, and so on. Both pie and bar charts are included in 
                // the corechart package that you loaded at the beginning of this tutorial. However, if you want a treemap or geo chart on your page, you must additionally 
                // load the 'treemap ' or 'geomap ' packages.
                // Google chart constructors take a single parameter: a reference to the DOM element in which to draw the visualization:
                var chart = new google.visualization.LineChart(domNode);
                chart.draw(data, options);
            }
            // Finally: Executing the functions:
            // https://developers.google.com/chart/interactive/docs/basic_load_libs#update-library-loader-code
            google.load("visualization", "1", {"callback": function () {
                renderGraph();
            }, "packages": ["corechart"]
        });
         }
     }
 ); 
