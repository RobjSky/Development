// TODO poster als infobox.background info.background =
chart2.layout = me.getProperty("positionInfobox");
                    if (me.getProperty("positionInfobox") == "horizontal") {
                        //InfoBox to the right
                        /*  [...]  */




// TODO poster als infobox.background info.background = 
// Section: Update Image --> watermark.href = imgPrefix + imgName + imgSuffix;
//watermark.align = "center";
//watermark.valign = "middle";
//watermark.opacity = 0.3;
//watermark.marginRight = 10;
//watermark.marginBottom = 5;
info.hideOverflow = true;
info.padding(0, 0, 0, 0);

var watermark = info.createChild(am4core.Image);
window.alert(info.height);
window.alert(info.innerWidth);
window.alert(info.innerHeight);
watermark.x = 0;
watermark.y = 0;
watermark.href = "https://alternativemovieposters.com/wp-content/uploads/2020/09/BATMAN-1989-30x30-1.jpg";
watermark.width = am4core.percent(100);
//watermark.width = info.innerWidth;
//watermark.height = 400;
watermark.height = info.innerHeight;
watermark.isMeasured = false;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


                        title.truncate = false;
                        /*  [...]  */
                        infoLabelCont.layout = "grid";

infoLabelCont.background.fill = am4core.color(me.getProperty("InfoboxFillColor").fillColor);
infoLabelCont.background.fillOpacity = me.getProperty("InfoboxFillColor").fillAlpha * 0.01;