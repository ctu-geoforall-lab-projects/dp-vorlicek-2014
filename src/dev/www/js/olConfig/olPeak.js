/* 
 * Description of peak layer and its functions
 * * @author: Chrudoš Vorlíček <chrudos.vorlicek@gmail.com>
 */

function createPeak() {
	var peakWFS = new OpenLayers.Layer.Vector("Vrcholy", {
		projection: new OpenLayers.Projection("EPSG:900913"),
		strategies: [new OpenLayers.Strategy.BBOX()],
		protocol: new OpenLayers.Protocol.WFS({
			version: "1.1.0",
			url: "http://" + host + ":8080/geoserver/" + workspace + "/wfs",
			featurePrefix: workspace,
			featureType: 'peak',
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
	return peakWFS;
}

function onPeakSelect(evt) {
	feature = evt.feature;
	var text = "";

	var name = feature.attributes.name;
	var alt_name = feature.attributes.alt_name;
	var name_cs = feature.attributes.name_cs;
	var name_de = feature.attributes.name_de;
	var name_pl = feature.attributes.name_pl;
	var name_sk = feature.attributes.name_sk;
	var vrcholovka = feature.attributes.summit_register;

	if (name != null)
		text += "<h4>" + name + "</h4>";
	if (feature.attributes.ele != null)
		text += "Nadmořská výška: " + feature.attributes.ele + " m.n.m<br>";
	if (alt_name != null)
		text += "Jiná jména: " + alt_name + "<br>";
	if (name_cs != null)
		text += "České jméno: " + name_cs + "<br>";
	if (name_de != null)
		text += "Německé jméno: " + name_de + "<br>";
	if (name_pl != null)
		text += "Polské jméno: " + name_pl + "<br>";
	if (name_sk != null)
		text += "Slovenské jméno: " + name_sk + "<br>";
	if (feature.attributes.description != null)
		text += "Popis: " + feature.attributes.description + "<br>";
	if (feature.attributes.difficulty != null)
		text += "Oblížnost: " + feature.attributes.difficulty + "<br>";
	switch (vrcholovka) {
		case "yes":
			text += "Je zde vrcholová knížka.<br>";
			break;
		case "no":
			text += "Není zde vrcholová knížka.<br>";
			break;
		default:
	}
	if( name == null && feature.attributes.ele == null && alt_name == null && name_cs == null && name_de == null && name_pl == null && name_sk == null && feature.attributes.description == null && feature.attributes.difficulty == null & vrcholovka == null)
		text += "Nejsou dostupné žádné informace.";



	popup = new OpenLayers.Popup.FramedCloud("featurePopup",
			feature.geometry.getBounds().getCenterLonLat(),
			new OpenLayers.Size(100, 100), text, null, true, onPopupClose);
	feature.popup = popup;
	popup.feature = feature;
	map.addPopup(popup, true);
}


