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
            errorDetails: "This visualization requires one attribute and one to ten metrics. :-)47101(-:",
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
  
                // Create chart instance
                var chart2 = am4core.create(this.domNode, am4charts.XYChart);
				
				var data = prepareData();
	
				chart2.data = data.rows;

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
				
				data.cols.forEach((col,i)=>{
					createSeries("values"+i, col);	
				})
				
				//Karina: Do we need that??

                /*series1.events.on("hidden", function () {
                    series2.hide();
                    //series3.hide();
                });

                series1.events.on("shown", function () {
                    series2.show();
                    //series3.show();
                });
				*/
                // And, for a good measure, let's add a legend
                chart2.legend = new am4charts.Legend();
                chart2.cursor = new am4charts.XYCursor();


                // -------------------------------------------------------------------------------------------------

                 //  Prepare Data
                function prepareData() {
					var data = {};
					// set column names
					data.cols = [];
					for (var z = 0; z < dp.getColumnHeaderCount(); z++) {
						data.cols[z] = dp.getColHeaders(0).getHeader(z).getName();
					}
					
					//set rows data
					var rows = [];
					//go thru all rows
					for (i = 0; i < dp.getTotalRows(); i++) {
						var c = {}
						c.date = dp.getRowHeaders(i).getHeader(0).getName();
						var parts = c.date.split('.');
						c.date = new Date('20'+parts[2], parts[1]-1, parts[0])
						c.values = [];
						for (var z = 0; z < dp.getColumnHeaderCount(); z++) {
							c['values'+z] = dp.getMetricValue(i, z).getRawValue()
						}	
						rows[i] = c;
					}	
					data.rows = rows;
					return data; 
                }
            }
        }
    );
}());