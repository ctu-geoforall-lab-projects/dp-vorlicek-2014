/* 
 * Description of religion objects layers and theirs functions
 * * @author: Chrudoš Vorlíček <chrudos.vorlicek@gmail.com>
 */
function createReligion() {
	var religionWFS = new OpenLayers.Layer.Vector("Náboženské objekty", {
		projection: new OpenLayers.Projection("EPSG:900913"),
		strategies: [new OpenLayers.Strategy.BBOX()],
		protocol: new OpenLayers.Protocol.WFS({
			version: "1.1.0",
			url: "http://" + host + ":8080/geoserver/" + workspace + "/wfs",
			featurePrefix: workspace,
			featureType: 'religion',
			geometryName: 'way',
			srsName: "EPSG:900913"
		}),
		minScale: 0.000018,
		styleMap: new OpenLayers.StyleMap({
			"default": style
		}),
		renderers: renderer
	});
	return religionWFS;
}

//for layer religionWFS
function onReligionSelect(evt) {
	feature = evt.feature;
	var type;
	var religion;
	if (feature.attributes.historic !== null) {
		switch (feature.attributes.historic) {
			case "monastery":
				type = "Klášter";
				break;
			case "wayside_cross":
				type = "Kříž u cesty";
				break;
			case "wayside_shrine":
				type = "Kaplička";
				break;
			default:
				type = null;
		}
	} else {
		type = null;
	}
	if (feature.attributes.religion !== null) {
		switch (feature.attributes.religion) {
			case "christian":
				religion = "křesťanství";
				break;
			case "jewish":
				religion = "judaismus";
				break;
			case "buddhist":
				religion = "budhismus";
				break;
			default:
				religion = "jiné";
		}
	} else {
		religion = "neurčeno";
	}

	var name = feature.attributes.name;
	var text = "";
	if (name != null) {
		text += "<h4>" + name + "</h4>";
	}
	text += "Náboženství: " + religion + "<br>";
	if (type != null) {
		text += "Objekt: " + type + "<br>";
	}
	popup = new OpenLayers.Popup.FramedCloud("featurePopup",
			feature.geometry.getBounds().getCenterLonLat(),
			new OpenLayers.Size(100, 100), text, null, true, onPopupClose);
	feature.popup = popup;
	popup.feature = feature;
	map.addPopup(popup, true);
}
