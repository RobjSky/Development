(function () {
    // Define this code as a plugin in the mstrmojo object
    if (!mstrmojo.plugins.AZoomableDateTime) {
        mstrmojo.plugins.AZoomableDateTime = {};
    }
    // All mojo visualizations require the CustomVisBase library to render
    mstrmojo.requiresCls("mstrmojo.CustomVisBase");

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
            externalLibraries: [{url: "//cdn.amcharts.com/lib/4/core.js"},
			{url: "//cdn.amcharts.com/lib/4/charts.js"},{url: "//cdn.amcharts.com/lib/4/themes/animated.js"}],

            // Define whether a tooltip should be displayed with additional information
            useRichTooltip: true,
            // Define whether the DOM should be reused on data/layout change or reconstructed from scratch
            reuseDOMNode: false,

            plot: function () {
                 var me = this;
                 var domNode = this.domNode,
                     dp = this.dataInterface;
                     























                /**
                 * ---------------------------------------
                 * https://codepen.io/team/amcharts/pen/moyWJW/
                 * This demo was created using amCharts 4.
                 * For more information visit:                 * https://www.amcharts.com/
                 * Documentation is available at:              * https://www.amcharts.com/docs/v4/
                 * ---------------------------------------
                 */

                am4core.useTheme(am4themes_animated);
// ! Alert window
// ! window.alert('am4core'); //Karina            
// ! window.alert(typeof am4core); //Karina     check if library loaded (if undefined, not loaded)   
                // Create chart instance
                var chart2 = am4core.create(this.domNode, am4charts.XYChart);

                /**Data Format: 
                  chart2.data = [{
                              "attr.Name": attr.Value,
                              "mtr1.Name": mtr1.Value,
                              "mtr2.Name": mtr2.Value,
                              "mtr3.Name": mtr3.Value
                          }, {...}, {...}, ]
                */
                // Add data
                var betterdata = prepareData();
                window.alert("betterData: " + JSON.stringify(betterdata));
                chart2.data = betterdata;
                window.alert("chart2.Data: " + JSON.stringify(chart2.data));
                
                chart2.data = [{
                    "date": new Date(2018, 0, 1),
                    "value": 450,
                    "value2": 362,
                    "value3": 699
                }, {
                    "date": new Date(2018, 0, 2),
                    "value": 269,
                    "value2": 450,
                    "value3": 841
                }, {
                    "date": new Date(2018, 0, 3),
                    "value": 700,
                    "value2": 358,
                    "value3": 699
                }, {
                    "date": new Date(2018, 0, 4),
                    "value": 490,
                    "value2": 367,
                    "value3": 500
                }, {
                    "date": new Date(2018, 0, 5),
                    "value": 500,
                    "value2": 485,
                    "value3": 369
                }, {
                    "date": new Date(2018, 0, 6),
                    "value": 550,
                    "value2": 354,
                    "value3": 250
                }, {
                    "date": new Date(2018, 0, 7),
                    "value": 420,
                    "value2": 350,
                    "value3": 600
                }];
                window.alert("chart2.Data: " + JSON.stringify(chart2.data));

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
                    if (hiddenInLegend) {
                        series.hiddenInLegend = true;
                    }

                    var bullet = series.bullets.push(new am4charts.CircleBullet());
                    bullet.circle.stroke = am4core.color("#fff");
                    bullet.circle.strokeWidth = 2;

                    return series;
                }

                var series1 = createSeries(dp.getColHeaders(0).getHeader(0).getName(), dp.getColHeaders(0).getHeader(0).getName());
                var series2 = createSeries("value2", "Series #2", false);
                var series3 = createSeries("value3", "Series #3", false);
window.alert("Data1: " + JSON.stringify(series1));
window.alert("Data2: " + JSON.stringify(series2));

                // And, for a good measure, let's add a legend
                chart2.legend = new am4charts.Legend();
                chart2.cursor = new am4charts.XYCursor();


                // -------------------------------------------------------------------------------------------------





                 // ! Prepare Data
                 // https://lw.microstrategy.com/msdz/MSDL/GARelease_Current/_GARelease_Archives/103/docs/projects/VisSDK_All/Default.htm#topics/HTML5/Data_Interface_API.htm
                 function prepareData() {
/*                     var dataobject = {};
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
*/
/**
                     // Create a new array (datapool) and push the objects datarecords to the new array. each datarecord is one single object in the array.
                     // additional a check on "how many attributes?" and "how many metrics are being used?" must be performed to derive the FOR-Indicators
                     // additional a check is needed to format the datetime attribute from MSTR to a datetime attibute in JS.
                     var datapool = [];
                     let datarecord = {
                         "attr.Name": attr.Value,
                         "mtr1.Name": mtr1.Value,
                         "mtr2.Name": mtr2.Value,
                         "mtr3.Name": mtr3.Value
                     }
                     datapool.push(datarecord);
                     window.alert(JSON.stringify(datarecord));
*/
                      
                    var datapool = [];
                    var datarecord = {};
                    // Iterate thru all rows and construct an array of Objects where each Attribute-Metric Combination is one Object: basicallly an Object = a data record or row in the table
                      for (i = 0; i < dp.getTotalRows(); i++) {
                          // Set attribute values to single string for row
                          var a;
                          // iterate thru all columns
                          for (a = 0; a < dp.getRowHeaders(i).size(); a++) {
                              //Set for each cell or data element set name and value
                              var attribute_name = dp.getRowTitles().getTitle(a).getName();

                              var attribute_value = dp.getRowHeaders(i).getHeader(a).getName();
                              // if date then
                              var parts = attribute_value.split('.');
                              attribute_value = new Date('20' + parts[2], parts[1] - 1, parts[0])

                              //var attribute_value;
                              // get the value for the set attribute name
                              //datarecord[attribute_name] = dp.getRowHeaders(i).getHeader(a).getName()
                              datarecord[attribute_name] = attribute_value
                          }
                          // Set metrics values in row
                          var z;
                          for (z = 0; z < dp.getColumnHeaderCount(); z++) {
                              //Set Metric name to the correct property
                              var metric_name = dp.getColHeaders(0).getHeader(z).getName();
                              datarecord[metric_name] = dp.getMetricValue(i, z).getRawValue()
                          }
                          datapool.push(datarecord);
                          //window.alert(JSON.stringify(datarecord));
                      }
                      window.alert("Datapool: " + JSON.stringify(datapool));

                     return datapool;
                 }

                 function renderGraph() {
                     var datatb = {};
                     datatb = prepareData();

                    // ! window.alert('hello rendergraph()');
                    //window.alert(JSON.stringify(datatb));
                    //window.alert(JSON.stringify(datatb.metr));
                    //window.alert(JSON.stringify(datatb.attr));
                    //window.alert(JSON.stringify(chart2.data));



                     var varseries = [];
                     // Set series of metric values
                     for (i = 0; i < datatb.metricnames.length; i++) {
                         varseries.push({
                             name: datatb.metricnames[Object.keys(datatb.metricnames)[i]],
                             data: datatb.metr[Object.keys(datatb.metr)[i]]
                         });
                     }

                }
                //renderGraph();
            }
        }
    );
}());