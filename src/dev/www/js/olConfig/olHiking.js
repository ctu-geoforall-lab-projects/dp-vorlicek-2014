/* 
 * Description of hiking layers and theirs functions
 * * @author: Chrudoš Vorlíček <chrudos.vorlicek@gmail.com>
 */

function createHiking() {
	//WFS layer description
	var hikingWFS = new OpenLayers.Layer.Vector("Stezky - WFS", {
		projection: new OpenLayers.Projection("EPSG:900913"),
		strategies: [new OpenLayers.Strategy.BBOX()],
		protocol: new OpenLayers.Protocol.WFS({
			version: "1.1.0",
			url: "http://" + host + ":8080/geoserver/" + workspace + "/wfs",
			featurePrefix: workspace,
			featureType: 'tourist_tracks',
			geometryName: 'way',
			srsName: "EPSG:900913"
		}),
		minScale: 0.000004,
		displayInLayerSwitcher: false,
		styleMap: new OpenLayers.StyleMap({
			"default": style,
			"select": new OpenLayers.Style({
				strokeWidth: 5})
		}),
		renderers: renderer
	});
	//WMS layer description
	var hikingWMS = new OpenLayers.Layer.WMS("Stezky - WMS", "http://" + host + ":8080/geoserver/" + workspace + "/wms",	{
		layers: workspace + ":tourist_tracks",
		format: "image/png",
		isBaseLayer: false,
		transparent: true,
		tiled: true,
		tilesOrigin: map.maxExtent.left + ',' + map.maxExtent.bottom
	},
	{
		displayInLayerSwitcher: false,
		maxScale: 0.000004
	});
	return [hikingWFS, hikingWMS];
}

//popup event
function onRouteSelect(evt) {
	feature = evt.feature;
	var length = parseFloat(Math.round(feature.geometry.getLength()) / 1000).toFixed(2);
	var color;
	if (feature.attributes.kct_color !== null) {
		switch (feature.attributes.kct_color) {
			case "kct_blue":
				color = "Modrá";
				break;
			case "kct_green":
				color = "Zelená";
				break;
			case "kct_red":
				color = "Červená";
				break;
			case "kct_yellow":
				color = "Žlutá";
				break;
			default:
				color = " ";
		}
	} else {
		color = " ";
	}
	var name = feature.attributes.kct_name;
	var destinations = feature.attributes.kct_destinations;
	var text = "";
	if (name != null) {
		text += "<h4>" + name + "</h4>";
	}
	if (destinations != null) {
		text += "Cíle: " + destinations + "<br>";
	}
	text += "Značka: " + color + "<br>";
	text += "Délka: " + length + " km <br>";
	popup = new OpenLayers.Popup.FramedCloud("featurePopup",
			feature.geometry.getBounds().getCenterLonLat(),
			new OpenLayers.Size(100, 100), text, null, true, onPopupClose);
	feature.popup = popup;
	popup.feature = feature;
	map.addPopup(popup, true);
}


