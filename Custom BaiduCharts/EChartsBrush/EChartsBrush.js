(function () {
    // Define this code as a plugin in the mstrmojo object
    if (!mstrmojo.plugins.EChartsBrush) {
        mstrmojo.plugins.EChartsBrush = {};
    }
    // Custom mojo visualizations require the CustomVisBase library to render
    mstrmojo.requiresCls("mstrmojo.CustomVisBase");

    mstrmojo.plugins.EChartsBrush.ECB_PROPERTIES = {
        LABEL_FONT: 'labelFont',
        NODE_WIDTH: 'nodeWidth',
        SHOW_LABEL: 'showLabel',
        LEGEND_POSITION: 'legendPosition',
        CHART_TYPE: 'chartType',
        COLORS_1: 'labelFillColor'
    };

     /**
      * A visualization that integrates Microstrategy data with Google Charts code
      * @extends mstrmojo.CustomVisBase
      */
    // Declare the visualization object
    mstrmojo.plugins.EChartsBrush.EChartsBrush = mstrmojo.declare(
        // Declare that this code extends CustomVisBase
        mstrmojo.CustomVisBase,
        null, {
            // Define the Javascript class that renders your visualization as mstrmojo.plugins.{plugin name}.{js file name}
            scriptClass: 'mstrmojo.plugins.EChartsBrush.EChartsBrush',
            // Define the CSS class that will be appended to container div
            cssClass: "EChartsBrush",
	        // Define the error message to be displayed if JavaScript errors prevent data from being displayed
            errorDetails: "This visualization requires one attributes of type DateTime (Format: yyyy-mm-dd hh:mm:ss) and one metric.",
	        // Define the external libraries to be used - in this sample. the Baidu ECharts library
            externalLibraries: [
                {url: (mstrApp.getPluginsRoot && mstrApp.getPluginsRoot() || "../plugins/")+"EChartsBrush/javascript/mojo/js/source/echarts-en.min.js"}
            ],
            // Define whether a tooltip should be displayed with additional information
            useRichTooltip: true,
            // Define whether the DOM should be reused on data/layout change or reconstructed from scratch
            reuseDOMNode: false,

            // ANCHOR CUSTOM PROPERTIES
            getNodeWidth: function getNodeWidth() {
                var ECB_PROPERTIES = mstrmojo.plugins.EChartsBrush.ECB_PROPERTIES,
                    getNodeWidth = this.getProperty(ECB_PROPERTIES.NODE_WIDTH);
                return getNodeWidth;
            },
            getLegendPosition: function getLegendPosition() {
                var ECB_PROPERTIES = mstrmojo.plugins.EChartsBrush.ECB_PROPERTIES,
                    getLegendPosition = this.getProperty(ECB_PROPERTIES.LEGEND_POSITION);
                if (getLegendPosition.l === "true") {
                    var legendPosition = 'left'
                } else if (getLegendPosition.r === "true") {
                    var legendPosition = 'right'
                } else if (getLegendPosition.b === "true") {
                    var legendPosition = 'bottom'
                } else {
                    var legendPosition = 'top'
                }
                return legendPosition;
            },
            getChartType: function getChartType() {
                var ECB_PROPERTIES = mstrmojo.plugins.EChartsBrush.ECB_PROPERTIES,
                    getChartType = this.getProperty(ECB_PROPERTIES.CHART_TYPE);
                if (getChartType.bar === "true") {
                    var charttype = true
                } else {
                    var charttype = false
                }
                return charttype;
            },
            getShowLabel: function getShowLabel() {
                var ECB_PROPERTIES = mstrmojo.plugins.EChartsBrush.ECB_PROPERTIES,
                    getShowLabel = this.getProperty(ECB_PROPERTIES.SHOW_LABEL);
                if (getShowLabel === "true") {
                    var boolShowLabel = true
                } else {
                    var boolShowLabel = false
                }
                //return getShowLabel;
                return boolShowLabel;
            },
            getColors: function getColors() {
                var ECB_PROPERTIES = mstrmojo.plugins.EChartsBrush.ECB_PROPERTIES,
                    getColors = this.getProperty(ECB_PROPERTIES.COLORS_1);
                return getColors;
            },
            
            plot: function () {
                var chart = echarts.init(this.domNode);
                var di = this.dataInterface;
                var me = this;
                var attributeNames = getAttributeNames(di);
                var metricNames = getMetricNames(di);
                // Set the default values for adjustable properties
                this.setDefaultPropertyValues({
                    showLabel: false
                });
                //window.alert('xaxis category data: ' + getAttributeValues(di, attributeNames[0]));
                // read from format panel
                //var nodeWidth = me.getNodeWidth();
                //var legendPosition = me.getLegendPosition();
                //var charttype = me.getChartType();
                var showLabel = me.getShowLabel();
                
                
                // Convert DateTime to Json Datetime String ('24.09.2018 20:00:00' --> '2018-09-24T00:00:00')
                var date2cat = getArrayData(di, attributeNames, metricNames);


                if (attributeNames.length == 1 && metricNames.length >= 1) {
                    var option = {
                        title: {
                              text: 'EChartsBrush 1:1' + showLabel + ' / Datensätze: ' + date2cat.length
                        },
                        grid: {
                            bottom: 80
                        },
                        tooltip: {
                            trigger: 'axis'
                        },
                        legend: {
                            data:[metricNames[0]]
                        },
                        xAxis: {
                          type: 'time',
                          data: getAttributeValues(di, attributeNames[0]),
                        },
                        yAxis: {
                            axisLine: {
                                    show: false
                                },
                                axisTick: {
                                    show: false
                                },
                                splitLine: {
                                    lineStyle: { // Dark and light colors will be used in turns
                                        color: ['#fff', '#ddd'],
                                        width: 1,
                                    },
                                }
                        },
                        toolbox: {
                            left: 'right',
                            feature: {
                                dataZoom: {
                                    yAxisIndex: 'none'
                                },
                                restore: {},
                            }
                        },
                        dataZoom: [{
                            startValue: '2014-06-01'
                        }, {
                            type: 'inside'
                        }],
                        series: [{
                            name: metricNames[0],
                            data: getArrayData(di, attributeNames, metricNames), // date2cat
                            type: 'line',
                            label: {
                              normal: {
                                  show: showLabel
                              }
                            }
                        }]
                    };
    
                    chart.setOption(option);
                } else if (attributeNames.length == 2 && metricNames.length == 1) {
                    var attr2Values = getAttributeValues(di, attributeNames[1]);

                    var option = {
                        backgroundColor: '#EEE',
                        legend: {
                            data:attr2Values,
                            align: 'left',
                            left: 10
                        },
                        toolbox: {
                            feature: {
                                magicType: {
                                    type: ['stack', 'tiled']
                                },
                            }
                        },
                        tooltip: {},
                        xAxis: {
                            type: 'category',
                            data: getAttributeValues(di, attributeNames[0]),
                            splitLine: {show: false},
                            splitArea: {show: false}
                        },
                        yAxis: {
                            splitArea: {show: false},
                            axisLine: {
                                    show: false
                                },
                                axisTick: {
                                    show: false
                                },
                                splitLine: {
                                    lineStyle: {
                                        // Dark and light colors will be used in turns
                                        color: ['#fff', '#ddd'],
                                        width: 1,
                                    },

                                }
                        },
                        visualMap: {
                            type: 'continuous',
                            dimension: 1,
                            text: ['High', 'Low'],
                            itemHeight: 200,
                            calculable: true,
                            min: 30,
                            max: 100,
                            inRange: {
                                colorLightness: [0.4, 0.8]
                            },
                            outRange: {
                                color: '#bbb'
                            },
                            controlller: {
                                inRange: {
                                    color: '#2f4554'
                                }
                            }
                        },
                        series: []
                    };

                    var restrict = {};
                    for (var i = 0; i < attr2Values.length; i++) {
                        restrict[attributeNames[1]] = attr2Values[i];
                        option.series[i] = {
                            name: attr2Values[i],
                            type: 'bar',
                            stack: i,
                            label: {
                              normal: {
                                  show: true
                              }
                            },
                            data: getArrayData(di, [attributeNames[0]], metricNames, restrict)
                        };
                    }
    
                    chart.setOption(option);
                }















                /* common functions specific for ECharts */
                function getAttributeNames(dataInterface) {
                    var result = [];
                    for (var i = 0; i < dataInterface.getRowTitles().size(); i++) {
                        result.push(dataInterface.getRowTitles().getTitle(i).getName());
                    }
                    return result;
                }

                function getMetricNames(dataInterface) {
                    var result = [];
                    for (var i = 0; i < dataInterface.getColumnHeaderCount(); i++) {
                        result.push(dataInterface.getColHeaders(0).getHeader(i).getName());
                    }
                    return result;
                }

                function getAttributeValues(dataInterface, attributeName) {
                    var result = [];
                    for (var i = 0; i < dataInterface.getRowTitles().size(); i++) {
                        if (dataInterface.getRowTitles().getTitle(i).getName() === attributeName) {
                            var checkExist = {};
                            for (var j = 0; j < dataInterface.getTotalRows(); j++) {
                                var attrValue = dataInterface.getRowHeaders(j).getHeader(i).getName();
                                if (!checkExist[attrValue]) {
                                    result.push(attrValue);
                                    checkExist[attrValue] = true;
                                }
                            }
                            break;
                        }
                    }
                    return result;
                }

                function getArrayData(dataInterface, attributes, metrics, restrict) {
                    var attrIdxMap = {};
                    var metrIdxMap = {};
                    var result = [];
                    var i, j;

                    for (i = 0; i < dataInterface.getRowTitles().size(); i++) {
                        attrIdxMap[dataInterface.getRowTitles().getTitle(i).getName()] = i;
                    }
                    for (i = 0; i < dataInterface.getColumnHeaderCount(); i++) {
                        metrIdxMap[dataInterface.getColHeaders(0).getHeader(i).getName()] = i;
                    }

                    for (i = 0; i < dataInterface.getTotalRows(); i++) {
                        var row = [];
                        var idx;

                        /* check restrict */
                        var validRow = true;
                        for (var j = 0; j < dataInterface.getRowTitles().size(); j++) {
                            var attrName = dataInterface.getRowTitles().getTitle(j).getName();
                            if (typeof restrict == "object" && typeof restrict[attrName] != "undefined" 
                                && restrict[attrName] != dataInterface.getRowHeaders(i).getHeader(j).getName()) {
                                validRow = false;
                                break;
                            }
                        }

                        if (validRow) {
                            for (j = 0; j < attributes.length; j++) {
                                idx = attrIdxMap[attributes[j]];
                                if (typeof idx != "undefined") {
                                    row.push(dataInterface.getRowHeaders(i).getHeader(idx).getName());
                                }
                            }
                            for (j = 0; j < metrics.length; j++) {
                                idx = metrIdxMap[metrics[j]];
                                if (typeof idx != "undefined") {
                                    row.push(dataInterface.getMetricValue(i, idx).getRawValue());
                                }
                            }
                            result.push(row);
                        }
                    }
                    return result;
                }
            }
        });
})();