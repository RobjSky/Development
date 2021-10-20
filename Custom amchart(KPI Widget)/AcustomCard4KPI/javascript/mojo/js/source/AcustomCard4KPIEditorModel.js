(function () {
    // Define this code as a plugin in the mstrmojo object
    if (!mstrmojo.plugins.AcustomCard4KPI) {
        mstrmojo.plugins.AcustomCard4KPI = {};
    }
    // Import the necessary library
    mstrmojo.requiresCls(
        "mstrmojo.vi.models.editors.CustomVisEditorModel"
    );
    //variable that represent the enum of all the widget type
    var $WT = mstrmojo.vi.models.editors.CustomVisEditorModel.WIDGET_TYPE;

    mstrmojo.plugins.AcustomCard4KPI.AcustomCard4KPIEditorModel = mstrmojo.declare(
        mstrmojo.vi.models.editors.CustomVisEditorModel,
        null,
        {
            // Define the JavaScript class that renders your visualization properties
            scriptClass: 'mstrmojo.plugins.AcustomCard4KPI.AcustomCard4KPIEditorModel',
            getCustomProperty: function getCustomProperty() {
                var myViz = this.getHost();

                //var numOfMetrics = myViz.zonesModel.getDropZones().zones[2].items.length;
                var allowHtmlFlag;
                var totalsFlag, lineFlag;
                // Fill the property data here

                return [
                        {
                            name: "Custom Category Name",
                            value: [
                                {
                                    style: $WT.EDITORGROUP,
                                    items: [{
                                            style: $WT.CHECKBOXANDLABEL,
                                            propertyName: "showPic",
                                            labelText: "showPic",
                                        }, {
                                            style: $WT.CHECKBOXANDLABEL,
                                            propertyName: "showMainKPI",
                                            labelText: "showMainKPI",
                                        }, {
                                            style: $WT.CHECKBOXANDLABEL,
                                            propertyName: "showProgressbar",
                                            labelText: "showProgressbar",
                                        }, {
                                            style: $WT.CHECKBOXANDLABEL,
                                            propertyName: "showVariationOnly",
                                            labelText: "showVariationOnly",
                                        }, {
                                            style: $WT.TWOCOLUMN,
                                            items: [{
                                                    style: $WT.LABEL,
                                                    width: "40%",
                                                    labelText: "Viz Name:"
                                                }, {
                                                    style: $WT.TEXTBOX,
                                                    width: "60%",
                                                    propertyName: 'vizName'
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
            }]}
        }
    );
}());