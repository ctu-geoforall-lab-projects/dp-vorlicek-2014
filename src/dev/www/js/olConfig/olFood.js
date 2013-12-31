/* 
 * Description of foodWFS layer and its functions
 * * @author: Chrudoš Vorlíček <chrudos.vorlicek@gmail.com>
 */

function createFood() {
	var foodWFS = new OpenLayers.Layer.Vector("Občerstvení", {
		projection: new OpenLayers.Projection("EPSG:900913"),
		strategies: [new OpenLayers.Strategy.BBOX()],
		protocol: new OpenLayers.Protocol.WFS({
			version: "1.1.0",
			url: "http://" + host + ":8080/geoserver/" + workspace + "/wfs",
			featurePrefix: workspace,
			featureType: 'food',
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
	return foodWFS;
}

function onFoodSelect(evt) {
	feature = evt.feature;
	var text ="";
	
	var name = feature.attributes.name;
	var type;
	switch(feature.attributes.amenity){
		case "pub":
			type = "hospoda";
			break;
		case "restaurant":
			type = "restaurace";
			break;
		case "fast_food":
			type = "stánek/fastfood";
			break;
		case "cafe":
			type = "kavárna/čajovna";
			break;
		case "biergarten":
			type = "zahrádka";
			break;
		case "bar":
			type = "bar";
			break;
		default:
			type = "občerstvení";
	}
	if(name != null)
		text += "<h4>" + name + "</h4>";
	text += "Typ: " + type +" <br>";
	if(feature.attributes.tags != null)
		text += "Tagy: " + feature.attributes.tags;
	
	popup = new OpenLayers.Popup.FramedCloud("featurePopup",
			feature.geometry.getBounds().getCenterLonLat(),
			new OpenLayers.Size(100, 100), text, null, true, onPopupClose);
	feature.popup = popup;
	popup.feature = feature;
	map.addPopup(popup, true);
}


