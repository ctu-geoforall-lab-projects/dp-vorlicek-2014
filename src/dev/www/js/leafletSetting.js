
var map = L.map('map').setView([49.82, 15.5], 8);

//OSM
L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	attribution: 'Map data &copy; OpenStreetMap contributors',
	minZoom: 8,
}).addTo(map);

var osmGeocoder = new L.Control.OSMGeocoder();
map.addControl(osmGeocoder);

/*map.locate({setView: true, watch: true})
		.on('locationfound', function(e) {
			var marker = L.marker([e.latitude, e.longitude]).bindPopup('Your ass is here :)');
			var circle = L.circle([e.latitude, e.longitude], e.accuracy / 2, {
				weight: 1,
				color: 'blue',
				fillColor: '#cacaca',
				fillOpacity: 0.2
			});
			map.addLayer(marker);
			map.addLayer(circle);
		});*/


/* //ČÚZK
 L.tileLayer.wms('http://geoportal.cuzk.cz/WMS_ZM25_PUB/WMService.aspx', {
 layers: 'GR_ZM25,GT_TEXT_ZM25',
 format: 'image/png',
 transparent: true,
 minZoom: 10,
 maxZoom: 17,
 attribution: '<a href="http://cuzk.cz">ČÚZK</a>'
 }).addTo(map);//*/
