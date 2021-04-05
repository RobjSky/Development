/**
 * Replace
 * MojoVisualizationTemplate with your plugin folder name which should be the same as the JS file name
 * ...YOUR JS CODE... - Javascript code
 */


(function () {
    // Define this code as a plugin in the mstrmojo object
    if (!mstrmojo.plugins.MstrVisTemplate) {
        mstrmojo.plugins.MstrVisTemplate = {};
    }
    // Custom mojo visualizations require the CustomVisBase library to render
    mstrmojo.requiresCls("mstrmojo.CustomVisBase");
    // Declare the visualization object
    mstrmojo.plugins.MstrVisTemplate.MstrVisTemplate = mstrmojo.declare(
        // Declare that this code extends CustomVisBase
        mstrmojo.CustomVisBase,
        null,
        {
            // Define the Javascript class that renders your visualization as mstrmojo.plugins.{plugin name}.{js file name}
            scriptClass: 'mstrmojo.plugins.MstrVisTemplate.MstrVisTemplate',
            // Define the external libraries to be used - in this sample. the amcharts library
            externalLibraries: [{url: "//cdn.amcharts.com/lib/4/core.js"},
			{url: "//cdn.amcharts.com/lib/4/charts.js"},{url: "//cdn.amcharts.com/lib/4/themes/animated.js"}],
            // Define whether a tooltip should be displayed with additional information
            useRichTooltip: true,
            model: null,




            plot: function () {
                var me = this;
                var domNode = this.domNode,
                    dp = this.dataInterface;
                /**
                 * ---------------------------------------
                 * container
                 * |-> imgContainer
                 * |-> kpiContainer
                 *      |-> mainContainer
                 *          |-> mainlabel
                 *      |-> subsContainer
                 *          |-> label2
                 * ---------------------------------------
                 */
                // Create chart instance
                var chart = am4core.create(this.domNode, am4charts.XYChart);

                // Create a container
                var container = am4core.create(this.domNode, am4core.Container);
                container.width = am4core.percent(100);
                container.height = am4core.percent(100);
                container.layout = "horizontal";
// codepen

// Create Sub-Containers
var imgContainer = container.createChild(am4core.Container);
imgContainer.layout = "vertical";
imgContainer.width = am4core.percent(33);
imgContainer.height = am4core.percent(100);
imgContainer.background.fill = am4core.color("#D2AB99");
imgContainer.background.fillOpacity = 0.3;
imgContainer.innerheight = 50;

// Create KPI-Containers
var kpiContainer = container.createChild(am4core.Container);
kpiContainer.layout = "vertical";
kpiContainer.width = am4core.percent(100);
kpiContainer.height = am4core.percent(100);
kpiContainer.background.fill = am4core.color("#8DB38B");
kpiContainer.background.fillOpacity = 0.3;

// Create Main-container for kpiContainer
var mainContainer = kpiContainer.createChild(am4core.Container);
mainContainer.layout = "horizontal";
mainContainer.width = am4core.percent(100);
mainContainer.height = am4core.percent(50);

var gradient = new am4core.LinearGradient();
gradient.addColor(am4core.color("#f7f7f7"));
gradient.addColor(am4core.color("#e8e8e8"));
gradient.rotation = 90;
mainContainer.background.fill = gradient;

var subsContainer = kpiContainer.createChild(am4core.Container);
subsContainer.layout = "horizontal";
subsContainer.width = am4core.percent(100);
subsContainer.height = am4core.percent(50);
subsContainer.background.fill = gradient;


// Add data
chart.data = [{
    "category": "Research & Development",
    "value": 9.5
}, {
    "category": "Marketing",
    "value": 6
}, {
    "category": "Sales",
    "value": 8.95
}, {
    "category": "Distribution",
    "value": 6.55
}];



var KPIName = (chart.data[0].category);
var KPIValue = (chart.data[0].value);
var mainlabel = mainContainer.createChild(am4core.Label);
mainlabel.text = "[font-size: 3vw; bold]Category: " + KPIName + " value = " + KPIValue + "[/]";
mainlabel.fontSize = 32;
mainlabel.align = "center";
mainlabel.valign = "middle";
mainlabel.padding(0, 0, 0, 20);

// Create a container child
var colors = new am4core.ColorSet();
for (var i = 1; i < chart.data.length; i++) {
    var subKPIName = (chart.data[i].category);
    var subKPIValue = (chart.data[i].value);
    var devToMain = Math.round((chart.data[i].value / chart.data[0].value) * 100).toFixed(2) + " %";

    let labelcontainer = subsContainer.createChild(am4core.Container);
    labelcontainer.width = am4core.percent(100);
    labelcontainer.height = am4core.percent(100);
    switch (i) {
        case 1:
            labelcontainer.background.fill = am4core.color("#000");
            break;
        case 2:
            labelcontainer.background.fill = am4core.color("#666666");
            break;
        default:
            // code block
    }
    let label2 = labelcontainer.createChild(am4core.Label);

    label2.text = "[font-size: 2vw; bold]" + subKPIName +
        "[/][font-size: 1.6vw]\n ________________" +
        "\n value: " + subKPIValue +
        "\n value: " + devToMain + "[/]";

    label2.width = am4core.percent(100);
    label2.align = "center";
    label2.valign = "middle";
    label2.padding(0, 0, 0, 15);
    label2.fill = colors.next();
}

var image = imgContainer.createChild(am4core.Image);
image.width = am4core.percent(100);
image.height = am4core.percent(100);
image.horizontalCenter = "left";
image.verticalCenter = "middle";
image.href = "https://lokeshdhakar.com/projects/lightbox2/images/image-4.jpg"














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
                    var AttrIsDate = "false";
                    // if date then (Input dd.mm.yy)
                    let attrlength = dp.getRowHeaders(0).getHeader(0).getName().length;
                    // count only digits (\d)
                    let digitscount = String(dp.getRowHeaders(0).getHeader(0).getName()).match(/\d/g).length;
                    //window.alert('attrlength: ' + attrlength + ' digitscount: ' + digitscount + '   --> substract: ' + (attrlength - digitscount));

                    switch (attrlength - digitscount) {
                        //Date: if attribute has length - digitcount = 2 then we assume a date
                        case 2:
                            AttrIsDate = "date";
                            break;
                            //Datetime: if attribute has length(19) - digitcount(14) = 5 then we assume a datetime
                        case 5:
                            AttrIsDate = "datetime";
                            break;
                        default:
                            AttrIsDate = "false";
                    }


                    datapool.cols = [];
                    // Metric.Names: set metric column names ["metricname1","metricname2"]
                    for (var z = 0; z < dp.getColumnHeaderCount(); z++) {
                        datapool.cols[z] = dp.getColHeaders(0).getHeader(z).getName();
                    }
                    //window.alert('datapool.cols[]: ' + JSON.stringify(datapool.cols));

                    //set rows data
                    var rows = [];
                    //go thru all rows
                    for (i = 0; i < dp.getTotalRows(); i++) {
                        var c = {}
                        // Attribute.Values: get date from data. date needs to be in the form of dd.mm.yy
                        c.date = dp.getRowHeaders(i).getHeader(0).getName();

                        switch (AttrIsDate) {
                            case "date":
                                var parts = c.date.split('.');
                                //window.alert('parts[]: ' + JSON.stringify(parts));
                                // convert to Datetime-Format yyyy-mm-ddThh:mm:ss.000Z
                                c.date = new Date('20' + parts[2], parts[1] - 1, parts[0]);
                                break;
                            case "datetime":
                                var parts = c.date.split(' ');
                                var dparts = parts[0].split('.');
                                var tparts = parts[1].split(':');
                                c.date = new Date('20' + dparts[2], dparts[1] - 1, dparts[0], tparts[0], tparts[1], tparts[2]);
                                /**
                             window.alert('case datetime: ' + JSON.stringify(c.date) 
                                                + ' \n i= ' + i
                                                +' \n c.date= ' + c.date);
                                */
                                break;
                            default:
                                window.alert('default: Doenst look like a date to me.');
                                break;
                        }
                        /**
                         var parts = c.date.split('.');
                            // convert to Datetime-Format yyyy-mm-ddThh:mm:ss.000Z
                            c.date = new Date('20' + parts[2], parts[1] - 1, parts[0]);
                        */
                        c.values = [];
                        // Metric.Values: get the metric values.
                        for (var z = 0; z < dp.getColumnHeaderCount(); z++) {
                            c['values' + z] = dp.getMetricValue(i, z).getRawValue()
                        }
                        // push c to current position in rows-Array. Meaning c.date and c.values, resulting in {"date" : "yyyy-mm-ddThh:mm:ss.000Z" , "values" : 123 , "values0" : 456}
                        rows[i] = c;
                    }
                    datapool.rows = rows;
                    //window.alert('datapool.rows[]: ' + JSON.stringify(datapool.rows));
                    //window.alert('datapool: ' + JSON.stringify(datapool));

                    return datapool;
                };
            }
        });
})();