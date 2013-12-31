/* 
 * Description of spring layer and its functions
 * * @author: Chrudoš Vorlíček <chrudos.vorlicek@gmail.com>
 */

function createSpring() {
	var springWFS = new OpenLayers.Layer.Vector("Prameny", {
		projection: new OpenLayers.Projection("EPSG:900913"),
		strategies: [new OpenLayers.Strategy.BBOX()],
		protocol: new OpenLayers.Protocol.WFS({
			version: "1.1.0",
			url: "http://" + host + ":8080/geoserver/" + workspace + "/wfs",
			featurePrefix: workspace,
			featureType: 'spring',
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
	return springWFS;
}

function onSpringSelect(evt) {
	feature = evt.feature;
	var text = "";

	var name = feature.attributes.name;
	var mineral = feature.attributes.name;
	var drinking_water = feature.attributes.drinking_water;
	var drinkable = feature.attributes.drinkable;

	if (name != null)
		text += "<h4>" + name + "</h4>";
	if (drinkable === "yes" || drinking_water === "yes")
		text += "- voda je pitná.<br>";
	else if (drinkable === "no" || drinking_water === "no")
		text += "- voda není pitná.<br>";
	if(mineral === "yes" || drinkable === "mineral")
		text += "- minerální voda<br>";
	if(mineral == null && name == null && drinkable == null && drinking_water == null)
		text += "Nejsou uvedeny žádné informace.";


	popup = new OpenLayers.Popup.FramedCloud("featurePopup",
			feature.geometry.getBounds().getCenterLonLat(),
			new OpenLayers.Size(100, 100), text, null, true, onPopupClose);
	feature.popup = popup;
	popup.feature = feature;
	map.addPopup(popup, true);
}


