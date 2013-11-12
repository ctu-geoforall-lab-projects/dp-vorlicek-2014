var map = L.map('map').setView([49.82, 15.5], 8);
//OSM
L.control.mousePosition({
	position:"topright",
	emptystring: " ",
	separator: " "
}).addTo(map);
L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	attribution: 'Map data &copy; OpenStreetMap contributors',
	minZoom: 8,
}).addTo(map);
var hikingRoutes = new L.TileLayer.WMS("http://localhost:8080/geoserver/diplomka/wms", {
	layers: "diplomka:hiking_routes",
	format: 'image/png',
	transparent: true
});
map.addLayer(hikingRoutes);
//WMS kempy
/*var camps = new L.TileLayer.WMS("http://localhost:8080/geoserver/diplomka/wms",{
 layers: "diplomka:kempy",
 format: "image/png",
 transparent: true
 });
 map.addLayer(camps);*/


function onEachFeature(feature, layer)
{
	var popupContent = "<p>Jméno kempu:" + feature.properties.jmeno + "</p>";
	if (feature.properties && feature.properties.popupContent) {
		popupContent += feature.properties.popupContent;
	}
	layer.bindPopup(popupContent);
}

//proj4.defs("EPSG::900913","+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +no_defs");
var geoJsonObject = {"type": "FeatureCollection", 
	"features": [{
			"type": "Feature",
			"id": "kempy.1",
			"geometry": {
				"type": "Point",
				"coordinates": [1609060.3151736946, 6546026.836375744]
			},
			"geometry_name": "the_geom",
			"properties": {
				"Id": 0,
				"jmeno": "DannÃ¡Ã¨"
			}},
		{
			"type": "Feature",
			"id": "kempy.2",
			"geometry": {
				"type": "Point",
				"coordinates": [1608609.5988316021, 6550449.731582014]
			},
			"geometry_name": "the_geom",
			"properties": {
				"Id": 0,
				"jmeno": "Jezevec"}}],
		 "crs": {"type": "EPSG", "properties": {"code": "900913"}}};

var campsJSON = new L.GeoJSON(geoJsonObject, {
	onEachFeature: onEachFeature,
	pointToLayer: function(feature,latlng){
		return L.circleMarker(latlng, {
			radius: 8,
			fillColor: "#ff7800",
			color: "#000",
			weight: 1,
			opacity: 1,
			fillOpacity: 0.8
		});
	}
});

//L.TileLayer.GeoJSON
/*
 var style = {
 "clickable": true,
 "color": rgb(0, 0, 0),
 "fillColor": rgb(255, 0, 0),
 "weight": 1.0,
 "fillOpacity": 0.2
 };
 var hoverStyle = {
 "fillOpacity": 0.5
 };
 
 var jsonUrl = "http://localhost:8080/geoserver/diplomka/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=diplomka:kempy&maxFeatures=50&outputFormat=json";
 var geoJsonTileLayer = new L.TileLayer.GeoJSON(jsonUrl, {
 clipTiles: true,
 unique: function(feature) {
 return feature.id;
 },
 style: style,
 onEachFeature: function(feature, layer) {
 if (feature.properties) {
 var popupString = '<div class="popup">';
 for (var k in feature.properties) {
 popupString += "<p>Jméno kempu:" + feature.properties.jmeno + "</p>";
 }
 popupString += '</div>';
 layer.bindPopup(popupString);
 }
 if (!(layer instanceof L.Point)) {
 layer.on('mouseover', function() {
 layer.setStyle(hoverStyle);
 });
 layer.on('mouseout', function() {
 layer.setStyle(style);
 });
 }
 
 }
 });
 map.addLayer(geoJsonTileLayer);*/
//L.GeoJSON

function loadGeoJson(data) {
	campsJSON.addGeoJson(data);
}
var jsonUrl = "http://localhost:8080/geoserver/diplomka/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=diplomka:kempy&maxFeatures=50&outputFormat=json&format_options=callback:loadGeoJson";

$.ajax({
	url: jsonUrl,
	dataType: 'jsonp'
});
campsJSON.addTo(map);

var osmGeocoder = new L.Control.OSMGeocoder();
osmGeocoder.setPosition('topleft');
map.addControl(osmGeocoder);


L.control.scale({
	imperial: "false",
	metric: "true"
}).addTo(map);




map.locate({setView: true, watch: false})
		.on('locationfound', function(e) {
			var marker = L.marker([e.latitude, e.longitude]).bindPopup('Jste pravděpodobně zde');
			var circle = L.circle([e.latitude, e.longitude], e.accuracy / 2, {
				weight: 1,
				color: 'blue',
				fillColor: '#cacaca',
				fillOpacity: 0.2
			});
			map.addLayer(marker);
			map.addLayer(circle);
		});
/* //ČÚZK
 L.tileLayer.wms('http://geoportal.cuzk.cz/WMS_ZM25_PUB/WMService.aspx', {
 layers: 'GR_ZM25,GT_TEXT_ZM25',
 format: 'image/png',
 transparent: true,
 minZoom: 10,
 maxZoom: 17,
 attribution: '<a href="http://cuzk.cz">ČÚZK</a>'
 }).addTo(map);//*/
