var map;
var renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
renderer = (renderer) ? [renderer] : OpenLayers.Layer.Vector.prototype.renderers;
var center;
var zoom;

function init(params) {
	OpenLayers.ProxyHost = "/cgi-bin/proxy.cgi?url=";
	var host, workspace;
	//nastavení prostředí
	if (window.location.hostname === 'toulavej.loc') {
		host = 'toulavej.loc';
		workspace = "diplomka";
	}
	else if (window.location.hostname === 'geo102.fsv.cvut.cz') {
		host = 'geo102.fsv.cvut.cz';
		workspace = "vorlichr";
	}

	map = new OpenLayers.Map({
		div: 'map-addTrack',
		units: "m",
		projection: "EPSG:900913",
		maxResolution: "auto"
	});
	//podkladový mapy
	var osm = new OpenLayers.Layer.OSM('OpenStreetMap');
	map.addLayer(osm);
	map.setCenter([params['lon'], params['lat']], params['zoom']);

	var hikingWMS = new OpenLayers.Layer.WMS("Stezky - WMS", "http://localhost:8080/geoserver/" + workspace + "/wms", {
		layers: workspace + ":tourist_tracks",
		format: "image/png",
		isBaseLayer: false,
		transparent: true,
		tiled: true,
		tilesOrigin: map.maxExtent.left + ',' + map.maxExtent.bottom
	});
	map.addLayer(hikingWMS);

	var newTrack = new OpenLayers.Layer.Vector("Nová trasa", {
		projection: new OpenLayers.Projection("EPSG:900913"),
		style: {
			strokeColor: 'rgb(0,0,0)',
			strokeWidth: 3
		}
	});
	map.addLayer(newTrack);

	drawControls = {line: new OpenLayers.Control.DrawFeature(newTrack, OpenLayers.Handler.Path)};
	map.addControl(drawControls['line']);

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
	map.addControl(new OpenLayers.Control.MousePosition({displayProjection: "EPSG:4326"})); //mouse position
	map.addControl(new OpenLayers.Control.ScaleLine()); //scaleLine
	map.addControl(new OpenLayers.Control.Scale()); //scale
	map.addControl(new OpenLayers.Control.KeyboardDefaults());
	map.addControl(new OpenLayers.Control.Permalink());
}


function toggleControl(element) {
	for (key in drawControls) {
		var control = drawControls[key];
		if (element.name === key && element.checked) {
			control.activate();
		} else {
			control.deactivate();
			document.getElementById('frmaddTrackForm-the_geom').innerHTML = 'toto je test zápisu.';
		}
	}
}