/**
 * Replace
 * MojoVisualizationTemplate with your plugin folder name which should be the same as the JS file name
 * ...YOUR JS CODE... - Javascript code
 * 
 * 
 * 
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
        null, {
            // Define the Javascript class that renders your visualization as mstrmojo.plugins.{plugin name}.{js file name}
            scriptClass: 'mstrmojo.plugins.AcustomCard4KPI.AcustomCard4KPI',
            // Define the CSS class that will be appended to container div
            cssClass: "AcustomCard4KPI",
            // Define the error message to be displayed if JavaScript errors prevent data from being displayed
            errorDetails: "This visualization requires more...",
            // Define the external libraries to be used - in this sample. the amcharts library
            externalLibraries: [{url: "//cdn.amcharts.com/lib/4/core.js"},			{url: "//cdn.amcharts.com/lib/4/charts.js"},            {url: "//cdn.amcharts.com/lib/4/themes/animated.js"},            {url: "//cdn.amcharts.com/lib/4/themes/microchart.js"}],
            // Define whether a tooltip should be displayed with additional information
            useRichTooltip: true,
            // Define whether the DOM should be reused on data/layout change or reconstructed from scratch
            reuseDOMNode: false,

            plot: function () {
                var me = this;
                var domNode = this.domNode,
                    dp = this.dataInterface;
                // Create chart instance
                //var chart = am4core.create(this.domNode, am4charts.XYChart);
                // clear div 
                //document.getElementById('contai').innerHTML = "";

                // Create a container
                //var container = am4core.create(this.domNode, am4core.Container);
                //container.width = am4core.percent(100);
                //container.height = am4core.percent(100);
                //container.layout = "horizontal";
/*
                this.setDefaultPropertyValues({
                    showPic = 'true',
                });
*/

//var showPiccy = me.getProperty("showPic");
//window.alert(showPiccy + ' must be showPic');
// NOTE codepen start

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
//  |   +card(s) (.card, .flex-subsitem1)
 * --------------------------------------- */
/*???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????*/
/* VERSION 1.7 2021/05/11 */
var 
    //showPic = true,
    showPic = me.getProperty("showPic"),
    showMainKPI = true,
    showProgressbar = false,
    showVariationOnly = true,
    cardstyle = "filled",
    /* filled bordered */
    mainColorF,
    mainColorB = "#efefed",
    subKPIColors = ["#000", "#5b5b5b", "#7f7f7f", "#9e9e9e"],
    /*subKPIFontColors = ["purple", "green", "yellow", "orange"],*/
    subKPIFontColors = ["#c4c4c4", "#c4c4c4", "#444", "#444"],
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
    "value": 1101.5
}, {
    "category": "Budget",
    "value": 1520
}, {
    "category": "prev. Year",
    "value": 1200.5
}, {
    "category": "prev. Month",
    "value": 900.55
}, {
    "category": "prev. Week",
    "value": 660.55
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
            pattern.stroke = am4core.color(barColorNegative).lighten(0.2);
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
            pattern.stroke = am4core.color(barColorPositive).lighten(0.2);
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


window.alert(showPic + ' must be showPic. vorm IF');

// Create Image Container // Create Sub-Containers
if (showPic) { //showPic === true
    window.alert(showPic + ' must be showPic. im IF');
    var imgContainer = document.createElement('div');
    var imgOverlay = document.createElement('div');
    var imgText = document.createElement('div');
    var img = document.createElement("img");
    imgContainer.classList.add('imgContainer');
    imgOverlay.classList.add('overlay');
    imgText.classList.add('imgText');
    img.classList.add('coverimage');
    imgText.innerHTML = "Titel2: <br>" + data[0].category
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
if (showMainKPI) {
    var KPIName = (data[0].category);
    var KPIValue = (data[0].value);
    var mainKPIcontai = document.createElement('div');
    mainKPIcontai.classList.add('topbar-item1');
    mainKPIcontai.innerHTML = "<div class='KPIName';>Category: " + KPIName + "</div>";
    /*mainKPIcontai.innerHTML += "<hr class='style-two'; style='background-color:white'>";*/
    mainKPIcontai.innerHTML += "<span class='KPIValue'; style='font-size:10vw;'>" + KPIValue + "</span>";
    mainKPIcontai.style.background = mainColorB;

    KPIcontai.appendChild(mainKPIcontai);
}

var subsContai = document.createElement('div');
subsContai.classList.add('flex-subscontainer');

for (var i = 1; i < data.length; i++) {
    var subKPIName = (data[i].category);
    var subKPIValue = (data[i].value);
    var devToMain = Math.round((1 - data[i].value / data[0].value) * 100).toFixed(1);
    card = createCard(subKPIName, subKPIValue, devToMain, subKPIFontColors[i - 1], subKPIColors[i - 1]);
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
function createCard(subKPIName, subKPIValue, devToMain, fontcolor, backcolor) {
    var card = document.createElement('div'),
        bulletdiv = document.createElement('div'),
        txt1 = document.createElement('div'),
        txt2 = document.createElement('div'),
        txt3 = document.createElement('span'),
        txt4 = document.createElement('div');
    txt1.classList.add('KPIName');
    txt1.innerHTML = subKPIName +
        "<hr class='style-two'; style='background-color:" + fontcolor + ";'>"
    txt2.classList.add('KPIValue');
    bulletdiv.id = "bulletdiv";
    card.style.position = "relative";
    card.setAttribute("id", "rangeselect");
    card.classList.add('card');
    card.classList.add('flex-subsitem1');

    if (showVariationOnly) {
        txt2.innerHTML = devToMain + "%";
        bulletdiv.style.height = '11px';
        //createThreshold(txt2, devToMain)
        card.style.background = backcolor;
        card.style.color = fontcolor;
    } else {
        createThreshold(txt3, devToMain)
        bulletdiv.style.height = '14px';
        txt2.innerHTML = subKPIValue;
        txt4.classList.add('KPITxt');
        txt4.appendChild(txt3);
        txt4.innerHTML += " zu " + subKPIName;
        if (cardstyle == "filled") {
            txt4.style.background = fontcolor;
            card.style.background = backcolor;
            card.style.color = fontcolor;
        } else if (cardstyle == "bordered") {
            txt1.style.padding = "0.1em 0.5em 0.1em 0.5em";
            txt1.innerHTML = subKPIName
            txt4.style.background = am4core.color(backcolor).lighten(0.8);
            card.style.background = mainColorB;
            card.style.color = backcolor;
            card.style.border = "1px solid " + backcolor;
            card.style.borderTop = "9px solid" + backcolor;
        };
    }

    card.appendChild(txt1);
    card.appendChild(txt2);
    if (showProgressbar == true) {
        createProgressBar(bulletdiv, subKPIName, devToMain, 75);
        card.appendChild(bulletdiv);
    }
    card.appendChild(txt4);

    return (card);
}

function createThreshold(showVari, devToMain) {
    if (devToMain < barMin) {
        showVari.innerHTML = '???? ' + devToMain + "%"
        showVari.style.color = am4core.color(barColorNegative).lighten(0.2);
    } else if (barMin < devToMain && devToMain < 0) {
        showVari.innerHTML = '???? ' + devToMain + "%"
        showVari.style.color = barColorNegative
    } else if (0 < devToMain && devToMain < barMax) {
        showVari.innerHTML = '???? ' + devToMain + "%"
        showVari.style.color = barColorPositive;
    } else if (barMax < devToMain) {
        showVari.innerHTML = '???? ' + devToMain + "%"
        showVari.style.color = am4core.color(barColorPositive).lighten(0.2);
    }
}




// NOTE codepen end





                // NOTE prepareData()
                // https://lw.microstrategy.com/msdz/MSDL/GARelease_Current/_GARelease_Archives/103/docs/projects/VisSDK_All/Default.htm#topics/HTML5/Data_Interface_API.htm
                function prepareData() {
                    // Create a new array (datapool) and push the objects datarecords to the new array. each datarecord is one single object in the array.
                    // additional a check on "how many attributes?" and "how many metrics are being used?" must be performed to derive the FOR-Indicators
                    // additional a check is needed to format the datetime attribute from MSTR to a datetime attibute in JS.
                    // datapool = {"cols" : [mtr1.Name, mtr2.Name],
                    //             "attrs" : [attr1.Name, attr2.Name],
                    //             "rows" : [{ "attr.Name" : attr.Value1,
                    //                         "mtr1.Name" : mtr1.Value1,
                    //                         "mtr2.Name" : mtr2.Value1 }, {"attr.Name" : attr.Value2, ...}, {...}], 
                    var datapool = {};


                    // if date then (Input dd.mm.yy)
                    let attrlength = dp.getRowHeaders(0).getHeader(0).getName().length;
                    let digitscount;
                    // count only digits (\d)
                    try {
                        digitscount = String(dp.getRowHeaders(0).getHeader(0).getName()).match(/\d/g).length;
                        //window.alert("Number of digits found: " + digitscount);
                    } catch (err) {
                        digitscount = 0;
                        //window.alert('Number of digits found: ' + digitscount + ' Error: ' + err.message);
                    };

                    switch (attrlength - digitscount) {
                        //Date: if attribute has length - digitcount = 2 then we assume a date
                        case 2:
                            AttrIsDate = "date";
                            AttrCount = 1;
                            break;
                            //Datetime: if attribute has length(19) - digitcount(14) = 5 then we assume a datetime
                        case 5:
                            AttrIsDate = "datetime";
                            AttrCount = 1;
                            break;
                        default:
                            AttrIsDate = "false";
                            AttrCount = 0;
                    }

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
                    //window.alert('new be4 c.date: ' + JSON.stringify(dp.getRowHeaders(0).getHeader(0).getName()));
                    //go thru all rows
                    for (i = 0; i < dp.getTotalRows(); i++) {
                        var c = {}
                        // Attribute.Values: get date from data. date needs to be in the form of dd.mm.yy
                        c.date = dp.getRowHeaders(i).getHeader(0).getName();

                        switch (AttrIsDate) {
                            case "date":
                                if (c.date.indexOf('.') > -1) {
                                    var parts = c.date.split('.');
                                    if (parts[2].length == 2) {
                                        parts[2] = '20' + parts[2];
                                    }
                                    // convert to Datetime-Format yyyy-mm-ddThh:mm:ss.000Z
                                    c.date = new Date(parts[2], parts[1] - 1, parts[0]);
                                } else if (c.date.indexOf('/') > -1) {
                                    var parts = c.date.split('/');
                                    if (parts[2].length == 2) {
                                        parts[2] = '20' + parts[2];
                                    }
                                    // Note: JavaScript counts months from 0 to 11. January is 0. December is 11.
                                    // convert to Datetime-Format yyyy-mm-ddThh:mm:ss.000Z
                                    c.date = new Date(parts[2], parts[0] - 1, parts[1]);
                                }
                                seriesToolTipFormat = "{dateX.formatDate('dd.MM.yyyy ')}: {name}: [bold]{valueY}[/]";
                                break;

                            case "datetime":
                                var parts = c.date.split(' ');
                                //var dparts = parts[0].split('.');
                                var dparts = parts[0].split(/\.|\//); //split by dot(.) or forwardslash(/)
                                var tparts = parts[1].split(':');
                                c.date = new Date('20' + dparts[2], dparts[1] - 1, dparts[0], tparts[0], tparts[1], tparts[2]);
                                seriesToolTipFormat = "{dateX.formatDate('dd.MM.yyyy HH:mm')}: {name}: [bold]{valueY}[/]";
                                if (i < 2) {
                                    window.alert('DAteTIme with found.')
                                    window.alert('dparts2(Y): ' + dparts[2] + ' //*// dparts0(M): ' + dparts[0] + ' //*// dparts1-1(D): ' + (dparts[1] - 1) + ' //*// dparts1: ' + dparts[1])
                                }
                                break;
                            default:
                                //window.alert('default: Doesn??t look like a date to me. Maybe try again. Good Luck.');
                                break;
                        };

                        c.attributes = [];
                        // Attribute.Values: get the attribute values. Z=AttrCount so the first iteration is skipped IF the first attribute is a date and therefore it should be in c.date
                        for (var z = AttrCount; z < dp.getRowTitles().size(); z++) {
                            c[dp.getRowTitles(0).getTitle(z).getName()] = dp.getRowHeaders(i).getHeader(z).getName()
                            //c['attri' + dp.getRowTitles(0).getTitle(z).getName()] = dp.getRowHeaders(i).getHeader(z).getName()
                        }

                        c.values = [];
                        // Metric.Values: get the metric values.
                        for (var z = 0; z < dp.getColumnHeaderCount(); z++) {
                            c['values' + z] = dp.getMetricValue(i, z).getRawValue()
                        }
                        // push c to current position in rows-Array. Meaning c.date and c.values, resulting in {"date" : "yyyy-mm-ddThh:mm:ss.000Z" , "values" : 123 , "values0" : 456}
                        rows[i] = c;
                    };
                    //window.alert('new after c.date: ' + JSON.stringify(rows[0]));
                    datapool.rows = rows;

                    //window.alert("Number of attri and metrics: " + datapool.attrs.length + " and " + datapool.cols.length);

                    // TODO

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
                    //var Say1 = 'DataPool: \n datapool.cols: ' + JSON.stringify(datapool.cols) + '\n datapool.attrs: ' + JSON.stringify(datapool.attrs);
                    //var Say2 = "datapool.rows:";
                    //var myWindow2 = PopUp(Say1, Say2, datapool.rows);

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
        });
})();