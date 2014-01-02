/* 
 * Description of accommodation layer and its functions
 * * @author: Chrudoš Vorlíček <chrudos.vorlicek@gmail.com>
 */

function createAccommodation() {
	var accommodationWFS = new OpenLayers.Layer.Vector("Informace", {
		projection: new OpenLayers.Projection("EPSG:900913"),
		strategies: [new OpenLayers.Strategy.BBOX()],
		protocol: new OpenLayers.Protocol.WFS({
			version: "1.1.0",
			url: "http://" + host + ":8080/geoserver/" + workspace + "/wfs",
			featurePrefix: workspace,
			featureType: 'accommodation',
			geometryName: 'way',
			srsName: "EPSG:900913"
		}),
		minScale: 0.000018, //scale 1:54k
		styleMap: new OpenLayers.StyleMap({
			"default": style
		}),
		renderers: renderer,
		displayInLayerSwitcher: true
	});
	return accommodationWFS;
}

function onAccommodationSelect(evt) {
	feature = evt.feature;
	var text = "";

	var name = feature.attributes.name;
	var type;
		switch (feature.attributes.tourism) {
			case "camping_site":type = "kemp";break;
			case "caravan_site":type = "autokemp";break;
			case "chalet":type = "chata";	break;
			case "guest_house":	type = "penzion";break;
			case "hotel":type = "hotel";	break;
			case "hostel": type = "hostel";break;
			case "motel": type = "motel";break;
			case "alpine_hut":type = "horská chata";	break;
			default:
				type = "jiné";
		}

if (name != null)
	text += "<h4>" + name + "</h4>";
text += "Typ: " + type + " <br>";
popup = new OpenLayers.Popup.FramedCloud("featurePopup",
		feature.geometry.getBounds().getCenterLonLat(),
		new OpenLayers.Size(100, 100), text, null, true, onPopupClose);
feature.popup = popup;
popup.feature = feature;
map.addPopup(popup, true);
}




