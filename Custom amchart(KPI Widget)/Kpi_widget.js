/**------------------------------------------------------------
< script src = "//www.amcharts.com/lib/4/core.js" > < /script> <
    script src = "//www.amcharts.com/lib/4/charts.js" > < /script> <
    div id = "chartdiv" > < /div>
------------------------------------------------------------*/

/**------------------------------------------------------------
body {
    font - family: -apple - system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans - serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
}

#
chartdiv {
    width: 100 % ;
    height: 300 px;
}
------------------------------------------------------------**/















/**
 * ---------------------------------------
 * This demo was created using amCharts 4.
 *
 * For more information visit:
 * https://www.amcharts.com/
 *
 * Documentation is available at:
 * https://www.amcharts.com/docs/v4/
 * ---------------------------------------
 */

// Create chart instance
var chart = am4core.create("chartdiv", am4charts.XYChart);

// Create a container
var container = am4core.create("chartdiv", am4core.Container);
container.width = am4core.percent(100);
container.height = am4core.percent(100);
container.layout = "horizontal";

// Create sub-containers
var imgContainer = container.createChild(am4core.Container);
imgContainer.layout = "vertical";
imgContainer.width = am4core.percent(33);
imgContainer.height = am4core.percent(100);
imgContainer.background.fill = am4core.color("#D2AB99");
imgContainer.background.fillOpacity = 0.3;
imgContainer.innerheight = 50;
//imgContainer.marginLeft = 25;



var kpiContainer = container.createChild(am4core.Container);
kpiContainer.layout = "vertical";
kpiContainer.width = am4core.percent(100);
kpiContainer.height = am4core.percent(100);
kpiContainer.background.fill = am4core.color("#8DB38B");
kpiContainer.background.fillOpacity = 0.3;

// Create sub-containers for kpiContainer
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
    "value": 3.5
}, {
    "category": "Marketing",
    "value": 6
}, {
    "category": "Sales",
    "value": 129.95
}, {
    "category": "Distribution",
    "value": 6.55
}];



var test12 = (chart.data[0].category);
var test88 = (chart.data[0].value);
var mainlabel = mainContainer.createChild(am4core.Label);
mainlabel.text = "Category: " + test12 + " value = " + test88;
mainlabel.fontSize = 32;
mainlabel.align = "center";
mainlabel.valign = "middle";
mainlabel.padding(0, 0, 0, 20);

// Create a container child
var colors = new am4core.ColorSet();
for (var i = 1; i < chart.data.length; i++) {
    var test34 = (chart.data[i].category);
    var test99 = (chart.data[i].value);
    let label2 = subsContainer.createChild(am4core.Label);
    label2.text = "[font-size: 10px; bold]Category: " + test34 +
        "\n ____________________________________________" +
        "[/]\n value: " + test99;

    //label2.html = "<font size=-5>Category:</font> " + test34 + "<br><hr>value: " + test99;

    label2.fontSize = 32;
    label2.align = "center";
    label2.valign = "middle";
    label2.padding(0, 0, 0, 20);
    label2.fill = colors.next();
}

var image = imgContainer.createChild(am4core.Image);
image.width = am4core.percent(100);
image.height = am4core.percent(100);
image.horizontalCenter = "left";
image.verticalCenter = "middle";
image.href = "https://lokeshdhakar.com/projects/lightbox2/images/image-4.jpg"