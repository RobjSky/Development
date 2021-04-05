// https://lw.microstrategy.com/msdz/MSDL/GARelease_Current/docs/projects/VisSDK/Content/topics/HTML5/Adding_Mstr_features.htm#Use_the_visualization_as_a_selector
(function () {
    if (!mstrmojo.plugins.GoogleTimeline) {
        mstrmojo.plugins.GoogleTimeline = {};
    }


    mstrmojo.requiresCls(
        "mstrmojo.CustomVisBase",
        "mstrmojo.models.template.DataInterface"
    );

    mstrmojo.plugins.GoogleTimeline.GTL_PROPERTIES = {
        HIDE_ROW_LABELS: 'hideRowLabels',
        HIDE_BAR_LABELS: 'hideBarLabels',
        BAR_LABEL_FONT: 'barLabelFont',
        ROW_LABEL_FONT: 'rowLabelFont'
    };

    mstrmojo.plugins.GoogleTimeline.GoogleTimeline = mstrmojo.declare(
        mstrmojo.CustomVisBase,
        null,
        {
            scriptClass: "mstrmojo.plugins.GoogleTimeline.GoogleTimeline",
            cssClass: "googletimeline",
            errorMessage: "Either there is not enough data to display the visualization or the visualization configuration is incomplete.",
            errorDetails: "This visualization requires one or more attributes and one metric.",
            externalLibraries: [{url: "//www.google.com/jsapi"}],
            useRichTooltip: false,
            reuseDOMNode: false,
            supportNEE: true, // indicate the widget supports PDF exporting by New Export Engine


            getHideRowLabelsOption: function getHideRowLabelsOption() {
                var GTL_PROPERTIES = mstrmojo.plugins.GoogleTimeline.GTL_PROPERTIES,
                    hideRowLabels = this.getProperty(GTL_PROPERTIES.HIDE_ROW_LABELS);
                return hideRowLabels;

            },
            getHideBarLabelsOption: function getHideBarLabelsOption() {
                var GTL_PROPERTIES = mstrmojo.plugins.GoogleTimeline.GTL_PROPERTIES,
                    hideBarLabels = this.getProperty(GTL_PROPERTIES.HIDE_BAR_LABELS);
                return hideBarLabels;

            },
            getBarLabelFontStyle: function getBarLabelFontStyle() {
                var GTL_PROPERTIES = mstrmojo.plugins.GoogleTimeline.GTL_PROPERTIES,
                    getFontStyle = this.getProperty(GTL_PROPERTIES.BAR_LABEL_FONT);
                return getFontStyle;
            },
            getRowLabelFontStyle: function getRowLabelFontStyle() {
                var GTL_PROPERTIES = mstrmojo.plugins.GoogleTimeline.GTL_PROPERTIES,
                    getFontStyle = this.getProperty(GTL_PROPERTIES.ROW_LABEL_FONT);
                return getFontStyle;
            },


            plot: function () {

                //TODO PLACE CODE HERE To add "use as a filter" item in the right click menu of the visualization.
                this.addUseAsFilterMenuItem();


                var me = this;
                var domNode = this.domNode,
                    width = this.width-50,
                    height = this.height-10,
                    dp = this.dataInterface;

                //this.domNode.style.overflow = "auto";

                var is10Point2 = true;

                if (typeof this.addThresholdMenuItem == 'function') {
                    is10Point2 = false;

                }

                if (!google.visualization || !google.visualization.Timeline) {
                    google.load('visualization', '1.1', {
                        "callback": drawChart,
                        packages: ["timeline"]
                    });
                } else {
                    drawChart();
                }

                if (!is10Point2) {
                    me.setDefaultPropertyValues({
                        barLabelFont: {
                            fontSize: '10pt',
                            fontFamily: 'Arial',
                            fontColor: '#000'
                        },
                        rowLabelFont: {
                            fontSize: '10pt',
                            fontFamily: 'Arial',
                            fontColor: '#000'
                        },
                        hideRowLabels: 'false',
                        hideBarLabels: 'false'

                    });
                }

                function drawChart() {
                    var orgDataTree = me.dataInterface.getRawData(mstrmojo.models.template.DataInterface.ENUM_RAW_DATA_FORMAT.TREE);
                    var orgData = me.dataInterface.getRawData(mstrmojo.models.template.DataInterface.ENUM_RAW_DATA_FORMAT.ROWS_ADV, {
                        hasSelection: true
                    });
                    //TODO Object used for the "use as a filter" functionality
                    var selectorData = [];



                    var chart = new google.visualization.Timeline(me.domNode);

                    var dataTable = new google.visualization.DataTable();
                    dataTable.addColumn({
                        type: 'string',
                        id: 'Position'
                    });
                    dataTable.addColumn({
                        type: 'string',
                        id: 'Name'
                    });
                    dataTable.addColumn({
                        type: 'date',
                        id: 'Start'
                    });
                    dataTable.addColumn({
                        type: 'date',
                        id: 'End'
                    });


                    for (i = 0; i < orgData.length; i++) {

                        var categoryName = orgData[i].headers[0].name;
                        var name = orgData[i].headers[1].name;
                        var beginDate = orgData[i].headers[2].name;
                        var endDate = orgData[i].headers[3].name;

                        //TODO Build the selectorData to make the employee elements "used as a filter" 
                        selectorData.push(orgData[i].headers[1].attributeSelector);

                        var bdParse = Date.parse(beginDate);
                        var edParse = Date.parse(endDate);
                        var bd = typeof(bdParse) === "number" ? new Date(bdParse) : bdParse;
                        var ed = typeof(edParse) === "number" ? new Date(edParse) : edParse;

                        dataTable.addRows([
                            [categoryName, name, bd, ed]
                        ]);

                    }
                    var options = {
                        timeline: {
                            showRowLabels: false,
                            showBarLabels: true,
                            rowLabelStyle: {fontName: '', fontSize: 14, color: ''},
                            barLabelStyle: {fontName: '', fontSize: 14}
                        },
                        avoidOverlappingGridLines: false,
                        tooltip: {isHTML: true},
                        chartArea: {
                                // leave room for y-axis labels
                                width: '94%'
                            },
                        legend: {
                            position: 'top'
                        },
                        width: width

                    };

                    if (!is10Point2) {
                        //check the hide row label option
                        if (me.getHideRowLabelsOption() === 'true') {
                            options.timeline.showRowLabels = false;
                        } else {
                            options.timeline.showRowLabels = true;
                        }
                        //check the hide bar label option
                        if (me.getHideBarLabelsOption() === 'true') {
                            options.timeline.showBarLabels = false;
                        } else {
                            options.timeline.showBarLabels = true;
                        }

                        var barLabelStyle = me.getBarLabelFontStyle();
                        var rowLabelStyle = me.getRowLabelFontStyle();
                        //update bar label style
                        if (barLabelStyle) {

                            if (barLabelStyle.fontSize) {
                                var fontSize = barLabelStyle.fontSize;

                                var len = fontSize.length;
                                var newSize = fontSize.substr(0, len - 2);
                                options.timeline.barLabelStyle.fontSize = newSize;
                            }
                            if (barLabelStyle.fontFamily) {
                                options.timeline.barLabelStyle.fontName = barLabelStyle.fontFamily;
                            }
                        }
                        //update row label style
                        if (rowLabelStyle) {
                            if (rowLabelStyle.fontColor) {
                                options.timeline.rowLabelStyle.color = rowLabelStyle.fontColor;
                            }
                            if (rowLabelStyle.fontSize) {
                                var fontSize = rowLabelStyle.fontSize;

                                var len = fontSize.length;
                                var newSize = fontSize.substr(0, len - 2);
                                options.timeline.rowLabelStyle.fontSize = newSize;
                            }
                            if (rowLabelStyle.fontFamily) {
                                options.timeline.rowLabelStyle.fontName = rowLabelStyle.fontFamily;
                            }
                        }
                    }

                    chart.draw(dataTable, options);


                    //TODO PLACE CODE To add an event to apply the filtering capability when an element is selected and the visualization is used
                    google.visualization.events.addListener(chart, 'select', function () {
                        var selection = chart.getSelection();
                        //ensure selection isn't empty
                        if (selection.length) {
                            alert("Row: " + selection[0].row + " // Length: " + selection.length + " // inpout: " + JSON.stringify(selectorData[selection[0].row]));
                            var attributeSelector = selectorData[selection[0].row];
                            me.applySelection(attributeSelector);
                            alert("Waiting: ");
                            //me.applySelection(chart.draw(dataTable, options));
                            me.applySelection(1);
                            drawChart();
                        }
                        else {
                            alert("2 - Length: " + selection.length);
                            //chart.setSelection([]) --infinity loop
                        }
                    });
                    //TODO clear the selections when clicking in whitespace
                    /*
                    var svg = google.visualization.Timeline(me.domNode)
                        .on("click", function () {
                            window.alert('me clicky!!');
                            if (!event.target.classList.contains('custom-vis-layout googletimeline') &&
                                !event.target.parentNode.classList.contains('custom-vis-layout googletimeline')) {
                                chart.setSelection();
                                me.clearSelections();
                                me.endSelections();
                                var collapsed = chart.getCollapsedNodes();
                                for (var i = 0; i < collapsed; i++) {
                                    chart.collapse(collapsed[i], false);
                                }
                            }
                        });
                    */
                }
            }
        })
}());
//@ sourceURL=GoogleTimeline.js