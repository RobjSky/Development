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
            errorDetails: "This visualization requires one attributes of type DateTime (Format: yyyy-mm-dd hh:mm:ss) and one metric.",
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

                   var str = "21.09.2018 20:00:00";
                   //var tester = str.substring(0, 2).concat(" mm ", str.substring(3, 5), " yy ", str.substring(6, 11), " time ", str.substring(11, 19));
                   var tester = str.substring(6, 10).concat("-", str.substring(3, 5), "-", str.substring(0, 2), "T", str.substring(11, 19));

                   var varseries = [];
                   // Set series of metric values
                   for (i = 0; i < datatb.metricnames.length; i++) {
                       varseries.push({
                           name: datatb.metricnames[Object.keys(datatb.metricnames)[i]],
                           data: datatb.metr[Object.keys(datatb.metr)[i]]
                       });
                   }
                   
                   // Convert DateTime to Json Datetime String ('24.09.2018 20:00:00' --> '2018-09-24T00:00:00')
                   var date2cat = datatb.attr[Object.keys(datatb.attr)[0]];
                   //window.alert('ist datum: date2cat[1]:    ' + JSON.stringify(date2cat[1]));





                   //if (is_object(date2cat[1]) && date2cat[1] instanceof DateTime) {
                   if (date2cat[1].length ==10) { //Input is only Date
                       //window.alert('IF ist datum: date2cat[1]:    ' + JSON.stringify(date2cat[1]) + ' : ' + date2cat[1].length);
                       for (i = 0; i < date2cat.length; i++) {
                           convertedDateTime = date2cat[i].substring(6, 10).concat("-", date2cat[i].substring(3, 5), "-", date2cat[i].substring(0, 2), "T", "00:00:00");
                           date2cat[i] = convertedDateTime
                       }
                       //window.alert('IF ist datum: date2cat[1]:    ' + JSON.stringify(date2cat[1]) + ' : ' + date2cat[1].length);
                   } else { // Input is DateTime
                       //window.alert('ELSE ist DATETIME: date2cat[1]:    ' + JSON.stringify(date2cat[1]) + ' : ' + date2cat[1].length);
                       for (i = 0; i < date2cat.length; i++) {
                           convertedDateTime = date2cat[i].substring(6, 10).concat("-", date2cat[i].substring(3, 5), "-", date2cat[i].substring(0, 2), "T", date2cat[i].substring(11, 19));
                           date2cat[i] = convertedDateTime
                       }
                       //window.alert('ELSE ist DATETIME: date2cat[1]:    ' + JSON.stringify(date2cat[1]) + ' : ' + date2cat[1].length);
                   }

/*
                   for (i = 0; i < date2cat.length; i++) {
                       convertedDateTime = date2cat[i].substring(6, 10).concat("-", date2cat[i].substring(3, 5), "-", date2cat[i].substring(0, 2), "T", date2cat[i].substring(11, 19));
                       date2cat[i] = convertedDateTime
                   }*/
                   //window.alert('date2cat[] New:    ' + JSON.stringify(date2cat));


                    var options = {
                        chart: {
                            type: 'area',
                            width: '100%',
                            height: '100%',
                           /* animations: {
                                enabled: false
                            },*/
                        },
                        title: {
                            text: 'Datens??tze: ' + date2cat.length + ' // Datenformat: ' + JSON.stringify(date2cat[1]) +' / ' + date2cat[1].length,
                            align: 'left',
                            margin: 10,
                        },
                        dataLabels: {
                            enabled: false
                        },
                        stroke: {
                            width: 2
                        },
                        /*tooltip: {
                            enabled: false
                        },*/
                        series: 
                        varseries
                        /*[{
                            name: 'series1',
                            data: [30.95, 35.95]
                            //data: [30.95, 31.34, 31.18, 31.05, 31.00, 30.95, 31.24, 31.29, 38.89, 38.81, 38.61, 38.63, 38.99, 38.77, 38.34, 38.55, 38.11, 38.59]
                        }]*/
                        ,
                        xaxis: {
                            labels: {datetimeFormatter: {year: 'yyyy', month: 'MMM \'yy', day: 'dd MMM', hour: 'HH:mm'}, },
                            type: 'datetime',
                            //'2018-09-24T00:00:00',
                            categories: date2cat,
                            //categories: [tester, "2018-09-27T00:00:00"],
                            //categories: ['24.09.2018 20:00:00', '25.09.2018 20:00:00'],
                            /*
                            categories: ['2018-09-24T00:00:00',
                                         '2018-09-25T00:00:00',
                                         '2018-09-26T00:00:00',
                                         '2018-09-27T00:00:00',
                                         '2018-09-28T00:00:00',
                                         '2018-09-29T00:00:00',
                                         '2018-09-30T00:00:00',
                                         '2018-10-01T00:00:00',
                                         '2018-10-02T00:00:00',
                                         '2018-10-03T00:00:00',
                                         '2018-10-04T00:00:00',
                                         '2018-10-05T00:00:00',
                                         '2018-10-06T00:00:00',
                                         '2018-10-07T00:00:00',
                                         '2018-10-08T00:00:00',
                                         '2018-10-09T00:00:00',
                                         '2018-10-10T00:00:00',
                                         '2018-10-11T00:00:00'
                                         ],
                            */
                            //min: new Date('24 Sep 2018').getTime(),
                            tickAmount: 6
                        },
                        
                        // yaxis: { decimalsInFloat: 2 },
                        fill: {
                            type: 'gradient',
                            gradient: {
                                opacityFrom: 0.6,
                                opacityTo: 0.8,
                            }
                        },
                    }


                    var chart = new ApexCharts(domNode, options);
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

                    var Say2 =  'varseries[]:    ' + JSON.stringify(varseries) 
                                +'<br>' + '<br>'
                                'date2cat[]:    ' + JSON.stringify(date2cat) +
                                '<br>' + '<br>'
                                +'datatb[].attr[].1:    ' + tester
                                //+'<br>' + '<br>'
                                //+'datatb[].attr[]:    ' + JSON.stringify(datatb.attr)
                                +'<br>' + '<br>'
                                +'datatb[].attr[].values:  ' + JSON.stringify(datatb.attr[Object.keys(datatb.attr)[0]])
                               

                    /*          'Attribute names:    ' + datatb.attrnames + '<br>'
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