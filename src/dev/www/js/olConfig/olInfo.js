/* 
 * Description of information layer and its functions
 * * @author: Chrudoš Vorlíček <chrudos.vorlicek@gmail.com>
 */

function createInfo() {
	var infoWFS = new OpenLayers.Layer.Vector("Informace", {
		projection: new OpenLayers.Projection("EPSG:900913"),
		strategies: [new OpenLayers.Strategy.BBOX()],
		protocol: new OpenLayers.Protocol.WFS({
			version: "1.1.0",
			url: "http://" + host + ":8080/geoserver/" + workspace + "/wfs",
			featurePrefix: workspace,
			featureType: 'info',
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
	return infoWFS;
}

function onInfoSelect(evt) {
	feature = evt.feature;
	var text = "";

	var name = feature.attributes.name;
	var type;
	if (feature.attributes.info_type != null) {
		switch (feature.attributes.info_type) {
			case "office":type = "kancelář";break;
			case "map;board":type = "mapa";break;
			case "board;map":type = "mapa";	break;
			case "map;history":	type = "mapa";break;
			case "hikingmap":type = "mapa";	break;
			case "map": type = "mapa";break;
			case "citymap": type = "mapa města";break;
			case "hikingmap;history":type = "mapa";	break;
			case "board;hikingmap":type = "mapa";	break;
			case "bicyclemap":type = "mapa";	break;
			case "board,map":type = "mapa";	break;
			case "history": type = "historické informace"; break;
			case "nature": type = "informace o přírodě";break;
			case "plants": type = "informace o přírodě";break;
			case "guidepost": type = "rozcestník";break;
			case "guidepost;board": type = "rozcestník";break;
			default:
				type = "jiné";
		}
	} else {
		type = "neuvedeno";
	}

if (name != null)
	text += "<h4>" + name + "</h4>";
text += "Typ: " + type + " <br>";
if (feature.attributes.description != null)
	text += "Popis: " + feature.attributes.description + "<br>";
if (feature.attributes.ele != null)
	text += "Nadmořská výška: " + feature.attributes.ele +" m.n.m<br>";

popup = new OpenLayers.Popup.FramedCloud("featurePopup",
		feature.geometry.getBounds().getCenterLonLat(),
		new OpenLayers.Size(100, 100), text, null, true, onPopupClose);
feature.popup = popup;
popup.feature = feature;
map.addPopup(popup, true);
}




