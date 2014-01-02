/* 
 * Description of tree layer and its functions
 * * @author: Chrudoš Vorlíček <chrudos.vorlicek@gmail.com>
 */

function createTree() {
	var treeWFS = new OpenLayers.Layer.Vector("Stromy", {
		projection: new OpenLayers.Projection("EPSG:900913"),
		strategies: [new OpenLayers.Strategy.BBOX()],
		protocol: new OpenLayers.Protocol.WFS({
			version: "1.1.0",
			url: "http://" + host + ":8080/geoserver/" + workspace + "/wfs",
			featurePrefix: workspace,
			featureType: 'tree',
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
	return treeWFS;
}

function onTreeSelect(evt) {
	feature = evt.feature;
	var text = "";

	var name = feature.attributes.name;	
	if (name != null)
		text += "<h4>" + name + "</h4>";
	if(feature.attributes.botanical_name != null)
		text += "Botanické jméno: " + feature.attributes.botanical_name + "<br>";
	if(feature.attributes.type != null){
		switch (feature.attributes.type){
			case 'conifer': text += "Strom: jehličnatý<br>"; break;
			case 'deciduous': text +="Strom: listnatý<br>";break;
			case 'broad_leaved': text+="Strom: listnatý<br>";break;
			case 'broad_leafed': text+="Strom: listnatý<br>";break;
			case 'spruce': text += "Strom: smrk <br>"; break;
			case 'Rotbuche': text += "Strom: buk <br>"; break;
			case 'Kiefer': text += "Strom: borovice <br>"; break;
			default: text += "Strom: " + feature.attributes.type + "<br>";
		}
	} else {
		if(feature.attributes.botanical_name == null && name == null)
			text += "Nejsou dostupné žádné informace.";
	}
	popup = new OpenLayers.Popup.FramedCloud("featurePopup",
			feature.geometry.getBounds().getCenterLonLat(),
			new OpenLayers.Size(100, 100), text, null, true, onPopupClose);
	feature.popup = popup;
	popup.feature = feature;
	map.addPopup(popup, true);
}


