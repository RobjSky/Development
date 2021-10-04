(function () {

    if (!mstrmojo.plugins.AZoomableGantt) {
        mstrmojo.plugins.AZoomableGantt = {};
    }

    mstrmojo.requiresCls(
        "mstrmojo.vi.models.CustomVisDropZones",
        "mstrmojo.array"
    );

    var ZONE_ATTRIBUTES = 'Start Time (dd.mm.yyyy hh:MM:ss)',
        ZONE_METRIC = 'Metrics',
        ZONE_ANNOTATION = 'End Time (dd.mm.yyyy hh:MM:ss)',
        ZONE_ANNOTATION2 = 'Category Attribute (Y-Axis)',
        ZONE_ANNOTATION3 = 'Task Attribute';


    mstrmojo.plugins.AZoomableGantt.AZoomableGanttDropZones = mstrmojo.declare(
        //Declare that this code extends CustomVisDropzones
        mstrmojo.vi.models.CustomVisDropZones,
        null, {
            // Define the JavaScript class that renders your visualization drop zones.
            scriptClass: 'mstrmojo.plugins.AZoomableGantt.AZoomableGanttDropZones',
            getCustomDropZones: function getCustomDropZones() {
                var ENUM_ALLOW_DROP_TYPE = mstrmojo.vi.models.CustomVisDropZones.ENUM_ALLOW_DROP_TYPE;
                // Fill the zones� definition here.
                return [{
                    name: ZONE_ATTRIBUTES,
                    title: mstrmojo.desc(13828, 'Drag start time attribute here'),
                    maxCapacity: 1,
                    allowObjectType: ENUM_ALLOW_DROP_TYPE.ATTRIBUTE
                }, {
                    name: ZONE_ANNOTATION,
                    title: mstrmojo.desc(13828, 'Drag end time attribute here'),
                    maxCapacity: 1,
                    allowObjectType: ENUM_ALLOW_DROP_TYPE.ATTRIBUTE
                }, {
                    name: ZONE_ANNOTATION2,
                    title: mstrmojo.desc(13828, 'Drag category here (Y-Axis)'),
                    maxCapacity: 1,
                    allowObjectType: ENUM_ALLOW_DROP_TYPE.ATTRIBUTE
                }, {
                    name: ZONE_ANNOTATION3,
                    title: mstrmojo.desc(13828, 'Drag Task here'),
                    maxCapacity: 10,
                    allowObjectType: ENUM_ALLOW_DROP_TYPE.ATTRIBUTE
                }, {
                    name: ZONE_METRIC,
                    title: mstrmojo.desc(13827, 'Drag metrics here'),
                    maxCapacity: 20,
                    allowObjectType: ENUM_ALLOW_DROP_TYPE.METRIC
                }];
            },
            shouldAllowObjectsInDropZone: function shouldAllowObjectsInDropZone(zone, dragObjects, idx, edge, context) {
                var me = this;
                return {
                    allowedItems: mstrmojo.array.filter(dragObjects, function (object) {
                        return true;
                    })
                };
            }
        }
    );

}());