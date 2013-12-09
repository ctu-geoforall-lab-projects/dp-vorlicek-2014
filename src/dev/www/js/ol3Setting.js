/* 
 * @author: Chrudoš Vorlíček
 * @email: <chrudos.vorlicek@gmail.com>
 */

var host, workspace;
//environment setting

if (window.location.hostname === 'toulavej.loc') {
	host = 'toulavej.loc';
	workspace = "diplomka";
}
else if (window.location.hostname === 'geo102.fsv.cvut.cz') {
	host = 'geo102.fsv.cvut.cz';
	workspace = "vorlichr";
}

var map = new ol.Map({
	target: "map",
	layers: [
		new ol.layer.Tile({
			source: new ol.source.MapQuestOSM()
		})
	],
	projection: "EPSG:900913",
	renderer: ol.RendererHint.CANVAS,
	view: new ol.View2D({
		center: [1725452.10706, 6415161.17028],
		zoom: 8
	})
});
//popup
var popupElement = document.getElementById('popup');
var popup = new ol.Overlay({
	element: popupElement,
	positioning: ol.OverlayPositioning.BOTTOM_CENTER,
	stopEvent: false
});
map.addOverlay(popup);

//Kempy WFS
var kempyJSON = new ol.layer.Vector({
	source: new ol.source.Vector({
		url: "proxy.cgi?url='http://" + host + ":8080/geoserver/" + workspace + "/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + workspace + ":kempy&outputFormat=json'"
	})
});
map.addLayer(kempyJSON);

var tracksWMS = new ol.layer.Tile({
	source: new ol.source.TileWMS({
		url: "http://" + host + ":8080/geoserver/" + workspace + "/wfs",
		params: {
			'LAYERS': workspace + ':tourist_tracks',
			'FORMAT': 'image/png'
		}
	})
});
map.addLayer(tracksWMS);
/*
 var tracksWFS = new ol.layer.Vector({
 source: new ol.source.Vector({
 parser: new ol.parser.GeoJSON(),
 url: "http://" + host + ":8080/geoserver/" + workspace + "/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + workspace + ":tourist_tracks&outputFormat=json"
 }),
 style: new ol.style.Style({
 symbolizers: [
 new ol.style.Stroke({
 width: 2
 })
 ]
 }),
 transformFeatureInfo: function(features) {
 return features.length > 0 ?
 features[0].getId() + ': ' + features[0].get('name') : '&nbsp;';
 }
 });
 map.addLayer(tracksWFS);
 
 map.on('singleclick', function(evt) {
 map.getFeatureInfo({
 pixel: evt.getPixel(),
 success: function(featureInfoByLayer) {
 document.getElementById('info').innerHTML = featureInfoByLayer.join('');
 }
 });
 });
 
 map.on('singleclick', function(evt) {
 map.getFeatures({
 pixel: evt.getPixel(),
 layers: [vector],
 success: function(layerFeatures) {
 var feature = layerFeatures[0][0];
 if (feature) {
 var geometry = feature.getGeometry();
 var coord = geometry.getCoordinates();
 popup.setPosition(coord);
 $(popupElement).popover({
 'placement': 'top',
 'html': true,
 'content': feature.get('jmeno')
 });
 $(popupElement).popover('show');
 } else {
 $(element).popover('destroy');
 }
 }
 });
 });
 */



//pgrouting stuff - not working
/*
 var startPoint = new ol.Overlay({
 map: map,
 element: document.getElementById('start-point')
 });
 var finalPoint = new ol.Overlay({
 map: map,
 element: document.getElementById('final-point')
 });
 
 var params = {
 LAYERS: 'diplomka:routing',
 FORMAT: 'image/png'
 };
 
 map.on('click', function(event) {
 var coordinate = event.getCoordinate();
 if (startPoint.getPosition() === undefined) {
 // first click
 alert('první klik');
 startPoint.setPosition(coordinate);
 } else if (finalPoint.getPosition() === undefined) {
 // second click
 alert('druhý klik');
 finalPoint.setPosition(coordinate);
 
 var startCoord = startPoint.getPosition();
 var finalCoord = finalPoint.getPosition();
 var viewparams = [
 'x1:' + startCoord[0], 'y1:' + startCoord[1],
 'x2:' + finalCoord[0], 'y2:' + finalCoord[1]
 ];
 alert(viewparams);
 params.viewparams = viewparams.join(';');
 // we now have the two points, create the result layer and add it to the map
 var result = new ol.layer.Image({
 source: new ol.source.ImageWMS({
 url: 'http://localhost:8080/geoserver/diplomka/wms',
 params: params
 })
 });
 map.addLayer(result);
 }
 });
 */