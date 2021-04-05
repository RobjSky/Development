(function () {
    // Define this code as a plugin in the mstrmojo object
    if (!mstrmojo.plugins.AZoomableDateTime) {
        mstrmojo.plugins.AZoomableDateTime = {};
    }
    // Import the necessary library
    mstrmojo.requiresCls(
        "mstrmojo.vi.models.editors.CustomVisEditorModel"
    );
    //variable that represent the enum of all the widget type
    var $WT = mstrmojo.vi.models.editors.CustomVisEditorModel.WIDGET_TYPE;
    /**

     */
    mstrmojo.plugins.AZoomableDateTime.AZoomableDateTimeEditorModel = mstrmojo.declare(
        mstrmojo.vi.models.editors.CustomVisEditorModel,
        null,
        {
            // Define the JavaScript class that renders your visualization properties
            scriptClass: 'mstrmojo.plugins.AZoomableDateTime.AZoomableDateTimeEditorModel',
            getCustomProperty: function getCustomProperty() {
                var myViz = this.getHost();

                var numOfMetrics = myViz.zonesModel.getDropZones().zones[2].items.length;
                var allowHtmlFlag;
                var totalsFlag, lineFlag;
                // Fill the property data here

                return [
                    {
                        name: 'amCharts Timeline',
                        value: [
                            {
                                style: $WT.EDITORGROUP,
                                items: [
                                    {
                                        style: $WT.LABEL,
                                        labelText: "amCharts Timeline"
                                    },
                                    // Legend
                                    {
                                        style: $WT.CHECKBOXANDLABEL,
                                        propertyName: "showLegend",
                                        labelText: "Show Legend"
                                    },
                                    {
                                        style: $WT.TWOCOLUMN,
                                        disabled: this.getHost().getProperty('showLegend') === "false",
                                        items: [{
                                                style: $WT.LABEL,
                                                width: "30%",
                                                labelText: "Position"
                                            },
                                            {
                                                style: $WT.PULLDOWN,
                                                width: "70%",
                                                disabled: this.getHost().getProperty('showLegend') === "false",
                                                propertyName: "positionLegend",
                                                items: [{
                                                        name: "left",
                                                        value: "left"
                                                    },
                                                    {
                                                        name: "right",
                                                        value: "right"
                                                    },
                                                    {
                                                        name: "top",
                                                        value: "top"
                                                    },
                                                    {
                                                        name: "bottom",
                                                        value: "bottom"
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                ]
                            },
                            // Options Group
                            {
                                style: $WT.EDITORGROUP,
                                items: [
                                    {
                                        style: $WT.LABEL,
                                        labelText: "Options"
                                    },
                                    {
                                        style: $WT.CHECKBOXANDLABEL,
                                        propertyName: "displayXYCursor",
                                        labelText: "Show XY-Cursor (enables Zoom)"
                                    },
                                    {
                                        style: $WT.CHECKBOXANDLABEL,
                                        propertyName: "displayXYChartScrollbar",
                                        labelText: "Show XYChartScrollbar"
                                    },
                                    {
                                        style: $WT.CHECKBOXANDLABEL,
                                        propertyName: "enableRangeSelector",
                                        labelText: "Show Selector"
                                    },
                                    {
                                        style: $WT.CHECKBOXANDLABEL,
                                        propertyName: "enableDataGrouping",
                                        labelText: "Enable Data Grouping"
                                    },
                                    {
                                        style: $WT.CHECKBOXANDLABEL,
                                        propertyName: "enableClickToDrill",
                                        labelText: "Drill on Click (X-Axis)"
                                    },
                                    {
                                        style: $WT.CHECKBOXANDLABEL,
                                        disabled: this.getHost().getProperty('displayXYCursor') === "false",
                                        propertyName: "enableWheelScroll",
                                        labelText: "Wheel Scroll"
                                    }
                                ]
                            },
                            // Customizing Fills
                            {
                                style: $WT.EDITORGROUP,
                                items: [{
                                        style: $WT.LABEL,
                                        labelText: "Customizing fills"
                                    },
                                    {
                                        style: $WT.TWOCOLUMN,
                                        disabled: this.getHost().getProperty('displayGridlines') === "false",
                                        items: [{
                                                style: $WT.CHECKBOXANDLABEL,
                                                propertyName: "displayFill",
                                                labelText: "Show Fill",
                                                width: "50%"
                                            },
                                            {
                                                style: $WT.STEPPER,
                                                disabled: this.getHost().getProperty('displayFill') === "false",
                                                propertyName: "amountFillOpacity",
                                                min: 0,
                                                max: 10,
                                                width: "50%"
                                            }
                                        ]
                                    }
                                ]
                            },
                            //Grid Lines
                            {
                                style: $WT.EDITORGROUP,
                                items: [{
                                        style: $WT.LABEL,
                                        labelText: "Grid Lines"
                                    },
                                    // {
                                    //     style: $WT.TWOCOLUMN,
                                    //     items: [{
                                    //             style: $WT.LABEL,
                                    //             width: "60%",
                                    //             labelText: "Opacity/Alpha * 0,1"
                                    //         },  
                                    //         {
                                    //            style: $WT.STEPPER,
                                    //                propertyName: "amountStrokeOpacity",
                                    //                width: "40%",
                                    //                min: 0,
                                    //                max: 100
                                    //         }
                                    //     ]
                                    // },
                                    {
                                        style: $WT.TWOCOLUMN,
                                        items: [{
                                                style: $WT.LABEL,
                                                width: "30%",
                                                labelText: "Stroke-X"
                                            },
                                            {
                                                style: $WT.FILLGROUP,
                                                width: "70%",
                                                propertyName: "amountStrokeXColor",
                                            }
                                        ]
                                    },
                                    {
                                        style: $WT.TWOCOLUMN,
                                        items: [{
                                                style: $WT.LABEL,
                                                width: "30%",
                                                labelText: "Stroke-Y"
                                            },
                                            {
                                                style: $WT.FILLGROUP,
                                                width: "70%",
                                                propertyName: "amountStrokeYColor",
                                            }
                                        ]
                                    },
                                ]
                            },
                            //Weekendhighlights
                            {
                                style: $WT.EDITORGROUP,
                                items: [{
                                        style: $WT.CHECKBOXANDLABEL,
                                            propertyName: "displayWeekendFill",
                                            labelText: "Show Weekend",
                                    },
                                    {
                                        style: $WT.TWOCOLUMN,
                                        items: [{
                                                style: $WT.LABEL,
                                                width: "30%",
                                                labelText: "Fill"
                                            },
                                            {
                                                style: $WT.FILLGROUP,
                                                width: "70%",
                                                propertyName: "weekendFillColor",
                                            }
                                        ]
                                    },
                                ]
                            },
                            //Legend Colors (Colors of Metrics and opposite Axis)
                            {
                                style: $WT.EDITORGROUP,
                                items: (function () {
                                    var x = [
                                        {
                                            style: $WT.LABEL,
                                            labelText: "Legend Colors"
                                        }];
                                    for (var i = 0; i < numOfMetrics; i++) {
                                        var color;
                                        x.push(
                                            {
                                                style: $WT.LABEL,
                                                labelText: myViz.zonesModel.getDropZones().zones[2].items[i].n
                                            },
                                            {
                                                style: $WT.FILLGROUP,
                                                propertyName: "lineColor" + i
                                            }, {
                                                style: $WT.CHECKBOXANDLABEL,
                                                propertyName: "oppositeAxis" + i,
                                                labelText: "opposite Axis"
                                            },
                                        );
                                    }
                                    return x;
                                })()
                            },
                            // minGridDistance
                            {
                                style: $WT.EDITORGROUP,
                                items: [{
                                        style: $WT.LABEL,
                                        labelText: "minGridDistance (DEV)"
                                    },
                                    {
                                        style: $WT.STEPPER,
                                        propertyName: "minGridDist",
                                        min: 0,
                                        max: 100,
                                        width: "100%"
                                    }]
                            }
                        ]
                    }
                ];
            }
        }
    );
}());