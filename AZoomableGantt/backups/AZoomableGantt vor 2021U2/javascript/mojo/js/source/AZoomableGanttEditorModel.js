(function () {
    // Define this code as a plugin in the mstrmojo object
    if (!mstrmojo.plugins.AZoomableGantt) {
        mstrmojo.plugins.AZoomableGantt = {};
    }
    // Import the necessary library
    mstrmojo.requiresCls(
        "mstrmojo.vi.models.editors.CustomVisEditorModel"
    );
    //variable that represent the enum of all the widget type
    var $WT = mstrmojo.vi.models.editors.CustomVisEditorModel.WIDGET_TYPE,
        APLC_PROPERTIES = mstrmojo.plugins.AZoomableGantt.APLC_PROPERTIES;
    /**

     */
    mstrmojo.plugins.AZoomableGantt.AZoomableGanttEditorModel = mstrmojo.declare(
        mstrmojo.vi.models.editors.CustomVisEditorModel,
        null,
        {
            // Define the JavaScript class that renders your visualization properties
            scriptClass: 'mstrmojo.plugins.AZoomableGantt.AZoomableGanttEditorModel',
            getCustomProperty: function getCustomProperty() {
                var myViz = this.getHost();

                var numOfMetrics = myViz.zonesModel.getDropZones().zones[2].items.length;
                var allowHtmlFlag;
                var totalsFlag, lineFlag;
                // Fill the property data here

                return [
                    // Tab amCharts Gantt Options
                    {
                        name: 'amCharts Gantt Options',
                        value: [
                            {
                                style: $WT.EDITORGROUP,
                                items: [
                                    {
                                        style: $WT.CHECKBOXANDLABEL,
                                        propertyName: "showToolTip",
                                        labelText: "Show Tooltip"
                                    },
                                    // Infobox
                                    {
                                        style: $WT.CHECKBOXANDLABEL,
                                        propertyName: "showInfobox",
                                        labelText: "Show Infobox"
                                    },
                                    {
                                        style: $WT.TWOCOLUMN,
                                        disabled: this.getHost().getProperty('showInfobox') === "false",
                                        items: [{
                                                style: $WT.LABEL,
                                                width: "30%",
                                                labelText: "Position"
                                            },
                                            {
                                                style: $WT.PULLDOWN,
                                                width: "70%",
                                                disabled: this.getHost().getProperty('showInfobox') === "false",
                                                propertyName: "positionInfobox",
                                                items: [{
                                                        name: "vertical",
                                                        value: "vertical"
                                                    },
                                                    {
                                                        name: "horizontal",
                                                        value: "horizontal"
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        style: $WT.TWOCOLUMN,
                                        disabled: this.getHost().getProperty('showInfobox') === "false" || this.getHost().getProperty('positionInfobox') === "vertical",
                                        items: [{
                                                style: $WT.LABEL,
                                                width: "30%",
                                                labelText: "Fill Box"
                                            },
                                            {
                                                style: $WT.FILLGROUP,
                                                width: "70%",
                                                propertyName: "InfoboxFillColor",
                                            }
                                        ]
                                    },
                                    {
                                        style: $WT.TWOCOLUMN,
                                        disabled: this.getHost().getProperty('showInfobox') === "false" || this.getHost().getProperty('positionInfobox') === "vertical",
                                        items: [{
                                                style: $WT.LABEL,
                                                width: "30%",
                                                labelText: "Stroke Box"
                                            },
                                            {
                                                style: $WT.FILLGROUP,
                                                width: "70%",
                                                propertyName: "InfoboxStrokeColor",
                                            }
                                        ]
                                    },
                                    {
                                        style: $WT.TWOCOLUMN,
                                        disabled: this.getHost().getProperty('showInfobox') === "false" || this.getHost().getProperty('positionInfobox') === "vertical",
                                        items: [{
                                                style: $WT.LABEL,
                                                width: "30%",
                                                labelText: "Fill Label"
                                            },
                                            {
                                                style: $WT.FILLGROUP,
                                                width: "70%",
                                                propertyName: "InfoboxLabelFillColor",
                                            }
                                        ]
                                    },
                                    {
                                        style: $WT.TWOCOLUMN,
                                        disabled: this.getHost().getProperty('showInfobox') === "false" || this.getHost().getProperty('positionInfobox') === "vertical",
                                        items: [{
                                                style: $WT.LABEL,
                                                width: "50%",
                                                labelText: "titlesize"
                                            },
                                            {
                                                style: $WT.STEPPER,
                                                propertyName: "infoboxTitleSize",
                                                min: 6,
                                                max: 100,
                                                width: "50%"
                                            }
                                        ]
                                    },
                                    {
                                        style: $WT.TWOCOLUMN,
                                        disabled: this.getHost().getProperty('showInfobox') === "false",
                                        items: [{
                                                style: $WT.LABEL,
                                                width: "50%",
                                                labelText: "fontsize"
                                            },
                                            {
                                                style: $WT.STEPPER,
                                                propertyName: "infoboxFontSize",
                                                min: 6,
                                                max: 100,
                                                width: "50%"
                                            }
                                        ]
                                    },
                                    {
                                        style: $WT.TWOCOLUMN,
                                        disabled: this.getHost().getProperty('showInfobox') === "false" || this.getHost().getProperty('positionInfobox') === "vertical",
                                        items: [{
                                                style: $WT.LABEL,
                                                width: "50%",
                                                labelText: "width"
                                            },
                                            {
                                                style: $WT.STEPPER,
                                                propertyName: "infoboxWidth",
                                                min: 6,
                                                max: 1000,
                                                width: "50%"
                                            }
                                        ]
                                    }
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
                                        propertyName: "displayXYChartScrollbar",
                                        labelText: "Show XYChartScrollbar"
                                    },
                                    
                                    
                                    {
                                        style: $WT.CHECKBOXANDLABEL,
                                        propertyName: "enableWheelScroll",
                                        labelText: "Wheel Scroll"
                                    },
                                    {
                                        style: $WT.TWOCOLUMN,
                                        items: [{
                                            style: $WT.LABEL,
                                            width: "40%",
                                            labelText: "Metric Form"
                                        }, {
                                            style: $WT.PULLDOWN,
                                            width: "60%",
                                            propertyName: "metricFormat",
                                            items: [{
                                                name: "default",
                                                value: "#,###.00"
                                            }, {
                                                name: "Euro",
                                                value: "'€' #,###.00"
                                            }, {
                                                name: "Dollar",
                                                value: "'$' #,###.00"
                                            }, {
                                                name: "Percentage",
                                                value: "#,###.00%"
                                            }, {
                                                name: "integer",
                                                value: "#."
                                            }, {
                                                name: "thousand delimiter",
                                                value: "#,###.##"
                                            }]
                                        }]
                                    }
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
                            // minGridDistance
                            {
                                style: $WT.EDITORGROUP,
                                items: [{
                                        style: $WT.LABEL,
                                        labelText: "minGridDistance (Y-Axis)"
                                    },
                                    {
                                        style: $WT.STEPPER,
                                        propertyName: "minGridDist",
                                        min: 0,
                                        max: 200,
                                        width: "50%"
                                    }]
                            },
                            // Image from 5th Attribute
                            
                            {
                                style: $WT.EDITORGROUP,
                                items: [{
                                        style: $WT.CHECKBOXANDLABEL,
                                        disabled: this.getHost().getProperty('showInfobox') === "false",
                                        propertyName: "displayImage",
                                        labelText: "Image from 5th Attribute"
                                    },
                                    {
                                        style: $WT.TWOCOLUMN,
                                        items: [{
                                            style: $WT.LABEL,
                                            disabled: this.getHost().getProperty('showInfobox') === "false" || this.getHost().getProperty('displayImage') === "false" || this.getHost().getProperty('positionInfobox') === "vertical",
                                            labelText: "image height",
                                            width: "50%"
                                        },
                                        {
                                            style: $WT.STEPPER,
                                            disabled: this.getHost().getProperty('showInfobox') === "false" || this.getHost().getProperty('displayImage') === "false" || this.getHost().getProperty('positionInfobox') === "vertical",
                                            propertyName: "heightImg",
                                            min: 10,
                                            max: 500,
                                            width: "50%"
                                        }]
                                    },
                                    //imgPrefix
                                    {
                                        style: $WT.TWOCOLUMN,
                                        items: [{
                                                style: $WT.LABEL,
                                                disabled: this.getHost().getProperty('showInfobox') === "false" || this.getHost().getProperty('displayImage') === "false" || this.getHost().getProperty('positionInfobox') === "vertical",
                                                width: "30%",
                                                labelText: "imgPrefix"
                                            },
                                            {
                                                style: $WT.TEXTBOX,
                                                disabled: this.getHost().getProperty('showInfobox') === "false" || this.getHost().getProperty('displayImage') === "false" || this.getHost().getProperty('positionInfobox') === "vertical",
                                                width: "70%",
                                                propertyName: "imgPrefix",
                                            }
                                        ]
                                    },
                                    //imgSuffix
                                    {
                                        style: $WT.TWOCOLUMN,
                                        items: [{
                                                style: $WT.LABEL,
                                                disabled: this.getHost().getProperty('showInfobox') === "false" || this.getHost().getProperty('displayImage') === "false" || this.getHost().getProperty('positionInfobox') === "vertical",
                                                width: "30%",
                                                labelText: "imgSuffix"
                                            },
                                            {
                                                style: $WT.TEXTBOX,
                                                disabled: this.getHost().getProperty('showInfobox') === "false" || this.getHost().getProperty('displayImage') === "false" || this.getHost().getProperty('positionInfobox') === "vertical",
                                                width: "70%",
                                                propertyName: "imgSuffix",
                                            }
                                        ]
                                    },
                                ]
                            },
                            
                        ]
                    },


















                    // Tab amCharts Timeline Format
                    {
                        name: 'amCharts Timeline Format',
                        value: [
                                //Thresholds
                                {
                                    style: $WT.EDITORGROUP,
                                    items: [{
                                            style: $WT.LABEL,
                                            labelText: "Grid Lines"
                                        },
                                        {
                                            style: $WT.CHECKBOXANDLABEL,
                                            propertyName: "showThreshold",
                                            labelText: "Show Thresholds"
                                        },
                                        {
                                            style: $WT.TWOCOLUMN,
                                            disabled: this.getHost().getProperty('showThreshold') === "false",
                                            items: [{
                                                    style: $WT.LABEL,
                                                    width: "30%",
                                                    labelText: "min"
                                                },
                                                {
                                                    style: $WT.FILLGROUP,
                                                    width: "70%",
                                                    propertyName: "minThresholdColor",
                                                }
                                            ]
                                        },
                                        {
                                            style: $WT.TWOCOLUMN,
                                            disabled: this.getHost().getProperty('showThreshold') === "false",
                                            items: [{
                                                    style: $WT.LABEL,
                                                    width: "30%",
                                                    labelText: "max"
                                                },
                                                {
                                                    style: $WT.FILLGROUP,
                                                    width: "70%",
                                                    propertyName: "maxThresholdColor",
                                                }
                                            ]
                                        }]
                                },
                                //Grid Lines
                                {
                                    style: $WT.EDITORGROUP,
                                    items: [{
                                            style: $WT.LABEL,
                                            labelText: "Grid Lines"
                                        },
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
                                        }
                                    ]
                                },
                                //axis lables
                                {
                                    style: $WT.EDITORGROUP,
                                    items: [{
                                            style: $WT.LABEL,
                                            labelText: "Axis Format"
                                        },
                                        {
                                            style: $WT.TWOCOLUMN,
                                            items: [{
                                                    style: $WT.LABEL,
                                                    width: "30%",
                                                    labelText: "font color"
                                                },
                                                {
                                                    style: $WT.FILLGROUP,
                                                    width: "70%",
                                                    propertyName: "fontColor",
                                                }
                                            ]
                                        },
                                    ]
                                },
                                //Clickable Tasks
                                {
                                    style: $WT.EDITORGROUP,
                                    items: [{
                                            style: $WT.LABEL,
                                            labelText: "Clickable Tasks"
                                        },
                                        {
                                            style: $WT.CHECKBOXANDLABEL,
                                            propertyName: "clickTask",
                                            labelText: "Clickable Tasks"
                                        },{
                                        //clickcolor
                                                style: $WT.CHECKBOXANDLABEL,
                                                disabled: this.getHost().getProperty('clickTask') === "false",
                                                propertyName: "fillTask",
                                                labelText: "fill Tasks"
                                            },{
                                            style: $WT.TWOCOLUMN,
                                            disabled: this.getHost().getProperty('clickTask') === "false",
                                            items: [{
                                                    style: $WT.LABEL,
                                                    width: "30%",
                                                    labelText: "fill color on click"
                                                },
                                                {
                                                    style: $WT.FILLGROUP,
                                                    width: "70%",
                                                    propertyName: "clickColorFill",
                                                }
                                            ]
                                        },{
                                        //strokecolor
                                            style: $WT.TWOCOLUMN,
                                            disabled: this.getHost().getProperty('clickTask') === "false",
                                            items: [{
                                                    style: $WT.LABEL,
                                                    width: "30%",
                                                    labelText: "stroke color on click"
                                                },
                                                {
                                                    style: $WT.FILLGROUP,
                                                    width: "70%",
                                                    propertyName: "clickColorStroke",
                                                }
                                            ]
                                        },{
                                        //strokeWidth
                                            style: $WT.TWOCOLUMN,
                                            disabled: this.getHost().getProperty('clickTask') === "false",
                                            items: [{
                                                    style: $WT.LABEL,
                                                    width: "30%",
                                                    labelText: "stroke width"
                                                },
                                                {
                                                    style: $WT.STEPPER,
                                                    width: "70%",
                                                    propertyName: "strokeWidth",
                                                    min: 1,
                                                    max: 10,
                                                }
                                            ]
                                        },
                                    ]
                                },
                        ]
                    }
                ];
            }
        }
    );
}());