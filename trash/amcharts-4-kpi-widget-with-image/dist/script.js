/**---------------------------------------
 * container
 * |-> imgContainer
 * |-> kpiContainer
 *      |-> mainContainer
 *          |-> mainlabel
 *      |-> subsContainer
 *          |-> label2
 * ---------------------------------------
 */

var showPic = false;
var showMainKPI = true;
var mainColorF;
var mainColorB = "turquoise";
var subKPIColors = ["#000","#666","#999"];

am4core.useTheme(am4themes_animated);
am4core.useTheme(am4themes_microchart);

// Create chart instance
var chart = am4core.create("chartdiv", am4charts.XYChart);
chart.padding(0, 0, 0, 0);
chart.chartContainer.minHeight = 10;
chart.chartContainer.minWidth = 10;

// Add data
chart.data = [{
    "category": "Besucher -FK",
    "value": 101.5
}, {
    "category": "Budget",
    "value": 125
}, {
    "category": "previous Year",
    "value": 89.5
}, {
    "category": "previous Month",
    "value": 86.55
}];

// Create a container
var container = am4core.create("chartdiv", am4core.Container);
container.width = am4core.percent(100);
container.height = am4core.percent(100);
container.layout = "horizontal";


// Create Sub-Containers
if (showPic==true) {
  var imgContainer = container.createChild(am4core.Container);
  imgContainer.layout = "vertical";
  imgContainer.width = am4core.percent(33);
  imgContainer.height = am4core.percent(100);
  imgContainer.background.fill = am4core.color("#D2AB99");
  imgContainer.background.fillOpacity = 0.3;
  imgContainer.innerheight = 50;
}

// Create KPI-Containers
var kpiContainer = container.createChild(am4core.Container);
kpiContainer.layout = "vertical";
kpiContainer.width = am4core.percent(100);
kpiContainer.height = am4core.percent(100);
kpiContainer.background.fill = am4core.color("#8DB38B");
kpiContainer.background.fillOpacity = 0.3;

// Create Main-container for kpiContainer
if (showMainKPI==true) {
  var mainContainer = kpiContainer.createChild(am4core.Container);
  var KPIName = (chart.data[0].category);
  var KPIValue = (chart.data[0].value);
  var mainlabel = mainContainer.createChild(am4core.Label);
  mainContainer.layout = "horizontal";
  mainContainer.width = am4core.percent(100);
  mainContainer.height = am4core.percent(50);
  mainContainer.background.fill = mainColorB;
  mainlabel.text = "[font-size: 3vw; bold]Category: " + KPIName + " value = " + KPIValue + "[/]";
  mainlabel.fontSize = 32;
  mainlabel.align = "center";
  mainlabel.valign = "middle";
  mainlabel.padding(0, 0, 0, 20);
}




var subsContainer = kpiContainer.createChild(am4core.Container);
subsContainer.layout = "horizontal";
subsContainer.width = am4core.percent(100);
subsContainer.height = am4core.percent(50);
//subsContainer.background.fill = gradient;







// Create a container child
var colors = new am4core.ColorSet();


for (var i = 1; i < chart.data.length; i++) {
    var subKPIName = (chart.data[i].category);
    var subKPIValue = (chart.data[i].value);
    var devToMain = Math.round((1 - chart.data[i].value / chart.data[0].value) * 100).toFixed(2) + " %";

    let labelcontainer = subsContainer.createChild(am4core.Container);
    labelcontainer.width = am4core.percent(100);
    labelcontainer.height = am4core.percent(100);
    labelcontainer.background.fill = subKPIColors[i-1];
        
    let label2 = labelcontainer.createChild(am4core.Label);
    label2.text = "[font-size: 2vw; bold]" + subKPIName +
        "[/][font-size: 2.6vw]\n" +
        "\n" + subKPIValue +
        "[/][font-size: 1.6vw]" +
        "\n" + devToMain + " im Vergleich zu "+subKPIName +"[/]";
    label2.width = am4core.percent(100);
    label2.align = "center";
    label2.valign = "top";
    label2.padding(10, 0, 0, 10);
    label2.fill = colors.next();
    label2.wrap = true;
  
    createProgressBar(labelcontainer, "Distribution", devToMain, 75);
}


if (showPic==true) {
  var image = imgContainer.createChild(am4core.Image);
  image.width = am4core.percent(100);
  image.height = am4core.percent(100);
  image.horizontalCenter = "left";
  image.verticalCenter = "middle";
  image.href = "https://i.imgur.com/9Hvv9je.jpg"
}





///////////////////////////////////////////////////////////
/**--------------------------------------------------------
 * Bullet Chart for KPI Widget
 * --------------------------------------------------------
 */
// Import starts here
function createProgressBar(putHere, category, value, target) {

  /* Create chart instance */
  if(putHere.tagName == 'DIV') {
    //when we instantiate a chart using the am4core.create() function, we also create a chart container.
    var progressBar = am4core.create(putHere, am4charts.XYChart);
  } else {
    //Creates a new element of specific type and assigns as a child to the Container.
    var progressBar = putHere.createChild(am4charts.XYChart);      
  }
  
  progressBar.padding(0, 10, 0, 10);
  progressBar.chartContainer.minHeight = 10;
  progressBar.chartContainer.minWidth = 10;
  //progressBar.x = am4core.percent(0);
  progressBar.y = am4core.percent(5);
  progressBar.height = 10; //60;
  
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
  //categoryAxis.renderer.grid.template.location = 0.5;
  //categoryAxis.renderer.grid.template.stroke = am4core.color("#E5E5E3");
  //categoryAxis.renderer.grid.template.strokeWidth = 3;
  //categoryAxis.renderer.grid.template.strokeOpacity = 1;

  var valueAxis = progressBar.xAxes.push(new am4charts.ValueAxis());
  valueAxis.renderer.grid.template.disabled = false;
  valueAxis.fill = am4core.color("#E5E5E3");
  valueAxis.min = -30;
  valueAxis.max = 30;
  valueAxis.strictMinMax = true;
  valueAxis.renderer.labels.template.disabled = true;


  //https://www.amcharts.com/docs/v4/concepts/axes/axis-ranges/#Ranges_as_guides
  // rangearea and range as guideline
  /**
  var rangebereich = valueAxis.axisRanges.create();
  rangebereich.value = -100;
  rangebereich.endValue = 100;
  rangebereich.axisFill.fill = am4core.color("#396478");
  rangebereich.axisFill.fillOpacity = 0.2;
  rangebereich.grid.stroke = am4core.color("red");
  rangebereich.grid.strokeWidth = 15;
  rangebereich.grid.strokeOpacity = 1;
  */

/**
  // positive end
  var rangelinie = valueAxis.axisRanges.create();
  rangelinie.value = 30;
  rangelinie.grid.stroke = am4core.color("#E5E5E3");
  rangelinie.grid.strokeWidth = 3;
  rangelinie.grid.strokeOpacity = 1;
  // negative end
  var rangelinie2 = valueAxis.axisRanges.create();
  rangelinie2.value = -30;
  rangelinie2.grid.stroke = am4core.color("#E5E5E3");
  rangelinie2.grid.strokeWidth = 3;
  rangelinie2.grid.strokeOpacity = 1;
*/  
  // zero line
  valueAxis.renderer.baseGrid.disabled = false;
  valueAxis.renderer.baseGrid.stroke = am4core.color("#E5E5E3");
  valueAxis.renderer.baseGrid.strokeWidth = 5;
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

createRange(valueAxis, -100, 100, am4core.color("yellow"));
//createRange(valueAxis, 0, 100, am4core.color("grey"));
//createRange(valueAxis, 100, 200, am4core.color("black"));

/**
// Background or MaxColumn hence "backbar"
var backbar = progressBar.series.push(new am4charts.ColumnSeries());
backbar.dataFields.valueX = "backbar";
backbar.dataFields.categoryY = "category";
backbar.columns.template.height = am4core.percent(100);
backbar.columns.template.fill = am4core.color("#cecece");
backbar.columns.template.stroke = am4core.color("#949494");
backbar.columns.template.strokeWidth = 1;
backbar.columns.template.column.cornerRadiusBottomRight = 4;
backbar.columns.template.column.cornerRadiusTopRight = 4;
backbar.noRisers = true;
backbar.clustered = false;
backbar.stacked = true;
backbar.tooltipText = "{valueX}";
*/
/* Create series */
var series = progressBar.series.push(new am4charts.ColumnSeries());
series.dataFields.valueX = "value";
series.dataFields.categoryY = "category";
series.columns.template.height = am4core.percent(70);
series.columns.template.fill = am4core.color("blue");
series.columns.template.strokeOpacity = 0;
series.columns.template.column.cornerRadiusBottomRight = 1;
series.columns.template.column.cornerRadiusTopRight = 1;
series.columns.template.column.cornerRadiusBottomLeft = 1;
series.columns.template.column.cornerRadiusTopLeft = 1;
series.tooltipText = "{valueX}";

series.columns.template.adapter.add("fill", function(fill, target) {
  if (target.dataItem.valueX > 0) {
    return am4core.color("green");
  }
  else {
    return fill;
  }
});

// Cursor and Tooltip
progressBar.cursor = new am4charts.XYCursor()
progressBar.cursor.lineX.disabled = true;
progressBar.cursor.lineY.disabled = true;
valueAxis.cursorTooltipEnabled = true;
}










var card = document.createElement('div'),
    bulletdiv = document.createElement('div'),
    txt1 = document.createElement('div'),
    txt4 = document.createElement('div'),
    txt2 = document.createElement('div');
bulletdiv.id = "bulletdiv";
bulletdiv.style.height='30px';

card.style.background = "#c0c0c0";
card.style.color = "#000";
card.style.position = "absolute";
card.style.bottom = "200px";
card.style.right = "200px";
//card.style.height = "30px";
card.setAttribute("id", "rangeselect");
card.classList.add('card');
card.classList.add('container');
createProgressBar(bulletdiv, "Distribution", 25, 75);

txt1.innerHTML = "<div class=KPIName color= '#A41466';>" + subKPIName + "</div><hr>"
txt2.innerHTML = "<div class=KPIName color= '#A41466';>" + subKPIValue + "</div>"
txt4.innerHTML = "<div class=KPITxt><br>" + devToMain + " im Vergleich zu "+subKPIName +"</div>";

card.appendChild(txt1);
card.appendChild(bulletdiv);
card.appendChild(txt2);
card.appendChild(txt4);

//this.domNode.appendChild(container);
chartdiv.appendChild(card);