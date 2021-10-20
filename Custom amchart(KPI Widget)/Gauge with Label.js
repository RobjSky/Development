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

// Themes begin
am4core.useTheme(am4themes_animated);
// Themes end

// create chart
var chart = am4core.create("chartdiv", am4charts.GaugeChart);
chart.hiddenState.properties.opacity = 0; // this makes initial fade in effect

chart.startAngle = 0;
chart.endAngle = 360;

function createAxis(min, max, start, end, color) {
    var axis = chart.xAxes.push(new am4charts.ValueAxis());
    axis.min = min;
    axis.max = max;
    axis.strictMinMax = true;
    axis.renderer.useChartAngles = false;
    axis.renderer.startAngle = start;
    axis.renderer.endAngle = end;
    axis.renderer.minGridDistance = 100;

    axis.renderer.line.strokeOpacity = 1;
    axis.renderer.line.strokeWidth = 10;
    axis.renderer.line.stroke = am4core.color(color);

    axis.renderer.ticks.template.disabled = false;
    axis.renderer.ticks.template.stroke = am4core.color(color);
    axis.renderer.ticks.template.strokeOpacity = 1;
    axis.renderer.grid.template.disabled = true;
    axis.renderer.ticks.template.length = 10;

    return axis;
}

// Set up labels
var label1 = chart.seriesContainer.createChild(am4core.Label);
label1.text = "hello";
label1.horizontalCenter = "middle";
label1.fontSize = 55;
label1.fontWeight = 600;
label1.dy = -30;




function createHand(axis) {
    var hand = chart.hands.push(new am4charts.ClockHand());
    hand.fill = axis.renderer.line.stroke;
    hand.stroke = axis.renderer.line.stroke;
    hand.axis = axis;
    hand.pin.disabled = true;
    hand.startWidth = 10;
    hand.endWidth = 0;
    hand.radius = am4core.percent(90);
    hand.innerRadius = am4core.percent(70);
    hand.value = 0;
    return hand;
}

var axis1 = createAxis(0, 100, -175, -5, "#00FF00");

var hand1 = createHand(axis1);

setInterval(function () {
    hand1.showValue(Math.random() * hand1.axis.max, 1000, am4core.ease.cubicOut);
}, 2000);