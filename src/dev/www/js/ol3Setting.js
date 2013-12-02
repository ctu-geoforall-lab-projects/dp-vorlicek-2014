/* 
 * @author: Chrudoš Vorlíček
 * @email: <chrudos.vorlicek@gmail.com>
 */

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

//var transform = ol.proj.getTransform('EPSG:900913', 'EPSG:900913s');

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

    // transform the coordinates from the map projection (EPSG:3857)
    // into the server projection (EPSG:4326)
    var startCoord = startPoint.getPosition();
    var finalCoord = finalPoint.getPosition();
    var viewparams = [
      'x1:' + startCoord[0], 'y1:' + startCoord[1],
      'x2:' + finalCoord[0], 'y2:' + finalCoord[1]
    ];
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
