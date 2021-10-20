/**
 * --------------------------------------------------------
 * Bullet Chart for KPI Widget
 * --------------------------------------------------------
 */

am4core.useTheme(am4themes_animated);

/* Create chart instance */
var progressBar = am4core.create("chartdiv", am4charts.XYChart);
progressBar.paddingLeft = 0;

/* Add data */
progressBar.data = [{
    "category": "Distribution",
    "value": 75,
    "target": 25
}];

createProgressBar(75, 25);

function createProgressBar(category, value, target) {}

/* Create axes */
var categoryAxis = progressBar.yAxes.push(new am4charts.CategoryAxis());
categoryAxis.dataFields.category = "category";
categoryAxis.renderer.grid.template.disabled = true;
categoryAxis.renderer.labels.template.disabled = true;

var valueAxis = progressBar.xAxes.push(new am4charts.ValueAxis());
valueAxis.renderer.grid.template.disabled = true;
valueAxis.min = 0;
valueAxis.max = 100;
valueAxis.strictMinMax = true;
valueAxis.renderer.labels.template.disabled = true;


/* Create ranges */
function createRange(axis, from, to, color) {
    var range = axis.axisRanges.create();
    range.value = from;
    range.endValue = to;
    range.axisFill.fill = color;
    range.axisFill.fillOpacity = 0.8;
    range.label.disabled = true;
}

createRange(valueAxis, 0, 100, am4core.color("#19d228"));

/* Create series */
var series = progressBar.series.push(new am4charts.ColumnSeries());
series.dataFields.valueX = "value";
series.dataFields.categoryY = "category";
series.columns.template.fill = am4core.color("#000");
series.columns.template.stroke = am4core.color("#fff");
series.columns.template.column.cornerRadiusBottomRight = 5;
series.columns.template.column.cornerRadiusTopRight = 5;
series.columns.template.strokeWidth = 5;
series.columns.template.strokeOpacity = 0.5;
series.columns.template.height = am4core.percent(50);

var bullet = series.bullets.push(new am4charts.CircleBullet());
bullet.circle.radius = 16;
bullet.fill = am4core.color("red");
bullet.fillOpacity = 1;
bullet.stroke = am4core.color("red");
bullet.strokeOpacity = 0.5;
bullet.strokeWidth = 13;


// Target
var series2 = progressBar.series.push(new am4charts.StepLineSeries());
series2.dataFields.valueX = "target";
series2.dataFields.categoryY = "category";
series2.strokeWidth = 15;
series2.noRisers = true;
series2.startLocation = 0.15;
series2.endLocation = 0.85;
series2.tooltipText = "{valueX}"
series2.stroke = am4core.color("#000fff");




/**
chart.cursor = new am4charts.XYCursor()
chart.cursor.lineX.disabled = true;
chart.cursor.lineY.disabled = true;
valueAxis.cursorTooltipEnabled = false;
*/
