// NOTE prepareData()
// https://lw.microstrategy.com/msdz/MSDL/GARelease_Current/_GARelease_Archives/103/docs/projects/VisSDK_All/Default.htm#topics/HTML5/Data_Interface_API.htm
function prepareData() {
    // Create a new array (datapool) and push the objects datarecords to the new array. each datarecord is one single object in the array.
    // additional a check on "how many attributes?" and "how many metrics are being used?" must be performed to derive the FOR-Indicators
    // additional a check is needed to format the datetime attribute from MSTR to a datetime attibute in JS.
    // datapool = {"cols" : [mtr1.Name, mtr2.Name],
    //             "attrs" : [attr1.Name, attr2.Name],
    //             "rows" : [{ "attr.Name" : attr.Value1,
    //                         "mtr1.Name" : mtr1.Value1,
    //                         "mtr2.Name" : mtr2.Value1 }, {"attr.Name" : attr.Value2, ...}, {...}], 
    var datapool = {};


    // if date then (Input dd.mm.yy)
    let attrlength = dp.getRowHeaders(0).getHeader(0).getName().length;
    let digitscount;
    // count only digits (\d)
    try {
        digitscount = String(dp.getRowHeaders(0).getHeader(0).getName()).match(/\d/g).length;
        //window.alert("Number of digits found: " + digitscount);
    } catch (err) {
        digitscount = 0;
        //window.alert('Number of digits found: ' + digitscount + ' Error: ' + err.message);
    };

    switch (attrlength - digitscount) {
        //Date: if attribute has length - digitcount = 2 then we assume a date
        case 2:
            AttrIsDate = "date";
            AttrCount = 1;
            break;
            //Datetime: if attribute has length(19) - digitcount(14) = 5 then we assume a datetime
        case 5:
            AttrIsDate = "datetime";
            AttrCount = 1;
            break;
        default:
            AttrIsDate = "false";
            AttrCount = 0;
    }

    datapool.attrs = [];
    // Attributes.Names: set attribute names ["attributename1","attributename2"]
    for (var z = 0; z < dp.getRowTitles().size(); z++) {
        datapool.attrs[z] = dp.getRowTitles(0).getTitle(z).getName();
    }
    datapool.cols = [];
    // Metric.Names: set metric column names ["metricname1","metricname2"]
    for (var z = 0; z < dp.getColumnHeaderCount(); z++) {
        datapool.cols[z] = dp.getColHeaders(0).getHeader(z).getName();
    }


    //set rows data
    var rows = [];
    //window.alert('new be4 c.date: ' + JSON.stringify(dp.getRowHeaders(0).getHeader(0).getName()));
    //go thru all rows
    for (i = 0; i < dp.getTotalRows(); i++) {
        var c = {}
        // Attribute.Values: get date from data. date needs to be in the form of dd.mm.yy
        c.date = dp.getRowHeaders(i).getHeader(0).getName();

        switch (AttrIsDate) {
            case "date":
                if (c.date.indexOf('.') > -1) {
                    var parts = c.date.split('.');
                    if (parts[2].length == 2) {
                        parts[2] = '20' + parts[2];
                    }
                    // convert to Datetime-Format yyyy-mm-ddThh:mm:ss.000Z
                    c.date = new Date(parts[2], parts[1] - 1, parts[0]);
                } else if (c.date.indexOf('/') > -1) {
                    var parts = c.date.split('/');
                    if (parts[2].length == 2) {
                        parts[2] = '20' + parts[2];
                    }
                    // Note: JavaScript counts months from 0 to 11. January is 0. December is 11.
                    // convert to Datetime-Format yyyy-mm-ddThh:mm:ss.000Z
                    c.date = new Date(parts[2], parts[0] - 1, parts[1]);
                }
                seriesToolTipFormat = "{dateX.formatDate('dd.MM.yyyy ')}: {name}: [bold]{valueY}[/]";
                break;

            case "datetime":
                var parts = c.date.split(' ');
                //var dparts = parts[0].split('.');
                var dparts = parts[0].split(/\.|\//); //split by dot(.) or forwardslash(/)
                var tparts = parts[1].split(':');
                c.date = new Date('20' + dparts[2], dparts[1] - 1, dparts[0], tparts[0], tparts[1], tparts[2]);
                seriesToolTipFormat = "{dateX.formatDate('dd.MM.yyyy HH:mm')}: {name}: [bold]{valueY}[/]";
                if (i < 2) {
                    window.alert('DAteTIme with found.')
                    window.alert('dparts2(Y): ' + dparts[2] + ' //*// dparts0(M): ' + dparts[0] + ' //*// dparts1-1(D): ' + (dparts[1] - 1) + ' //*// dparts1: ' + dparts[1])
                }
                break;
            default:
                //window.alert('default: Doesn´t look like a date to me. Maybe try again. Good Luck.');
                break;
        };

        c.attributes = [];
        // Attribute.Values: get the attribute values. Z=AttrCount so the first iteration is skipped IF the first attribute is a date and therefore it should be in c.date
        for (var z = AttrCount; z < dp.getRowTitles().size(); z++) {
            c[dp.getRowTitles(0).getTitle(z).getName()] = dp.getRowHeaders(i).getHeader(z).getName()
            //c['attri' + dp.getRowTitles(0).getTitle(z).getName()] = dp.getRowHeaders(i).getHeader(z).getName()
        }

        c.values = [];
        // Metric.Values: get the metric values.
        for (var z = 0; z < dp.getColumnHeaderCount(); z++) {
            c['values' + z] = dp.getMetricValue(i, z).getRawValue()
        }
        // push c to current position in rows-Array. Meaning c.date and c.values, resulting in {"date" : "yyyy-mm-ddThh:mm:ss.000Z" , "values" : 123 , "values0" : 456}
        rows[i] = c;
    };
    //window.alert('new after c.date: ' + JSON.stringify(rows[0]));
    datapool.rows = rows;

    //window.alert("Number of attri and metrics: " + datapool.attrs.length + " and " + datapool.cols.length);

    // TODO

    // NOTE Break-By
    // if there is more than one attribute and only one metric in the dataset, transpose the attribute so different series can be generated and the metric can be displayed against the attribute values
    if (datapool.attrs.length > 1 && datapool.cols.length < 2) {
        datapool.transMetricNames = [];
        //set rows data
        var transposedRows = [];
        var source = datapool.rows;
        var dates = {};
        var data = [];
        //go thru all rows
        for (i = 0; i < dp.getTotalRows(); i++) {
            var row = source[i];
            if (dates[row.date] == undefined) {
                dates[row.date] = {
                    date: row.date
                };
                data.push(dates[row.date]);
            }

            var breakByName = datapool.attrs[1];
            var value = 'values0'; //datapool.cols[0];
            dates[row.date][source[i][breakByName]] = row[value];
            //dates[row.date][source[i].device] = row.value;
            // push the new metric name to a new object, check if metric name for the transposed values already exists, if not push
            if (datapool.transMetricNames.indexOf(row[datapool.attrs[1]]) == -1) {
                datapool.transMetricNames.push(row[datapool.attrs[1]]);
            };
        }
        datapool.transposedRows = data;
        //var Say1 = 'DataPool: \n datapool.cols: ' + JSON.stringify(datapool.cols) + '\n datapool.attrs: ' + JSON.stringify(datapool.attrs) +'\n datapool.transMetricNames: ' + JSON.stringify(datapool.transMetricNames);
        //var Say2 = "datapool.transposedRows:";
        //var myWindow2 = PopUp(Say1, Say2, datapool.transposedRows);
    }


    //------------------ POPUP for Debugging INPUT ------------------//
    //var Say1 = 'DataPool: \n datapool.cols: ' + JSON.stringify(datapool.cols) + '\n datapool.attrs: ' + JSON.stringify(datapool.attrs);
    //var Say2 = "datapool.rows:";
    //var myWindow2 = PopUp(Say1, Say2, datapool.rows);

    return datapool;
};

//------------------ POPUP for Debugging INPUT ------------------//
// var Say1 = 'metricColors: <br>' + JSON.stringify(metricColors)
//   + ' <br> metricColors[0]: <br>' + JSON.stringify(metricColors[0]);
// var Say2 = 'me.getProperty("lineColor0"): <br>' + JSON.stringify(me.getProperty("lineColor0"))
// var myWindow2 = PopUp(Say1, Say2);

// NOTE POPUP() for Debugging ------------------//
function PopUp(Say1, Say2, displaydata) {
    var myWindow = window.open("", "", "width=600,height=500");

    myWindow.document.write("<h1>Debugger Output:</h1>");

    var p1 = document.createElement("P")
    p1.style.color = "black";
    p1.innerText = Say1;
    myWindow.document.body.appendChild(p1)
    var p2 = document.createElement("P")
    p2.style.color = "blue";
    p2.innerText = Say2;
    myWindow.document.body.appendChild(p2)

    tableFromJson(displaydata);

    //NOTE tableFromJson() --------------------------------//
    function tableFromJson(Json2Table) {
        // Extract value from table header. 
        var col = [];
        for (var i = 0; i < Json2Table.length; i++) {
            for (var key in Json2Table[i]) {
                if (col.indexOf(key) === -1) {
                    col.push(key);
                }
            }
        }

        // Create a table.
        var table = document.createElement("table");
        table.style.border = "solid 1px #ddd";
        table.style.padding = "2px 3px";
        table.style.borderCollapse = "collapse";

        // Create table header row using the extracted headers above.
        var tr = table.insertRow(-1); // table row.

        for (var i = 0; i < col.length; i++) {
            var th = document.createElement("th"); // table header.
            th.style.border = "solid 1px #fc1616";
            th.style.padding = "2px 3px";
            th.style.borderCollapse = "collapse";
            th.innerHTML = col[i];
            tr.appendChild(th);
        }

        // add json data to the table as rows.
        for (var i = 0; i < Json2Table.length; i++) {

            tr = table.insertRow(-1);

            for (var j = 0; j < col.length; j++) {
                var tabCell = tr.insertCell(-1);
                tabCell.style.border = "solid 1px #12ba28";
                tabCell.innerHTML = Json2Table[i][col[j]];
            }
        }
        // Now, add the newly created table with json data, to a container.
        myWindow.document.body.appendChild(table);
    }
}