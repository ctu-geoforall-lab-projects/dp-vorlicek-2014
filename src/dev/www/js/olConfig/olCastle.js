/* 
 * Description of castle/ruins layer and its functions
 * * @author: Chrudoš Vorlíček <chrudos.vorlicek@gmail.com>
 */

function createCastle() {
	var castleWFS = new OpenLayers.Layer.Vector("Hrady, zříceniny", {
		projection: new OpenLayers.Projection("EPSG:900913"),
		strategies: [new OpenLayers.Strategy.BBOX()],
		protocol: new OpenLayers.Protocol.WFS({
			version: "1.1.0",
			url: "http://" + host + ":8080/geoserver/" + workspace + "/wfs",
			featurePrefix: workspace,
			featureType: 'castle',
			geometryName: 'way',
			srsName: "EPSG:900913"
		}),
		minScale: 0.000018,
		styleMap: new OpenLayers.StyleMap({
			"default": style
		}),
		renderers: renderer,
		displayInLayerSwitcher: true
	});
	return castleWFS;
}

function onCastleSelect(evt) {
	feature = evt.feature;
	var text = "";

	var name = feature.attributes.name;
	var type;
	switch (feature.attributes.historic) {
		case "castle":
			type = "hrad/zámek";
			break;
		case "ruins":
			type = "zřícenina";
			break;
		default:
			type = "neuvedeno";
	}
	if (name != null)
		text += "<h4>" + name + "</h4>";
	text += "Typ: " + type + " <br>";
	if (feature.attributes.castle_type != null)
		text += "Typ dle tagu: " + feature.attributes.castle_type;
	if (feature.attributes.description != null)
		text += "Popis: " + feature.attributes.description + "<br>";
	if (feature.attributes.ele != null)
		text += "Nadmořská výška: " + feature.attributes.ele + " m.n.m<br>";

	popup = new OpenLayers.Popup.FramedCloud("featurePopup",
			feature.geometry.getBounds().getCenterLonLat(),
			new OpenLayers.Size(100, 100), text, null, true, onPopupClose);
	feature.popup = popup;
	popup.feature = feature;
	map.addPopup(popup, true);
}


