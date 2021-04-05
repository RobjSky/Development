(function () {
    var carName = "Volvo";
   
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


           // ANCHOR CUSTOM PROPERTIES            
            updateLabelSize: function (labelsize) {
                    //var dom = this.domNode;
                    //var chart = this.domNode;
                    window.alert('ITSA ME2! '+labelsize);

                    window.alert('ITSA YOU! ' + carName);
                    window.alert('ITSA YOU! ' + this.ApexLineChart);
                    window.alert('ITSA YOU! ' + this.ApexCharts);
                    window.alert('ITSA YOU! ' + this.CustomVisBase.chart);
                    window.alert('ITSA YOU! ' + this.CustomVisBase.carName);
                    window.alert('ITSA YOU! ' + this.renderGraph.chart);
                    chart.updateOptions({
                         title: {
                             text: 'Testing Mario',
                             align: 'left'
                         },
                    })
                    //d3.select(dom).selectAll("text").style("font-size", labelsize);
                },
            /*
            updateLabelFormat: function (rawD, labels) {
                var dom = this.domNode;

                function updateLabel(element, i, j, numRow) {
                    var label = " ";
                    if (labels.text === "true") {
                        label += element.name;
                        if (labels.values === "true") {
                            label += ": ";
                        }
                    }
                    if (labels.values === "true") {

                        label += element.formattedValue;
                    }
                    d3.select(dom).selectAll("text")[0][i * numRow + j].textContent = label;
                }
                var numRow = rawD.children.length; // Number of row in a funnel
                rawD.children.forEach(function (child, i) {
                    if (child.children) {
                        numRow = child.children.length;
                        child.children.forEach(function (child2, j) {
                            updateLabel(child2, i, j, numRow);
                        });
                    } else {
                        updateLabel(child, 0, i, numRow);
                    }
                });
            },
            // ANCHOR CUSTOM PROPERTIES */
            
            
            
            
            plot: function () {
                var domNode = this.domNode,
                    dp = this.dataInterface;

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

                    if (datatb.attrnames.length == 1 && datatb.metricnames.length == 1) {
                        var options = {
                            chart: {
                                type: 'line',
                                width: '100%',
                                height: '100%'
                            },
                        title: {
                            text: 'Product Trends by Month',
                            align: 'left'
                        },
                            series: [{
                                name: datatb.metricnames[Object.keys(datatb.metricnames)[0]],
                                //name: 'sales',
                                data: datatb.metr[Object.keys(datatb.metr)[0]]
                                //data: [30, 40, 35, 50, 49, 60, 70, 91, 125]
                            }],
                            xaxis: {
                                categories: datatb.attr[Object.keys(datatb.attr)[0]]
                                //categories: ["1991", "1992", "1993", "1994", "1995", "1996", "1997", "1998", "1999"]
                            },
                            yaxis: {
                                decimalsInFloat: 2,
                            }
                        }
                    } else if (datatb.attrnames.length == 1 && datatb.metricnames.length == 2) {
                        var options = {
                            chart: {
                                type: 'line',
                                width: '100%',
                                height: '100%'
                            },
                            title: {
                                text: 'Product Trends by Month',
                                align: 'left'
                            },
                            series: [{
                                name: datatb.metricnames[Object.keys(datatb.metricnames)[0]],
                                //name: 'sales',
                                data: datatb.metr[Object.keys(datatb.metr)[0]]
                                //data: [30, 40, 35, 50, 49, 60, 70, 91, 125]
                            },{
                                name: datatb.metricnames[Object.keys(datatb.metricnames)[1]],
                                data: datatb.metr[Object.keys(datatb.metr)[1]]
                            }],
                            xaxis: {
                                categories: datatb.attr[Object.keys(datatb.attr)[0]]
                                //categories: ["1991", "1992", "1993", "1994", "1995", "1996", "1997", "1998", "1999"]
                            },
                            yaxis: {
                                decimalsInFloat: 2, 
                            }
                        }
                    }
                    //var chart = new ApexCharts(document.querySelector("#chart"), options);
                    var chart = new ApexCharts(domNode, options);
                    window.alert('ITSA APEX! ' + chart);

                    chart.render();


/*
                    // Accessing Keys
                    window.alert('Object.keys(datatb): ' + Object.keys(datatb));
                    // Accessing Values
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