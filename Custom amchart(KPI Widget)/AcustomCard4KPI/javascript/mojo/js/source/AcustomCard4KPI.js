/**
 * Replace
 * MojoVisualizationTemplate with your plugin folder name which should be the same as the JS file name
 * ...YOUR JS CODE... - Javascript code
 */


(function () {
    // Define this code as a plugin in the mstrmojo object
    if (!mstrmojo.plugins.AcustomCard4KPI) {
        mstrmojo.plugins.AcustomCard4KPI = {};
    }
    // Custom mojo visualizations require the CustomVisBase library to render
    mstrmojo.requiresCls("mstrmojo.CustomVisBase");
    // Declare the visualization object
    mstrmojo.plugins.AcustomCard4KPI.AcustomCard4KPI = mstrmojo.declare(
        // Declare that this code extends CustomVisBase
        mstrmojo.CustomVisBase,
        null,
        {
            // Define the Javascript class that renders your visualization as mstrmojo.plugins.{plugin name}.{js file name}
            scriptClass: 'mstrmojo.plugins.AcustomCard4KPI.AcustomCard4KPI',
            // Define the external libraries to be used - in this sample. the amcharts library
            externalLibraries: [{url: "//cdn.amcharts.com/lib/4/core.js"},
			{url: "//cdn.amcharts.com/lib/4/charts.js"},
            {url: "//cdn.amcharts.com/lib/4/themes/animated.js"},
            {url: "//cdn.amcharts.com/lib/4/themes/microchart.js"}],
            // Define whether a tooltip should be displayed with additional information
            useRichTooltip: true,
            model: null,




            plot: function () {
                var me = this;
                var domNode = this.domNode,
                    dp = this.dataInterface;
                // Create chart instance
                //var chart = am4core.create(this.domNode, am4charts.XYChart);

                // Create a container
                //var container = am4core.create(this.domNode, am4core.Container);
                //container.width = am4core.percent(100);
                //container.height = am4core.percent(100);
                //container.layout = "horizontal";
// codepen

/**---------------------------------------
// contai (div#contai)
//  |
//  +imgContainer (.imgContainer)
//  | +img (.img)
//  | +imgoverlay (.overlay)
//  |   +imgText (.imgText)
//  +KPIcontai (.flex-topbar)
//  | +mainKPIcontai (.topbar-item1)
//  | +subsContai (.flex-subscontainer)
//  |   +card(s) (.card, .container, .flex-subsitem1)
 * --------------------------------------- */
/*🡫🢃🡣⮧⮯⬇⇩↓⭣↴⬇↓⇓▼⮇⭝🡠🡡🡢🡣🡤🡥🡦🡧🡨🡩🡪🡫🡬🡭🡮🡯🡰🡱🡲🡳🡴🡵🡶🡷🡸🡹🡺🡻🡼🡽🡾🡿🢀🢁🢂🢃🢄🢅🢆🢇◄▲▼►*/

var showPic = true,
    showMainKPI = true,
    showProgressbar = true,
    mainColorF,
    mainColorB = "white",
    subKPIColors = ["#000", "#5b5b5b", "#7f7f7f", "#9e9e9e"],
    subKPIFontColors = ["#9e9e9e", "#7f7f7f", "#5b5b5b", "#000"],
    subKPITextColor = "#9e9e9e",
    barMin = -30,
    barMax = 30,
    barColorPositive = "green",
    barColorNegative = "red",
    barColorF = "red",
    barColorB = "#d3d3d3";

am4core.useTheme(am4themes_animated);
am4core.useTheme(am4themes_microchart);


// Add data
data = [{
    "category": "Besucher -FK",
    "value": 100.5
}, {
    "category": "Budget",
    "value": 152
}, {
    "category": "previous Year",
    "value": 120.5
}, {
    "category": "previous Month",
    "value": 90.55
}, {
    "category": "previous Week",
    "value": 66.55
}];


/* *--------------------------------------------------------
 * Progress Bar Chart for KPI Widget
 * --------------------------------------------------------
 */
// Import starts here
function createProgressBar(putHere, category, value, target) {

    /* Create chart instance */
    if (putHere.tagName == 'DIV') {
        //when we instantiate a chart using the am4core.create() function, we also create a chart container.
        var progressBar = am4core.create(putHere, am4charts.XYChart);
    } else {
        //Creates a new element of specific type and assigns as a child to the Container.
        var progressBar = putHere.createChild(am4charts.XYChart);
    }

    progressBar.padding(0, 10, 0, 10);
    progressBar.chartContainer.minHeight = 5;
    progressBar.chartContainer.minWidth = 5;
    //progressBar.x = am4core.percent(0);
    progressBar.y = am4core.percent(5);
    progressBar.height = 6; //60;


    /* Add data */
    progressBar.data = [{
        "category": category,
        "value": value,
        "target": target,
        "backbar": 100
    }];

    /* Create axes */
    var categoryAxis = progressBar.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "category";
    categoryAxis.renderer.grid.template.disabled = true;
    categoryAxis.renderer.labels.template.disabled = true;

    var valueAxis = progressBar.xAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.grid.template.disabled = false;
    valueAxis.fill = subKPITextColor;
    valueAxis.min = barMin;
    valueAxis.max = barMax;
    valueAxis.strictMinMax = true;
    valueAxis.renderer.labels.template.disabled = true;



    // zero line
    valueAxis.renderer.baseGrid.disabled = false;
    valueAxis.renderer.baseGrid.stroke = am4core.color("#E5E5E3");
    valueAxis.renderer.baseGrid.strokeWidth = 3;
    valueAxis.renderer.baseGrid.strokeOpacity = 1;

    /**************************************************************************/
    /* Create ranges */
    function createRange(axis, from, to, color) {
        var range = axis.axisRanges.create();
        range.value = from;
        range.endValue = to;
        range.axisFill.fill = color;
        range.axisFill.fillOpacity = 0.8;
        range.label.disabled = true;
    }

    createRange(valueAxis, -100, 100, barColorB);
    //createRange(valueAxis, 0, 100, am4core.color("grey"));
    //createRange(valueAxis, 100, 200, am4core.color("black"));


    /* Create series */
    var series = progressBar.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueX = "value";
    series.dataFields.categoryY = "category";
    series.columns.template.height = am4core.percent(70);
    series.columns.template.fill = barColorF;
    series.columns.template.strokeOpacity = 0;
    //series.columns.template.column.cornerRadiusBottomRight = 4;
    //series.columns.template.column.cornerRadiusTopRight = 4;
    //series.columns.template.column.cornerRadiusBottomLeft = 4;
    //series.columns.template.column.cornerRadiusTopLeft = 4;
    series.tooltipText = "{valueX}";

    series.columns.template.adapter.add("fill", function (fill, target) {
        if (target.dataItem.valueX < barMin) {
            var pattern = new am4core.LinePattern();
            pattern.strokeWidth = 3;
            //pattern.gap = 2;
            pattern.rotation = 45;
            pattern.stroke = am4core.color(barColorNegative).lighten(0.5);
            return pattern;
        } else if (barMin < target.dataItem.valueX && target.dataItem.valueX < 0) {
            return barColorNegative;
        } else if (0 < target.dataItem.valueX && target.dataItem.valueX < barMax) {
            return barColorPositive;
        } else if (barMax < target.dataItem.valueX) {
            var pattern = new am4core.LinePattern();
            pattern.strokeWidth = 3;
            //pattern.gap = 2;
            pattern.rotation = 45;
            pattern.stroke = am4core.color(barColorPositive).lighten(0.5);
            return pattern;
        }
    });

    // Cursor and Tooltip
    progressBar.cursor = new am4charts.XYCursor()
    progressBar.cursor.lineX.disabled = true;
    progressBar.cursor.lineY.disabled = true;
    valueAxis.cursorTooltipEnabled = true;
}




// ALL NEW FROM HERE

// MAIN-KPI  -->// Create a container
var contai = document.createElement('div');
contai.setAttribute("id", "contai");


// Create Image Container // Create Sub-Containers
if (showPic === true) {
    var imgContainer = document.createElement('div');
    imgContainer.classList.add('imgContainer');
    var imgOverlay = document.createElement('div');
    imgOverlay.classList.add('overlay');
    var imgText = document.createElement('div');
    imgText.classList.add('imgText');
    imgText.innerHTML = "Titel2: <br>" + data[0].category
    var img = document.createElement("img");
    img.classList.add('coverimage');
    img.src = "https://i.imgur.com/9Hvv9je.jpg";

    imgOverlay.appendChild(imgText);
    imgContainer.appendChild(imgOverlay);
    imgContainer.appendChild(img);
    contai.appendChild(imgContainer);
}
// Create KPI Container // Create Container for main and subKPIs
var KPIcontai = document.createElement('div');
KPIcontai.id = "flex-topbar";
contai.appendChild(KPIcontai);

// Create Main-container for kpiContainer
if (showMainKPI === true) {
    var KPIName = (data[0].category);
    var KPIValue = (data[0].value);
    var mainKPIcontai = document.createElement('div');
    mainKPIcontai.classList.add('topbar-item1');
    mainKPIcontai.innerHTML = "<span class='KPIName'>Category: " + KPIName + "</span>";
    mainKPIcontai.innerHTML += "<br><span class='KPIValue'>" + KPIValue + "</span>";
    mainKPIcontai.style.background = mainColorB;
    KPIcontai.appendChild(mainKPIcontai);
}

var subsContai = document.createElement('div');
subsContai.classList.add('flex-subscontainer');

for (var i = 1; i < data.length; i++) {
    var subKPIName = (data[i].category);
    var subKPIValue = (data[i].value);
    var devToMain = Math.round((1 - data[i].value / data[0].value) * 100).toFixed(2);
    card = createCard(subKPIName, subKPIValue, devToMain, subKPIFontColors[i - 1])
    //Filled Card:
    card.style.background = subKPIColors[i - 1];
    card.style.color = subKPIFontColors[i - 1];
    //Bordered Card:
    //card.style.background = "#efefed";
    //card.style.color = "black";
    //card.style.border = "1px solid " + subKPIColors[i-1];

    subsContai.appendChild(card);
    KPIcontai.appendChild(subsContai);
}

/* *---------------------------------------------------
* Import into MSTR Viz
*  *-------------------------------------------------- */
//chartdiv.appendChild(contai) //codepen
this.domNode.appendChild(contai); //MSTR





/* *--------------------------------------------------------
 * create Card for KPI Widget
 * --------------------------------------------------------*/
function createCard(subKPIName, subKPIValue, devToMain, color) {
    var card = document.createElement('div'),
        bulletdiv = document.createElement('div'),
        txt1 = document.createElement('div'),
        txt2 = document.createElement('div'),
        txt3 = document.createElement('span'),
        txt4 = document.createElement('div');
    txt1.classList.add('KPIName');
    txt2.classList.add('KPIValue');
    txt4.classList.add('KPITxt');
    bulletdiv.id = "bulletdiv";
    bulletdiv.style.height = '15px';
    card.style.position = "relative";
    card.setAttribute("id", "rangeselect");
    card.classList.add('card');
    card.classList.add('flex-subsitem1');
    //txt1.style.background = color;
    //txt1.style.color = "white";
    txt1.style.color = color;
    //txt1.style.borderBottom= "1px solid " + color;


    txt1.innerHTML = subKPIName +
        "<hr style='width:75%; text-align:left; margin:0px; margin-top:5px; height:1px; border:none; background-color:#8A8A8A;'>";
    txt2.innerHTML = subKPIValue;

    if (devToMain < barMin) {
        txt3.innerHTML = '🡫 ' + devToMain + "%"
        txt3.style.color = am4core.color(barColorNegative).lighten(0.5);
    } else if (barMin < devToMain && devToMain < 0) {
        txt3.innerHTML = '🡮 ' + devToMain + "%"
        txt3.style.color = barColorNegative
    } else if (0 < devToMain && devToMain < barMax) {
        txt3.innerHTML = '🡭 ' + devToMain + "%"
        txt3.style.color = barColorPositive;
    } else if (barMax < devToMain) {
        txt3.innerHTML = '🡩 ' + devToMain + "%"
        txt3.style.color = am4core.color(barColorPositive).lighten(0.5);
    }
    txt4.appendChild(txt3);
    txt4.innerHTML += " zu " + subKPIName;



    card.appendChild(txt1);
    card.appendChild(txt2);
    if (showProgressbar == true) {
        createProgressBar(bulletdiv, subKPIName, devToMain, 75);
        card.appendChild(bulletdiv);
    }
    card.appendChild(txt4);

    return (card);
}














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