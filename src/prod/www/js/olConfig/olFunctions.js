/* 
 * Functions used in olDeafault.js File
 * @author: Chrudoš Vorlíček <chrudos.vorlicek@gmail.com>
 */


function mapEdit() {
	center = map.getCenter();
	center.transform(new OpenLayers.Projection("EPSG:900913"), new OpenLayers.Projection("EPSG:4326"));
	zoom = map.getZoom();
	window.location.href = "edit-map#background=Bing&map=16/" + String(center['lon']).substring(0, 7) + "/" + String(center['lat']).substring(0, 7);
}


function addTrack() {
	center = map.getCenter();
	zoom = map.getZoom();
	window.location.href = "../track/add-track?zoom=" + zoom + "&lat=" + center['lat'] + "&lon=" + center['lon'];
}

function addPhoto() {
	center = map.getCenter();
	zoom = map.getZoom();
	window.location.href = "../track/add-photo?zoom=" + zoom + "&lat=" + center['lat'] + "&lon=" + center['lon'];
}

function fbShare()
{
	center = map.getCenter();
	zoom = map.getZoom();
	var url = 'http://' + location.host + location.pathname + "?zoom=" + zoom + "&lat=" + center['lat'] + "&lon=" + center['lon'];
	window.open(
			'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url),
			'facebook-share-dialog',
			'width=626,height=436');
	return false;
}
