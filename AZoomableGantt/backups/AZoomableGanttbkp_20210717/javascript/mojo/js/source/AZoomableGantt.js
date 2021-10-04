//** ---------------------------------------
//* Gantt Chart was created using amCharts 4.
//* Author: Bjoern Mueller, bjoernmueller@posteo.de 
//* Date: 18-05-2021
//* Documentation is available at: https://www.amcharts.com/docs/v4/
//* ---------------------------------------
 
(function () {
    // Define this code as a plugin in the mstrmojo object
    if (!mstrmojo.plugins.AZoomableGantt) {
        mstrmojo.plugins.AZoomableGantt = {};
    }
    // All mojo visualizations require the CustomVisBase library to render
    mstrmojo.requiresCls("mstrmojo.CustomVisBase");
     mstrmojo.plugins.AZoomableGantt.APLC_PROPERTIES = {
     };
    var colors = []; //to maintain the color object for each metric
    var metricColors = [];

    /**
     * A visualization that integrates Microstrategy data with amcharts code
     * @extends mstrmojo.CustomVisBase
     */
    // Declare the visualization object
    mstrmojo.plugins.AZoomableGantt.AZoomableGantt = mstrmojo.declare(
        // Declare that this code extends CustomVisBase
        mstrmojo.CustomVisBase,
        null, {
            // Define the JavaScript class that renders your visualization as mstrmojo.plugins.{plugin name}.{js file name}
            scriptClass: 'mstrmojo.plugins.AZoomableGantt.AZoomableGantt',
            // Define the CSS class that will be appended to container div
            cssClass: "AZoomableGantt",
            // Define the error message to be displayed if JavaScript errors prevent data from being displayed
            errorDetails: "This visualization requires one or more attributes and one metric. :-) Expected Date-Format: [dd.mm.yy](-:",
            // Define the external libraries to be used - in this sample. the amcharts library
            externalLibraries: [{url: "//cdn.amcharts.com/lib/4/core.js"}, {url: "//cdn.amcharts.com/lib/4/charts.js"}, {url: "//cdn.amcharts.com/lib/4/themes/animated.js"}, {url: "//cdn.amcharts.com/lib/4/plugins/rangeSelector.js"}],
            // Define whether a tooltip should be displayed with additional information
            useRichTooltip: true,
            // Define whether the DOM should be reused on data/layout change or reconstructed from scratch
            reuseDOMNode: false,

            plot: function () {
                var me = this;
                var domNode = this.domNode,
                     dp = this.dataInterface;
                var startAttrIsDate = "false";
                var AttrCount = 0;

                // ! Visualisation as Selector
                this.addUseAsFilterMenuItem();

                this.setDefaultPropertyValues({
                    showInfobox: 'true',
                    showThreshold: 'false',
                    positionInfobox: 'vertical',
                    //positInfobox: 'vertical',
                    infoboxTitleSize: 16,
                    infoboxFontSize: 12,
                    infoboxWidth: 200,
                    infoboxTitleHeight: 40,
                    InfoboxFillColor: {fillColor: "#c7c7c7", fillAlpha: "100"},
                    InfoboxStrokeColor: {fillColor: "#c7c7c7", fillAlpha: "100"},
                    InfoboxLabelFillColor: {fillColor: "#c7c7c7", fillAlpha: "100"},
                    minGridDist: 40, //actual default for Y-Axis
                    displayImage: 'false',
                    heightImg: 60,
                    imgPrefix: 'http://bi.kinopolis.de/MicroStrategy/images/kinopolis/film_no/',
                    imgSuffix: '.jpg',
                    fontColor: {fillColor: "#000000", fillAlpha: "100"},
                    clickTask: 'false',
                    fillTask: 'false',
                    clickColorFill: {fillColor: "#000000", fillAlpha: "100"},
                    clickColorStroke: {fillColor: "#000000", fillAlpha: "100"},
                    strokeWidth: 2,
                    displayXYChartScrollbar: 'false',
                    displayWeekendFill: 'false',
                    //hideYAxisLabels: 'false',
                    minThresholdColor: {fillColor: "#0c8320", fillAlpha: "100"},
                    maxThresholdColor: {fillColor: "#830c0c", fillAlpha: "100"},
                    amountStrokeXColor: {fillColor: "#A3A3A3", fillAlpha: "50"},
                    amountStrokeYColor: {fillColor: "#A3A3A3", fillAlpha: "50"},
                    weekendFillColor: {fillColor: "#000000", fillAlpha: "20"},
                    metricFormat: "#,###.00",
                    showDebugMsgs: 'false',
                });

                am4core.useTheme(am4themes_animated);

                // Create chart instance
                var chart2 = am4core.create(this.domNode, am4charts.XYChart);
                chart2.padding(10, 10, 10, 10);
                chart2.hiddenState.properties.opacity = 0; // this creates initial fade-in
                chart2.dateFormatter.dateFormat = "yyyy-MM-dd hh:mm";
                chart2.dateFormatter.inputDateFormat = "yyyy-MM-dd HH:mm";

                var colorSet = new am4core.ColorSet();
                colorSet.saturation = 0.4;


                if (me.getProperty("enableWheelScroll")) {
                    chart2.mouseWheelBehavior = "panX";
                };
                
                // Export
                //chart2.exporting.menu = new am4core.ExportMenu();

                // Add data
                var datapool = prepareData();

                 //TODO Data needs to be assigned to work properly
                 if (datapool.attrs.length > 1 && datapool.cols.length < 2) {
                     chart2.data = datapool.transposedRows;
                 } else {
                     chart2.data = datapool.rows;
                 }
                 chart2.data = datapool.rows;


                // Set Default Colors
                chart2.colors.list = [
                    am4core.color("#eac566"),
                    am4core.color("#bf82a1"),
                    am4core.color("#7788aa"),
                    am4core.color("#03a678"),
                    am4core.color("#cc9955"),
                    am4core.color("#ffee99"),
                    am4core.color("#bb99bb"),
                    am4core.color("#99bbcc"),
                    am4core.color("#65a688")
                ];

                //NOTE Create Axis --------------------------------//// Create Axis for date-based X-Axis
                // category-based X-Axis:
                var categoryAxis = chart2.yAxes.push(new am4charts.CategoryAxis());
                //categoryAxis.dataFields.category = "category";
                categoryAxis.dataFields.category = datapool.attrs[2];
                //categoryAxis.dataFields.category = "Saal";
                categoryAxis.renderer.grid.template.location = 0;
                categoryAxis.renderer.inversed = true;
                categoryAxis.renderer.minGridDistance = me.getProperty("minGridDist");
                // Format valueAxis
                categoryAxis.renderer.grid.template.stroke = am4core.color(me.getProperty("amountStrokeYColor").fillColor);
                categoryAxis.renderer.grid.template.strokeOpacity = me.getProperty("amountStrokeYColor").fillAlpha * 0.01;
                categoryAxis.renderer.labels.template.fill = am4core.color(me.getProperty("fontColor").fillColor);

                // date-based X-Axis:
                (me.getProperty("showDebugMsgs") == 'true') ? window.alert('startAttrIsDate: ' + startAttrIsDate) : 0;
                if (startAttrIsDate == 'false') {
                    window.alert('This wont work. Category-based AttrIsDate = ' + startAttrIsDate)
                } else {
                    var dateAxis = chart2.xAxes.push(new am4charts.DateAxis());
                    dateAxis.renderer.grid.template.location = 0;
                    dateAxis.renderer.minGridDistance = 70;
                    dateAxis.renderer.tooltipLocation = 0;
                    //dateAxis.groupData = 'false';
                    // Format dateAxis
                    dateAxis.renderer.grid.template.stroke = am4core.color(me.getProperty("amountStrokeXColor").fillColor);
                    dateAxis.renderer.grid.template.strokeOpacity = me.getProperty("amountStrokeXColor").fillAlpha * 0.01;
                    dateAxis.renderer.labels.template.fill = am4core.color(me.getProperty("fontColor").fillColor);
                    // Set date label formatting (https://www.amcharts.com/docs/v4/concepts/axes/date-axis/#Setting_date_formats)
                    dateAxis.periodChangeDateFormats.setKey("hour", "[bold]dd.MMM[/]\nEEE");
                    dateAxis.periodChangeDateFormats.setKey("day", "[bold]dd.MMM[/]");
                    dateAxis.periodChangeDateFormats.setKey("week", "[bold]'KW'ww[/]");

                    // Highlight Weekends
                    //https://www.amcharts.com/docs/v4/tutorials/using-fill-rules-on-a-date-axis/
                    //https://www.amcharts.com/docs/v4/concepts/axes/positioning-axis-elements/#Setting_the_density_of_the_the_grid_labels
                    //https://www.amcharts.com/docs/v4/concepts/axes/date-axis/#Axis_grid_granularity
                    if (me.getProperty("displayWeekendFill") === 'true') {
                        dateAxis.renderer.axisFills.template.disabled = false;
                        dateAxis.renderer.axisFills.template.fill = am4core.color(me.getProperty("weekendFillColor").fillColor);
                        dateAxis.renderer.axisFills.template.fillOpacity = me.getProperty("weekendFillColor").fillAlpha * 0.01;

                        dateAxis.fillRule = function (dataItem) {
                            var date = new Date(dataItem.value);
                            if ((date.getDay() == 0 || date.getDay() == 6) && dateAxis.gridInterval.timeUnit == "day" && dateAxis.gridInterval.count == 1) {
                                dataItem.axisFill.visible = true;
                                // Prep in case Highlight Thursdays and Fridays too but with half opacity
                                //} else if ((date.getDay() == 4 || date.getDay() == 5) && dateAxis.gridInterval.timeUnit == "day" && dateAxis.gridInterval.count == 1) {
                                 //   dataItem.axisFill.visible = true;
                                 //   dataItem.axisFill.fillOpacity = me.getProperty("weekendFillColor").fillAlpha * 0.005;
                            } else {
                                dataItem.axisFill.visible = false;
                            }
                        }
                    }
                }


                //NOTE createSeries --------------------------------//

                var series1 = chart2.series.push(new am4charts.ColumnSeries());
                var numOfMetrics = datapool.cols.length;
                var metrics4tooltip = "";
                series1.columns.template.height = am4core.percent(70);

                series1.dataFields.openDateX = datapool.attrs[0]; // startdatetime, named startdate in perparedata(), then renamend to first Attributename
                series1.dataFields.dateX = datapool.attrs[1]; // enddatetime, named enddate in perparedata(), then renamend to second Attributename
                series1.dataFields.categoryY = datapool.attrs[2];
                series1.dataFields.task = datapool.attrs[3];
                series1.dataFields.imgName = datapool.attrs[4];
                series1.dataFields.valueY = datapool.cols[0];
                //series1.dataFields.nameY = datapool.cols[0];
                // TOOLTIP: assign metrics and build tooltip (series1.dataFields.valueY[i] = "values0";)
                // !! series1.dataFields.valueY0 is not a valid property recognized by the amcharts-api --> eg means it cant be used for heatrules.
                for (let value of datapool.cols){};
                for (var i = 0; i < numOfMetrics; i++) {
                    var myVar = "valueY" + i; // Metric Value
                    series1.dataFields[myVar] = datapool.cols[i]; // Metric Value

                    let push = "\n" + datapool.cols[i] + ": {" + myVar + "}";
                    metrics4tooltip += push;
                };
                if (me.getProperty("showToolTip") === 'true') {
                    series1.columns.template.tooltipText = "{" + datapool.attrs[3] + "}: \n[bold] {openDateX.formatDate('dd.MM.yyyy HH:mm')} [/] - [bold]{dateX.formatDate('HH:mm')}[/]" + metrics4tooltip;
                }



                //Thresholds - color series.columns depending on value of first metric from min to max
                if (me.getProperty("showThreshold") === 'true') {
                    series1.heatRules.push({
                        "target": series1.columns.template,
                        "property": "fill",
                        //"min": am4core.color("#F5DBCB"),
                        "min": am4core.color(me.getProperty("minThresholdColor").fillColor),
                        "max": am4core.color(me.getProperty("maxThresholdColor").fillColor),
                        "dataField": "valueY"
                    });
                    series1.heatRules.push({
                        "target": series1.columns.template,
                        "property": "stroke",
                        "min": am4core.color(me.getProperty("minThresholdColor").fillColor).lighten(-0.5),
                        "max": am4core.color(me.getProperty("maxThresholdColor").fillColor).lighten(-0.5),
                        "dataField": "valueY"
                    });
                } else {
                    // as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
                    series1.columns.template.adapter.add("fill", function (fill, target) {
                        return chart2.colors.getIndex(target.dataItem.index);
                    });
                    series1.columns.template.adapter.add("stroke", function (fill, target) {
                        return chart2.colors.getIndex(target.dataItem.index);
                    });
                }


                chart2.scrollbarX = new am4core.Scrollbar();
                chart2.cursor = new am4charts.XYCursor();



                // Create a horizontal scrollbar with preview and place it underneath the date axis
                if (me.getProperty("displayXYChartScrollbar") === 'true') {
                    series1.show(); // hardcoded reference for series1
                    chart2.scrollbarX = new am4charts.XYChartScrollbar();
                    chart2.scrollbarX.minHeight = 40;
                    // Customize scrollbar background, when hovered
                    chart2.scrollbarX.background.fill = am4core.color("#c4c4c4");
                    chart2.scrollbarX.background.fillOpacity = 0.2;
                    // Customize scrollbar background, when unhovered
                    chart2.scrollbarX.thumb.background.fill = am4core.color("#b0b0b0");
                    chart2.scrollbarX.thumb.background.fillOpacity = 0.3;
                    chart2.scrollbarX.series.push(series1);
                    chart2.scrollbarX.parent = chart2.bottomAxesContainer;
                    chart2.scrollbarX.scrollbarChart.series.getIndex(0).fillOpacity = 0.5;
                    chart2.scrollbarX.scrollbarChart.plotContainer.filters.clear(); // remove desaturation
                    //chart2.scrollbarX.scrollbarChart.plotContainer.filters.DesaturateFilter.saturation = 0.5;
                    customizeGrip(chart2.scrollbarX.startGrip);
                    customizeGrip(chart2.scrollbarX.endGrip);
                }

                //NOTE customizeGrip() --------------------------------//
                // Style scrollbar
                function customizeGrip(grip) {
                    // Remove default grip image
                    grip.icon.disabled = true;

                    // Disable background
                    grip.background.disabled = true;

                    // Add rotated rectangle as bi-di arrow
                    var img = grip.createChild(am4core.Rectangle);
                    img.width = 10;
                    img.height = 10;
                    img.fill = am4core.color("#999");
                    img.rotation = 45;
                    img.align = "center";
                    img.valign = "middle";

                    // Add vertical bar
                    var line = grip.createChild(am4core.Rectangle);
                    line.height = 40;
                    line.width = 2;
                    line.fill = am4core.color("#999");
                    line.align = "center";
                    line.valign = "middle";
                }



                //NOTE Generate Infobox for static tooltip
                if (me.getProperty("showInfobox") === 'true') {
                    var info = chart2.createChild(am4core.Container);
                    info.padding(10, 10, 10, 10);
                    info.background.fill = am4core.color("#000");
                    info.background.fillOpacity = 0.1;
                    info.layout = "vertical";

                    let title = info.createChild(am4core.Label);
                    title.text = "Title";
                    title.fontSize = me.getProperty("infoboxTitleSize")



                    chart2.layout = me.getProperty("positionInfobox");
                    if (me.getProperty("positionInfobox") == "horizontal") {
                        //InfoBox to the right
                        var sepa = "\n";
                        info.layout = "vertical";
                        info.width = me.getProperty("infoboxWidth");
                        info.height = am4core.percent(100);
                        info.margin(25, 10, 25, 25);
                        info.background.fill = am4core.color(me.getProperty("InfoboxFillColor").fillColor);
                        info.background.stroke = am4core.color(me.getProperty("InfoboxStrokeColor").fillColor);
                        info.background.fillOpacity = me.getProperty("InfoboxLabelFillColor").fillAlpha * 0.01;
                        title.truncate = false;
                        title.wrap = true;
                        title.width = am4core.percent(100);
                        //title.height = 40;
                        title.height = me.getProperty("infoboxTitleHeight");

                        // New Container to hold labels for Metrics and Attrributes besides the Title
                        var infoLabelCont = info.createChild(am4core.Container);

                        infoLabelCont.width = me.getProperty("infoboxWidth") - 20;
                        infoLabelCont.fontSize = me.getProperty("infoboxFontSize")
                        infoLabelCont.layout = "grid";
                        var minTextWidth = me.getProperty("infoboxWidth") * 0.4; // Text wdith is 45% of the entire InfoBox width
                        var txtOpenDateX = infoLabelCont.createChild(am4core.Label); // Date Start Text
                        var valOpenDateX = infoLabelCont.createChild(am4core.Label); // Date Start Value

                        var txtDateX = infoLabelCont.createChild(am4core.Label); // Date End Text
                        var valDateX = infoLabelCont.createChild(am4core.Label); // Date End Value

                        var txtCategoryY = infoLabelCont.createChild(am4core.Label); // Category Text
                        var valCategoryY = infoLabelCont.createChild(am4core.Label); // Category Value

                        txtOpenDateX.text = datapool.attrs[0] + ":";
                        txtOpenDateX.fill = am4core.color("#3d3d3d");
                        //txtOpenDateX.minWidth = 60;
                        txtOpenDateX.minWidth = minTextWidth;
                        //window.alert('me.getProperty("infoboxWidth"): ' + me.getProperty("infoboxWidth"));
                        txtOpenDateX.marginRight = 5;
                        txtOpenDateX.paddingBottom = 3;
                        valOpenDateX.text = "dd.MM.yyyy HH:mm";
                        //valOpenDateX.minWidth = 60;
                        valOpenDateX.minWidth = minTextWidth;
                        valOpenDateX.marginRight = 10;
                        valOpenDateX.fontWeight = "bolder";

                        txtDateX.text = datapool.attrs[1] + ":";
                        txtDateX.fill = am4core.color("#3d3d3d");
                        //txtDateX.minWidth = 60;
                        txtDateX.minWidth = minTextWidth;
                        txtDateX.marginRight = 5;
                        txtDateX.paddingBottom = 3;
                        valDateX.text = "HH:mm";
                        //valDateX.minWidth = 60;
                        valDateX.minWidth = minTextWidth;
                        valDateX.marginRight = 10;
                        valDateX.fontWeight = "bolder";

                        txtCategoryY.text = datapool.attrs[2] + ":";
                        txtCategoryY.fill = am4core.color("#3d3d3d");
                        //txtCategoryY.minWidth = 60;
                        txtCategoryY.minWidth = minTextWidth;
                        txtCategoryY.marginRight = 5;
                        txtCategoryY.paddingBottom = 12;
                        valCategoryY.text = "#,###.00";
                        //valCategoryY.minWidth = 60;
                        valCategoryY.minWidth = minTextWidth;
                        valCategoryY.marginRight = 10;
                        valCategoryY.fontWeight = "bolder";


                        //Additional Metrics:
                        for (var i = 0; i < numOfMetrics; i++) {
                            // create dynamic variables for Metrics
                            var cnt = i;
                            window['txtMetric' + cnt] = infoLabelCont.createChild(am4core.Label)
                            window['txtMetric' + cnt].text = datapool.cols[i] + ":";
                            window['txtMetric' + cnt].paddingBottom = 3;

                            window['valMetric' + cnt] = infoLabelCont.createChild(am4core.Label);
                            window['valMetric' + cnt].fontWeight = "bolder";
                        }

                        // show Image
                        if (me.getProperty("displayImage") == "true" && (datapool.attrs[4])) { //&& me.getProperty("positionInfobox") == "horizontal"
                            var img = info.createChild(am4core.Image);
                            var imgPrefix = me.getProperty("imgPrefix");
                            var imgSuffix = me.getProperty("imgSuffix");
                            // var imgPrefix = 'http://bi.kinopolis.de/MicroStrategy/images/kinopolis/film_no/'
                            //img.href = "https://alternativemovieposters.com/wp-content/uploads/2020/09/BATMAN-1989-30x30-1.jpg";
                            img.width = am4core.percent(100);
                            img.height = me.getProperty("heightImg");
                            img.align = "center";
                            img.valign = "middle";
                            img.filters.push(new am4core.DropShadowFilter());
                            img.margin(0, 0, 0, 0);
                            img.padding(12, 0, 0, 0);
                        }
                    } else {
                        // InfoLine below
                        var sepa = "  |  ";
                        var label = info.createChild(am4core.Label);
                        info.layout = "horizontal";
                        info.width = am4core.percent(90);
                        info.margin(0, 0, 0, 0);
                        info.align = "center";
                        info.background.fillOpacity = 0;
                        title.fontSize = label.fontSize
                        title.truncate = false;
                        //title.background.fill = am4core.color(me.getProperty("InfoboxFillColor").fillColor);
                        label.text = "Information";
                        label.fontSize = me.getProperty("infoboxFontSize");
                        label.align = "center";
                        label.margin(0, 0, 0, 5);
                        label.padding(0, 0, 0, 0);
                        //label.background.fill = am4core.color(me.getProperty("InfoboxFillColor").fillColor);
                    }


                    //NOTE Set up hovering events
                    series1.columns.template.events.on("over", function (ev) {
                        if (me.getProperty("displayImage") == "true" && (datapool.attrs[4]) && me.getProperty("positionInfobox") == "horizontal") {
                            // Update Image
                            var imgName = ev.target.dataItem.imgName;
                            img.href = imgPrefix + imgName + imgSuffix;
                            // Update labels in Infobox
                            title.text = "[bold]" + ev.target.dataItem.task + "[/]\n";
                            valOpenDateX.text = chart2.dateFormatter.format(ev.target.dataItem.openDateX, "dd.MM.yyyy HH:mm");
                            valDateX.text = chart2.dateFormatter.format(ev.target.dataItem.dateX, "HH:mm");
                            valCategoryY.text = ev.target.dataItem.categoryY;
                            //valCategoryY.text = chart2.numberFormatter.format(ev.target.dataItem.valueY, "#,###.00");
                            for (var i = 0; i < numOfMetrics; i++) {
                                 //var metricname = "valueY" + i;
                                 var metricname = "valueY" + i;
                                 window['valMetric' + i].text = ev.target.dataItem[metricname];
                            }
                        } else {
                            // Update labels in vertical
                            title.text = "[bold]" + ev.target.dataItem.task + "[/]\n";
                            label.text = chart2.dateFormatter.format(ev.target.dataItem.openDateX, "dd.MM.yyyy HH:mm") + " - " + chart2.dateFormatter.format(ev.target.dataItem.dateX, "HH:mm") + sepa;
                            label.text += ev.target.dataItem.categoryY + sepa;
                            label.text += datapool.cols[0] + ": " + chart2.numberFormatter.format(ev.target.dataItem.valueY, "#,###.00");
                            label.fill = ev.target.fill;

                            for (var i = 1; i < numOfMetrics; i++) {
                                var metricname = "valueY" + i;
                                var dataitemvalue = ev.target.dataItem[metricname];
                                label.text += sepa + datapool.cols[i] + ": " + chart2.numberFormatter.format(dataitemvalue, "#,###.00");
                            }
                        }
                    });
                }
                /** NOTE Make Clickable
                 * https: //stackoverflow.com/questions/51477177/how-to-add-a-click-hit-event-for-lineseries-in-amcharts-4
                 * https: //stackoverflow.com/questions/64452378/how-can-i-make-my-amchart4-segments-clickable
                 * https: //stackoverflow.com/questions/55021098/select-single-column-in-amcharts-4
                */
                 if (me.getProperty("clickTask") == "true") {
                      var columnTemplate = series1.columns.template;
                      columnTemplate.strokeWidth = 2;
                      columnTemplate.strokeOpacity = 1;

                     columnTemplate.togglable = true;
                      var activeState = columnTemplate.states.create("active");
                      if (me.getProperty("fillTask") == "true") {
                          //activeState.properties.fill = am4core.color("#E94F37"); //series.fill.brighten(1);
                          activeState.properties.fill = am4core.color(me.getProperty("clickColorFill").fillColor);
                          activeState.properties.fillOpacity = me.getProperty("clickColorFill").fillAlpha * 0.01;
                      }
                      //activeState.properties.strokeWidth = 8;
                      activeState.properties.strokeWidth = me.getProperty("strokeWidth");
                      activeState.properties.stroke = am4core.color(me.getProperty("clickColorStroke").fillColor);
                      //activeState.filters.push(new am4core.DropShadowFilter());

                     // Only one column active at a time
                      columnTemplate.events.on("hit", function (event) {
                          series1.columns.each(function (column) {
                              //alert("Task: " + JSON.stringify(event.target.dataItem.task) + " index: " + JSON.stringify(event.target.dataItem.task.index));
                              //alert("Taskcol: " + JSON.stringify(column.dataItem.task) + " index: " + JSON.stringify(column.dataItem.task.index));
                              if (column !== event.target) {
                                  if (column.dataItem.task == event.target.dataItem.task) {
                                      //alert("true: " + JSON.stringify(column.dataItem.task) + " // " + JSON.stringify(event.target.dataItem.task));
                                      column.setState("default");
                                      column.isActive = true;
                                  } else {
                                      //alert("no match");
                                      column.setState("default");
                                      column.isActive = false;
                                  }
                              }
                          })
                      });


                 }




























                // NOTE prepareData()
                // https://www2.microstrategy.com/producthelp/2020/VisSDK/Content/topics/HTML5/DataInterfaceAPI.htm
                // https://www2.microstrategy.com/producthelp/Current/VisSDK/Content/topics/HTML5/DataInterfaceAPI.htm#DataInterface
                // https://lw.microstrategy.com/msdz/MSDL/GARelease_Current/_GARelease_Archives/103/docs/projects/VisSDK_All/Default.htm#topics/HTML5/Data_Interface_API.htm
                function prepareData() {
                    // Date Start and End Function! This function assumes first and second input to be of the date- or datetime-format!!
                    // Create a new array (datapool) and push the objects datarecords to the new array. each datarecord is one single object in the array.
                    // additional a check on "how many attributes?" and "how many metrics are being used?" must be performed to derive the FOR-Indicators
                    // additional a check is needed to format the datetime attribute from MSTR to a datetime attibute in JS.
                    // datapool = {"cols" : [mtr1.Name, mtr2.Name],
                    //             "attrs" : [attr1.Name, attr2.Name],
                    //             "rows" : [{ "attr.Name" : attr.Value1,
                    //                         "mtr1.Name" : mtr1.Value1,
                    //                         "mtr2.Name" : mtr2.Value1 }, {"attr.Name" : attr.Value2, ...}, {...}], 
                    var datapool = {};
                    datapool.attrs = [];
                    // Attributes.Names: set attribute names ["attributename1","attributename2"]
                    for (var z = 0; z < dp.getRowTitles().size(); z++) {
                        datapool.attrs[z] = dp.getRowTitles(0).getTitle(z).getName();
                    }
                    datapool.cols = [];
                    // Metric.Names: set metric column names ["metricname1","metricname2"]
                    for (var z = 0; z < dp.getColumnHeaderCount(); z++) {
                        datapool.cols[z] = dp.getColHeaders(0).getHeader(z).getName();
                    }
                    //set rows data
                    var rows = [];


                    // DATETIME: if date then (Input dd.mm.yy)
                    let startAttrLength = dp.getRowHeaders(0).getHeader(0).getName().length;
                    let endAttrLength = dp.getRowHeaders(0).getHeader(1).getName().length;
                    let startDigitsCount;
                    let endDigitsCount;
                    // count only digits (\d)
                    try {
                        startDigitsCount = String(dp.getRowHeaders(0).getHeader(0).getName()).match(/\d/g).length;
                    } catch (err) {
                        startDigitsCount = 0;
                    };
                    try {
                        endDigitsCount = String(dp.getRowHeaders(0).getHeader(1).getName()).match(/\d/g).length;
                    } catch (err) {
                        endDigitsCount = 0;
                    };
                    (me.getProperty("showDebugMsgs") == 'true') ? window.alert('getRowHeaders: ' + dp.getRowHeaders(0).getHeader(0).getName()): 0;
                    (me.getProperty("showDebugMsgs") == 'true') ? window.alert('getRowHeaders1: ' + dp.getRowHeaders(0).getHeader(1).getName()): 0;

                    (me.getProperty("showDebugMsgs") == 'true') ? window.alert('startAttrLength: ' + startAttrLength): 0;
                    (me.getProperty("showDebugMsgs") == 'true') ? window.alert('startDigitsCount: ' + startDigitsCount): 0;

                    switch (startAttrLength - startDigitsCount) {
                        //Date: if attribute has length - digitcount = 2 then we assume a date
                        case 2:
                            startAttrIsDate = "date";
                            AttrCount = 1;
                            break;
                        //Datetime: if attribute has length(19) - digitcount(14) = 5 then we assume a datetime
                        case 5:
                            startAttrIsDate = "datetime";
                            AttrCount = 1;
                            break;
                        //case 8:
                        default:
                            startAttrIsDate = "false";
                            AttrCount = 0;
                    }
                    switch (endAttrLength - endDigitsCount) {
                        //Date: if attribute has length - digitcount = 2 then we assume a date
                        case 2:
                            endAttrIsDate = "date";
                            AttrCount = 2;
                            break;
                            //Datetime: if attribute has length(19) - digitcount(14) = 5 then we assume a datetime
                        case 5:
                            endAttrIsDate = "datetime";
                            AttrCount = 2;
                            break;
                        default:
                            endAttrIsDate = "false";
                            AttrCount = 0;
                    }
                    (me.getProperty("showDebugMsgs") == 'true') ? window.alert('startAttrIsDate: ' + startAttrIsDate): 0;
                    (me.getProperty("showDebugMsgs") == 'true') ? window.alert('endAttrIsDate: ' + endAttrIsDate): 0;

                    (me.getProperty("showDebugMsgs") == 'true') ? window.alert('new be4 c.startdate: ' + JSON.stringify(dp.getRowHeaders(0).getHeader(0).getName())): 0;
                    (me.getProperty("showDebugMsgs") == 'true') ? window.alert('new be4 c.enddate: ' + JSON.stringify(dp.getRowHeaders(0).getHeader(1).getName())): 0;

                    //go thru all rows
                    for (i = 0; i < dp.getTotalRows(); i++) {
                        var c = {}
                        // Attribute.Values: get date from data. date needs to be in the form of dd.mm.yy
                        c.startdate = dp.getRowHeaders(i).getHeader(0).getName();
                        c.enddate = dp.getRowHeaders(i).getHeader(1).getName();

                        switch (startAttrIsDate) {
                            case "date":
                                if (c.startdate.indexOf('.') > -1) {
                                    var parts = c.startdate.split('.');
                                    if (parts[2].length == 2) {
                                        parts[2] = '20' + parts[2];
                                    }
                                    // convert to Datetime-Format yyyy-mm-ddThh:mm:ss.000Z
                                    c.startdate = new Date(parts[2], parts[1] - 1, parts[0]);
                                } else if (c.startdate.indexOf('/') > -1) {
                                    var parts = c.startdate.split('/');
                                    if (parts[2].length == 2) {
                                        parts[2] = '20' + parts[2];
                                    }
                                    // Note: JavaScript counts months from 0 to 11. January is 0. December is 11.
                                    // convert to Datetime-Format yyyy-mm-ddThh:mm:ss.000Z
                                    c.startdate = new Date(parts[2], parts[0] - 1, parts[1]);
                                }
                                seriesToolTipFormat = "{dateX.formatDate('dd.MM.yyyy ')}: {name}: [bold]{valueY}[/]";
                                break;

                            case "datetime":
                                var parts = c.startdate.split(' ');
                                //var dparts = parts[0].split('.');
                                var dparts = parts[0].split(/\.|\//); //split by dot(.) or forwardslash(/)
                                var tparts = parts[1].split(':');
                                //c.startdate = new Date('20' + dparts[2], dparts[1] - 1, dparts[0], tparts[0], tparts[1], tparts[2]);
                                c.startdate = new Date(dparts[2], dparts[1] - 1, dparts[0], tparts[0], tparts[1], tparts[2]);
                                seriesToolTipFormat = "{dateX.formatDate('dd.MM.yyyy HH:mm')}: {name}: [bold]{valueY}[/]";
                                break;
                            case "datetime_us":
                                var parts = c.startdate.split(' ');
                                //var dparts = parts[0].split('.');
                                var dparts = parts[0].split(/\.|\//); //split by dot(.) or forwardslash(/)
                                var tparts = parts[1].split(':');
                                //c.startdate = new Date('20' + dparts[2], dparts[1] - 1, dparts[0], tparts[0], tparts[1], tparts[2]);
                                c.startdate = new Date(dparts[2], dparts[1] - 1, dparts[0], tparts[0], tparts[1], tparts[2]);
                                seriesToolTipFormat = "{dateX.formatDate('dd.MM.yyyy HH:mm')}: {name}: [bold]{valueY}[/]";
                                break;
                            default:
                                window.alert('default: Doesn´t look like a date to me: ' + c.startdate);
                                //i = dp.getTotalRows();
                                break;
                        };
                        switch (endAttrIsDate) {
                            case "date":
                                if (c.enddate.indexOf('.') > -1) {
                                    var parts = c.enddate.split('.');
                                    if (parts[2].length == 2) {
                                        parts[2] = '20' + parts[2];
                                    }
                                    // convert to Datetime-Format yyyy-mm-ddThh:mm:ss.000Z
                                    c.enddate = new Date(parts[2], parts[1] - 1, parts[0]);
                                } else if (c.enddate.indexOf('/') > -1) {
                                    var parts = c.enddate.split('/');
                                    if (parts[2].length == 2) {
                                        parts[2] = '20' + parts[2];
                                    }
                                    // Note: JavaScript counts months from 0 to 11. January is 0. December is 11.
                                    // convert to Datetime-Format yyyy-mm-ddThh:mm:ss.000Z
                                    c.enddate = new Date(parts[2], parts[0] - 1, parts[1]);
                                }
                                seriesToolTipFormat = "{dateX.formatDate('dd.MM.yyyy ')}: {name}: [bold]{valueY}[/]";
                                break;

                            case "datetime":
                                var parts = c.enddate.split(' ');
                                //var dparts = parts[0].split('.');
                                var dparts = parts[0].split(/\.|\//); //split by dot(.) or forwardslash(/)
                                var tparts = parts[1].split(':');
                                //c.enddate = new Date('20' + dparts[2], dparts[1] - 1, dparts[0], tparts[0], tparts[1], tparts[2]);
                                c.enddate = new Date(dparts[2], dparts[1] - 1, dparts[0], tparts[0], tparts[1], tparts[2]);
                                seriesToolTipFormat = "[bold]{dateX.formatDate('dd.MM.yyyy HH:mm')}: {name}: {valueY}[/]";
                                break;
                            default:
                                window.alert('default: Doesn´t look like a date to me: ' + c.enddate + '\n Expected Format: dd.mm.yyyy hh:mm:ss');
                                //i = dp.getTotalRows();
                                break;
                        };

                        // Rename the columnheader for startdatetime and enddatetime (eg: c.startdate --> actual attribute name)
                        c[dp.getRowTitles(0).getTitle(0).getName()] = c.startdate;
                        c[dp.getRowTitles(0).getTitle(1).getName()] = c.enddate;
                        delete c.startdate;
                        delete c.enddate;


                        c.attributes = [];
                        // Attribute.Values: get the attribute values. Z=AttrCount so the first iteration is skipped IF the first attribute is a date and therefore it should be in c.startdate
                        for (var z = AttrCount; z < dp.getRowTitles().size(); z++) {
                            c[dp.getRowTitles(0).getTitle(z).getName()] = dp.getRowHeaders(i).getHeader(z).getName()
                        }

                        c.values = [];
                        // Metric.Values: get the metric values.
                        for (var z = 0; z < dp.getColumnHeaderCount(); z++) {
                            //c['values' + z] = dp.getMetricValue(i, z).getRawValue()
                            //getMetricValue raw
                            //c[dp.getColHeaders(0).getHeader(z).getName()] = dp.getMetricValue(i, z).getRawValue()
                            //getMetricValue formatted
                            c[dp.getColHeaders(0).getHeader(z).getName()] = dp.getMetricValue(i, z).getValue()
                        }
                        // push c to current position in rows-Array. Meaning c.startdate, c.enddate and c.values, resulting in {"date" : "yyyy-mm-ddThh:mm:ss.000Z" , "values" : 123 , "values0" : 456}
                        rows[i] = c;
                    };
                    (me.getProperty("showDebugMsgs") == 'true') ? window.alert('new after c.startdate: ' + JSON.stringify(rows[0].DateTime)): 0;
                    (me.getProperty("showDebugMsgs") == 'true') ? window.alert('new after c.enddate: ' + JSON.stringify(rows[0]['datetime ende'])): 0;
                    //window.alert('new after c.startdate: ' + JSON.stringify(rows[0]));
                    datapool.rows = rows;



                    // NOTE Break-By
                    // if there is more than one attribute and only one metric in the dataset, transpose the attribute so different series can be generated and the metric can be displayed against the attribute values
                    if (datapool.attrs.length > 1 && datapool.cols.length < 2) {
                        datapool.transMetricNames = [];
                        //set rows data
                        var transposedRows = [];
                        var source = datapool.rows;
                        var dates = {};
                        var data = [];
                        //go thru all rows
                        for (i = 0; i < dp.getTotalRows(); i++) {
                            var row = source[i];
                            if (dates[row.date] == undefined) {
                                dates[row.date] = {
                                    date: row.date
                                };
                                data.push(dates[row.date]);
                            }

                            var breakByName = datapool.attrs[1];
                            var value = 'values0'; //datapool.cols[0];
                            dates[row.date][source[i][breakByName]] = row[value];
                            //dates[row.date][source[i].device] = row.value;
                            // push the new metric name to a new object, check if metric name for the transposed values already exists, if not push
                            if (datapool.transMetricNames.indexOf(row[datapool.attrs[1]]) == -1) {
                                datapool.transMetricNames.push(row[datapool.attrs[1]]);
                            };
                        }
                        datapool.transposedRows = data;
                        //var Say1 = 'DataPool: \n datapool.cols: ' + JSON.stringify(datapool.cols) + '\n datapool.attrs: ' + JSON.stringify(datapool.attrs) +'\n datapool.transMetricNames: ' + JSON.stringify(datapool.transMetricNames);
                        //var Say2 = "datapool.transposedRows:";
                        //var myWindow2 = PopUp(Say1, Say2, datapool.transposedRows);
                    }


                    //------------------ POPUP for Debugging INPUT ------------------//
                    var Say1 = 'DataPool: \n datapool.cols: ' + JSON.stringify(datapool.cols) + '\n datapool.attrs: ' + JSON.stringify(datapool.attrs);
                    var Say2 = "datapool.rows:";
                    var myWindow2 = (me.getProperty("showDebugMsgs") == 'true') ? PopUp(Say1, Say2, datapool.rows) : 0;

                    return datapool;
                 };

                 //------------------ POPUP for Debugging INPUT ------------------//
                 // var Say1 = 'metricColors: <br>' + JSON.stringify(metricColors)
                 //   + ' <br> metricColors[0]: <br>' + JSON.stringify(metricColors[0]);
                 // var Say2 = 'me.getProperty("lineColor0"): <br>' + JSON.stringify(me.getProperty("lineColor0"))
                 // var myWindow2 = PopUp(Say1, Say2);

                 // NOTE POPUP() for Debugging ------------------//
                 function PopUp(Say1, Say2, displaydata) {
                     var myWindow = window.open("", "", "width=600,height=500");
                     
                     myWindow.document.write("<h1>Debugger Output:</h1>");

                     var p1 = document.createElement("P")
                     p1.style.color = "black";
                     p1.innerText = Say1;
                     myWindow.document.body.appendChild(p1)
                     var p2 = document.createElement("P")
                     p2.style.color = "blue";
                     p2.innerText = Say2;
                     myWindow.document.body.appendChild(p2)

                     tableFromJson(displaydata);

                     //NOTE tableFromJson() --------------------------------//
                     function tableFromJson(Json2Table) {
                         // Extract value from table header. 
                         var col = [];
                         for (var i = 0; i < Json2Table.length; i++) {
                             for (var key in Json2Table[i]) {
                                 if (col.indexOf(key) === -1) {
                                     col.push(key);
                                 }
                             }
                         }

                         // Create a table.
                         var table = document.createElement("table");
                         table.style.border = "solid 1px #ddd";
                         table.style.padding = "2px 3px";
                         table.style.borderCollapse = "collapse";

                         // Create table header row using the extracted headers above.
                         var tr = table.insertRow(-1); // table row.

                         for (var i = 0; i < col.length; i++) {
                             var th = document.createElement("th"); // table header.
                             th.style.border = "solid 1px #fc1616";
                             th.style.padding = "2px 3px";
                             th.style.borderCollapse = "collapse";
                             th.innerHTML = col[i];
                             tr.appendChild(th);
                         }

                         // add json data to the table as rows.
                         for (var i = 0; i < Json2Table.length; i++) {

                             tr = table.insertRow(-1);

                             for (var j = 0; j < col.length; j++) {
                                 var tabCell = tr.insertCell(-1);
                                 tabCell.style.border = "solid 1px #12ba28";
                                 tabCell.innerHTML = Json2Table[i][col[j]];
                             }
                         }
                         // Now, add the newly created table with json data, to a container.
                         myWindow.document.body.appendChild(table);
                        }
                 }
            }
        },
    );
}());