/* 
 * Description of KempyWFS layer and its functions
 * * @author: Chrudoš Vorlíček <chrudos.vorlicek@gmail.com>
 */

function createKempyWFS(){
	var kempyWFS = new OpenLayers.Layer.Vector("Kempy - WFS", {
			projection: new OpenLayers.Projection("EPSG:900913"),
			strategies: [new OpenLayers.Strategy.BBOX()],
			protocol: new OpenLayers.Protocol.WFS({
				version: "1.1.0",
				url: "http://" + host + ":8080/geoserver/" + workspace + "/wfs",
				featurePrefix: workspace,
				featureType: 'kempy',
				geometryName: 'the_geom',
				srsName: "EPSG:900913"
			}),
			renderers: renderer,
			displayInLayerSwitcher:true
		});
		return kempyWFS;
}

function onFeatureSelect(evt) {
	feature = evt.feature;
	popup = new OpenLayers.Popup.FramedCloud("featurePopup",
			feature.geometry.getBounds().getCenterLonLat(),
			new OpenLayers.Size(100, 100),
			"<h4>" + feature.attributes.jmeno + "</h4>",
			null, true, onPopupClose);
	feature.popup = popup;
	popup.feature = feature;
	map.addPopup(popup, true);
}


