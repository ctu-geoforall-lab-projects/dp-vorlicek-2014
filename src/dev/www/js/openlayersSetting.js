var map;
var renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
renderer = (renderer) ? [renderer] : OpenLayers.Layer.Vector.prototype.renderers;

function init(params) {
	OpenLayers.ProxyHost = "/cgi-bin/proxy.cgi?url=";
	var host;
	//nastavení prostředí
	if (window.location.hostname === 'toulavej.loc')
		host = 'toulavej.loc';
	else if (window.location.hostname === 'geo102.fsv.cvut.cz')
		host = '';

	map = new OpenLayers.Map({div: 'map',
		units: "m",
		projection: "EPSG:900913",
		maxResolution: "auto"
	});
	//podkladový mapy
	var osm = new OpenLayers.Layer.OSM('OpenStreetMap');
	map.addLayer(osm);

	map.setCenter([params['lon'], params['lat']], params['zoom']);

//rules
	var blueTrack = new OpenLayers.Rule({
		filter: new OpenLayers.Filter.Comparison({
			type: OpenLayers.Filter.Comparison.EQUAL_TO,
			property: "kct_color",
			value: "kct_blue",
		}),
		symbolizer: {strokeWidth: 2,
			strokeColor: "blue"}
	});
	var greenTrack = new OpenLayers.Rule({
		filter: new OpenLayers.Filter.Comparison({
			type: OpenLayers.Filter.Comparison.EQUAL_TO,
			property: "kct_color",
			value: "kct_green",
		}),
		symbolizer: {strokeWidth: 2,
			strokeColor: "green"}
	});
	var yellowTrack = new OpenLayers.Rule({
		filter: new OpenLayers.Filter.Comparison({
			type: OpenLayers.Filter.Comparison.EQUAL_TO,
			property: "kct_color",
			value: "kct_yellow",
		}),
		symbolizer: {strokeWidth: 3,
			strokeColor: "yellow"}
	});
	var redTrack = new OpenLayers.Rule({
		filter: new OpenLayers.Filter.Comparison({
			type: OpenLayers.Filter.Comparison.EQUAL_TO,
			property: "kct_color",
			value: "kct_red",
		}),
		symbolizer: {strokeWidth: 3,
			strokeColor: "red"}
	});
	var rest = new OpenLayers.Rule({
		filter: new OpenLayers.Filter.Comparison({
			type: OpenLayers.Filter.Comparison.EQUAL_TO,
			property: "kct_color",
			value: "",
		}),
		symbolizer: {strokeWidth: 3,
			strokeColor: "black"}
	});

	var style = new OpenLayers.Style();
	style.addRules([blueTrack, greenTrack, yellowTrack, redTrack, rest]);

	//OSM DATA
	var hikingWFS = new OpenLayers.Layer.Vector("Stezky - WFS", {
		projection: new OpenLayers.Projection("EPSG:900913"),
		strategies: [new OpenLayers.Strategy.BBOX()],
		protocol: new OpenLayers.Protocol.WFS({
			version: "1.1.0",
			url: "http://" + host + ":8080/geoserver/diplomka/wfs",
			featurePrefix: 'diplomka',
			featureType: 'tourist_tracks',
			geometryName: 'way',
			srsName: "EPSG:900913"
		}),
		minScale: 0.000004,
		styleMap: new OpenLayers.StyleMap({
			"default": style,
			"select": new OpenLayers.Style({
				strokeWidth: 5})
		}),
		renderers: renderer
	});
	map.addLayer(hikingWFS);

	var hikingWMS = new OpenLayers.Layer.WMS("Stezky - WMS", "http://localhost:8080/geoserver/diplomka/wms", {
		layers: "diplomka:tourist_tracks",
		format: "image/png",
		isBaseLayer: false,
		transparent: true,
		tiled: true,
		tilesOrigin: map.maxExtent.left + ',' + map.maxExtent.bottom
	},
	{
		maxScale: 0.000004
	});
	map.addLayer(hikingWMS);

	var kempyWFS = new OpenLayers.Layer.Vector("Kempy - WFS", {
		projection: new OpenLayers.Projection("EPSG:900913"),
		strategies: [new OpenLayers.Strategy.BBOX()],
		protocol: new OpenLayers.Protocol.WFS({
			version: "1.1.0",
			url: "http://" + host + ":8080/geoserver/diplomka/wfs",
			featurePrefix: 'diplomka',
			featureType: 'kempy',
			geometryName: 'the_geom',
			srsName: "EPSG:900913"
		}),
		renderers: renderer
	});
	map.addLayer(kempyWFS);

	// Interaction; not needed for initial display.
	selectControl = new OpenLayers.Control.SelectFeature([kempyWFS, hikingWFS]);
	map.addControl(selectControl);
	selectControl.activate();
	kempyWFS.events.on({
		'featureselected': onFeatureSelect,
		'featureunselected': onFeatureUnselect
	});

	hikingWFS.events.on({
		'featureselected': onRouteSelect,
		'featureunselected': onFeatureUnselect
	});

	// Přehledka
	var options = {
		numZoomLevels: 1,
		units: "m",
		maxResolution: 'auto',
		singleTile: true,
		autopan: true,
		maximizeTitle: 'Show the overview map',
		minimizeTitle: 'Hide the overview map',
		size: new OpenLayers.Size(300, 200),
		layers: [new OpenLayers.Layer.WMS("OSM-WMS worldwide", "http://129.206.228.72/cached/osm?",
					{
						layers: 'osm_auto:all',
						transparent: false,
						exceptions: '',
						version: "1.3.0",
						format: "image/png",
						service: "WMS",
						request: "GetMap"
					},
			{
				maxExtent: new OpenLayers.Bounds(1300000, 6200000, 2150000, 6700000),
				maxResolution: 'auto',
				projection: "EPSG:900913",
				units: "m",
				singleTile: true
			})]
	};

	overview = new OpenLayers.Control.OverviewMap(options);
	overview.isSuitableOverview = function() {
		return true;
	};
	map.addControl(overview);

	//map.addControl(new OpenLayers.Control.LayerSwitcher()); //layer switcher
	map.addControl(new OpenLayers.Control.MousePosition()); //mouse position
	map.addControl(new OpenLayers.Control.ScaleLine()); //scaleLine
	map.addControl(new OpenLayers.Control.Scale()); //scale
	map.addControl(new OpenLayers.Control.KeyboardDefaults());
	map.addControl(new OpenLayers.Control.Permalink());
}

function onPopupClose(evt) {
	this.destroy();
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



function onFeatureUnselect(evt) {
	feature = evt.feature;
	if (feature.popup) {
		popup.feature = null;
		map.removePopup(feature.popup);
		feature.popup.destroy();
		feature.popup = null;
	}
}

function onRouteSelect(evt) {
	feature = evt.feature;
	var length = parseFloat(Math.round(feature.geometry.getLength()) / 1000).toFixed(2);
	var color;
	var tagy = feature.attributes.tags;
	switch (feature.attributes.kct_color) {
		case "kct_blue":
			color = "Modrá";
			break;
		case "kct_green":
			color = "Zelená";
			break;
		case "kct_red":
			color = "Červená";
			break;
		case "kct_yellow":
			color = "Žlutá";
			break;
		default:
			"";
	}

	
	popup = new OpenLayers.Popup.FramedCloud("featurePopup",
			feature.geometry.getBounds().getCenterLonLat(),
			new OpenLayers.Size(100, 100),
			"<h4>" + color + " stezka" + "</h4>" + "délka trasy: " + length + " km" + "<br>" + tagy, null, true, onPopupClose);
	feature.popup = popup;
	popup.feature = feature;
	map.addPopup(popup, true);
}
