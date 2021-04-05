(function () {
	if (!mstrmojo.plugins.ApexBarChart) {
		mstrmojo.plugins.ApexBarChart = {};
	}

	mstrmojo.requiresCls(
		"mstrmojo.vi.models.editors.CustomVisEditorModel",
		"mstrmojo.array"
	);
	
	var $WT = mstrmojo.vi.models.editors.CustomVisEditorModel.WIDGET_TYPE,
		APLC_PROPERTIES = mstrmojo.plugins.ApexBarChart.APLC_PROPERTIES;

	mstrmojo.plugins.ApexBarChart.ApexBarChartEditorModel = mstrmojo.declare(
		mstrmojo.vi.models.editors.CustomVisEditorModel,
		null, {
			scriptClass: "mstrmojo.plugins.ApexBarChart.ApexBarChartEditorModel",
			cssClass: "ApexBarCharteditormodel",
			getCustomProperty: function getCustomProperty() {

				var myViz = this.getHost();
				var labelsize;
				return [{
					name: 'Apex Editor',
					value: [{
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
												myViz.refresh();
											}
										},
									}],
								
										style: $WT.TWOCOLUMN,
										items: [{
											style: $WT.LABEL,
											name: "text",
											width: "40%",
											labelText: "Stroke Width:"
										}, {
											style: $WT.STEPPER,
											width: "60%",
											propertyName: "nodeWidth",
											min: 1,
											max: 10,
											config: {
												suppressData: true,
												clientUndoRedoCallback: function () {},
												callback: function () {
													myViz.refresh();
												}
											},
										}]
									},
									{
										style: $WT.CHECKBOXANDLABEL,
										value: false,
										propertyName: "showLabel",
										labelText: "show data label",
										config: {
											suppressData: true,
											clientUndoRedoCallback: function () {},
											callback: function () {
												myViz.refresh();
											}
										},
									},
									{
										style: $WT.LABEL,
										labelText: "position for legend:"
									},
									{
										style: $WT.BUTTONBAR,
										propertyName: "legendPosition",
										items: [
											{	labelText: "Top",
												propertyName: "t"
											},
											{	labelText: "Left",
												propertyName: "l"
											},
											{
												labelText: "Right",
												propertyName: "r"
											},
											{	labelText: "Bottom",
												propertyName: "b"
											},
											
										],
										config: {
											suppressData: true,
											clientUndoRedoCallback: function () {},
											callback: function () {
												myViz.refresh();
											}
										},
										multiSelect: false
									}, {
										style: $WT.LABEL,
										labelText: "Linie oder Area:"
									}, {
										style: $WT.BUTTONBAR,
										propertyName: "chartType",
										items: [{
												labelText: "Column",
												propertyName: "column"
											},
											{
												labelText: "Bar",
												propertyName: "bar"
											}
										],
										config: {
											suppressData: true,
											clientUndoRedoCallback: function () {},
											callback: function () {
												myViz.refresh();
											}
										},
										multiSelect: false
									},
									{
										style: $WT.FILLGROUP,
										propertyName: "labelFillColor",
										config: {
											suppressData: true,
											clientUndoRedoCallback: function () {},
											callback: function () {
												myViz.refresh();
											}
										}
									}

								]
							}]
				}];
			}
		})
}());