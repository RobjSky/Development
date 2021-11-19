(function () {
	if (!mstrmojo.plugins.ApexZoomChart) {
		mstrmojo.plugins.ApexZoomChart = {};
	}

	mstrmojo.requiresCls(
		"mstrmojo.vi.models.editors.CustomVisEditorModel",
		"mstrmojo.array"
	);

	var $WT = mstrmojo.vi.models.editors.CustomVisEditorModel.WIDGET_TYPE;

	mstrmojo.plugins.ApexZoomChart.ApexZoomChartEditorModel = mstrmojo.declare(
		mstrmojo.vi.models.editors.CustomVisEditorModel,
		null, {
			scriptClass: "mstrmojo.plugins.ApexZoomChart.ApexZoomChartEditorModel",
			cssClass: "ApexZoomCharteditormodel",
			getCustomProperty: function getCustomProperty() {

				var myViz = this.getHost();
				var labels;
				var labelsize;
				return [{
					name: 'Label Editor',
					value: [
							/*{
							style: $WT.EDITORGROUP,
							items: [{
									style: $WT.LABEL,
									labelText: "Label format"
								},
								{
									style: $WT.BUTTONBAR,
									propertyName: "labels",
									labelText: "Label format",
									items: [{
											labelText: "Text",
											propertyName: "text"
										},
										{
											labelText: "Values",
											propertyName: "values"
										}
									],
									config: {
										suppressData: true,
										clientUndoRedoCallback: function () {},
										onPropertyChange: function (propertyName, newValue) {
											if (propertyName === "labels") {
												labels = newValue;
											}
											return {};
										},
										callback: function () {
											rawD = myViz.dataInterface.getRawData(mstrmojo.models.template.DataInterface.ENUM_RAW_DATA_FORMAT.ADV);
											myViz.updateLabelFormat(rawD, labels);
										}
									},
									multiSelect: true
								}
							]
						},*/
						{
							style: $WT.EDITORGROUP,
							items: [{
								style: $WT.TWOCOLUMN,
								items: [{
										style: $WT.LABEL,
										name: "text",
										width: "40%",
										labelText: "Label Size"
									},
									{
										style: $WT.STEPPER,
										width: "60%",
										propertyName: "labelsize",
										min: 8,
										max: 32,
										config: {
											suppressData: true,
											clientUndoRedoCallback: function () {},
											onPropertyChange: function (propertyName, newValue) {
												if (propertyName === "labelsize") {
													labelsize = newValue;
												}
												return {};
											},
											callback: function () {
												myViz.updateLabelSize(labelsize);
											}
										},
									}
								]
							}]
						}
					]
				}];
			}
		})
}());