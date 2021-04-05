/**
 * Replace
 * MojoVisualizationTemplate with your plugin folder name which should be the same as the JS file name
 * ...YOUR JS CODE... - Javascript code
 */
(function () {
    // Define this code as a plugin in the mstrmojo object
    if (!mstrmojo.plugins.MstrVisECharts) {
        mstrmojo.plugins.MstrVisECharts = {};
    }
    // Custom mojo visualizations require the CustomVisBase library to render
    mstrmojo.requiresCls("mstrmojo.CustomVisBase");
    // Declare the visualization object
    mstrmojo.plugins.MstrVisECharts.MstrVisECharts = mstrmojo.declare(
        // Declare that this code extends CustomVisBase
        mstrmojo.CustomVisBase,
        null,
        {
            // Define the Javascript class that renders your visualization as mstrmojo.plugins.{plugin name}.{js file name}
            scriptClass: 'mstrmojo.plugins.MstrVisECharts.MstrVisECharts',
            // Define the CSS class that will be appended to container div
            cssClass: "mstrvisecharts",
	        // Define the error message to be displayed if JavaScript errors prevent data from being displayed
            errorDetails: "This visualization requires one or more attributes and one metric.",
	        // Define the external libraries to be used - in this sample. the Baidu ECharts library
            externalLibraries: [
                {url: (mstrApp.getPluginsRoot && mstrApp.getPluginsRoot() || "../plugins/")+"MstrVisECharts/javascript/mojo/js/source/echarts.min.js"}
            ],
            // Define whether a tooltip should be displayed with additional information
            useRichTooltip: true,
            // Define whether the DOM should be reused on data/layout change or reconstructed from scratch
            reuseDOMNode: false,
            plot: function () {
                var chart = echarts.init(this.domNode);
                var di = this.dataInterface;
                var attributeNames = getAttributeNames(di);
                var metricNames = getMetricNames(di);
                
                if (attributeNames.length == 1 && metricNames.length >= 1) {
                    var option = {
                        title: {
                              text: 'ECharts Demo'
                          },
                          tooltip: {},
                          legend: {
                              data:[metricNames[0]]
                          },
                          xAxis: {
                            type: 'category',
                            data: getAttributeValues(di, attributeNames[0])
                          },
                          yAxis: {},
                          series: [{
                              name: metricNames[0],
                              type: 'bar',
                              label: {
                                normal: {
                                    show: true
                                }
                              },
                              data: getArrayData(di, attributeNames, metricNames)
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
                            splitArea: {show: false}
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