/* 
 * Description of photo layers and its functions
 * * @author: Chrudoš Vorlíček <chrudos.vorlicek@gmail.com>
 */
function createPhoto() {
	var photoWFS = new OpenLayers.Layer.Vector("Fotografie", {
		projection: new OpenLayers.Projection("EPSG:900913"),
		strategies: [new OpenLayers.Strategy.BBOX()],
		protocol: new OpenLayers.Protocol.WFS({
			version: "1.1.0",
			url: "http://" + host + ":8080/geoserver/" + workspace + "/wfs",
			featurePrefix: workspace,
			featureType: 'images',
			geometryName: 'the_geom',
			srsName: "EPSG:900913"
		}),
		styleMap:new OpenLayers.StyleMap({
			"default": style
		}),
		renderers: renderer
	});
	return photoWFS;
}

//for layer religionWFS
function onPhotoSelect(evt) {
	feature = evt.feature;
	
	var name = feature.attributes.name;
	var note = feature.attributes.note;
	var filename = feature.attributes.filename;
	
	var text = "";
	text += "<h4>" + name + "</h4>";
	if (note != "") {
		text += "poznámka: " + note + "<br>";
	}
	text += "<img src='../../files/"+ filename +"' alt='"+name+"' width='400' />";
	popup = new OpenLayers.Popup.FramedCloud("featurePopup",
			feature.geometry.getBounds().getCenterLonLat(),
			new OpenLayers.Size(null, 400), text, null, true, onPopupClose);
	feature.popup = popup;
	popup.feature = feature;
	map.addPopup(popup, true);
}
