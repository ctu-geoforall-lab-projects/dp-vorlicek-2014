var map;
var renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
renderer = (renderer) ? [renderer] : OpenLayers.Layer.Vector.prototype.renderers;
var center;
var zoom;
var controls;

function init(params) {
	OpenLayers.ProxyHost = "/cgi-bin/proxy.cgi?url=";
	var host, workspace;
	//nastavení prostředí
	if (window.location.hostname === 'toulavej.loc') {
		host = 'toulavej.loc';
		workspace = "diplomka";
	}
	else if (window.location.hostname === '94.143.173.89') {
		host = '94.143.173.89';
		workspace = "diplomka";
	}
	else if (window.location.hostname === 'shaitan666.asuscomm.com') {
		host = 'shaitan666.asuscomm.com';
		workspace = "diplomka";
	}
	else if (window.location.hostname === 'geo102.fsv.cvut.cz') {
		host = 'geo102.fsv.cvut.cz';
		workspace = "vorlichr";
	}

	OpenLayers.Feature.Vector.style['default']['strokeWidth'] = '3';
	OpenLayers.Feature.Vector.style['default']['strokeColor'] = 'rgb(0,0,0)';
	OpenLayers.Feature.Vector.style['select']['strokeWidth'] = '3';
	OpenLayers.Feature.Vector.style['select']['strokeColor'] = 'rgb(0,0,0)';

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

	var hikingWMS = new OpenLayers.Layer.WMS("Stezky - WMS", "http://" + host + ":8080/geoserver/" + workspace + "/wms", {
		layers: workspace + ":tourist_tracks",
		format: "image/png",
		isBaseLayer: false,
		transparent: true,
		tiled: true,
		tilesOrigin: map.maxExtent.left + ',' + map.maxExtent.bottom
	});
	map.addLayer(hikingWMS);

	var newTrack = new OpenLayers.Layer.Vector("Nová trasa", {
		projection: new OpenLayers.Projection("EPSG:900913")
	});
	map.addLayer(newTrack);

	//for disable draw control
	newTrack.events.on({
		'featuresadded': onFeaturesAdded,
		'afterfeaturemodified': writeGeometry,
		'featuremodified': writeGeometry,
		'vertexmodified': writeGeometry,
		'sketchcomplete': writeGeometry
	});

	if (console && console.log) {
		function report(event) {
			console.log(event.type, event.feature ? event.feature.id : event.components);
		}
		newTrack.events.on({
			"beforefeaturemodified": report,
			"featuremodified": report,
			"afterfeaturemodified": report,
			"vertexmodified": report,
			"sketchmodified": report,
			"sketchstarted": report,
			"sketchcomplete": report
		});
	}

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

	//control for draw new Track
	controls = {
		line: new OpenLayers.Control.DrawFeature(newTrack, OpenLayers.Handler.Path),
		modify: new OpenLayers.Control.ModifyFeature(newTrack)
	};
	map.addControl(controls['line']);
	map.addControl(controls['modify']);

	controls.modify.mode = OpenLayers.Control.ModifyFeature.RESHAPE;
	controls.modify.createVertices = true;

	controls.line.activate();
	alert('Editace je aktivní');
}

//	function for create shape of path
//	modification of modify-feature example from openlayers.org
function onFeaturesAdded(event) {
	controls.line.deactivate();
	controls.modify.activate();
}

function writeGeometry(event){
	feature = event.feature;
	document.getElementById('trackLenght').innerHTML = (feature.geometry.getLength()/1000).toFixed(3) + " km";
	$('input.the_geom').val(feature.geometry.toString());
	$('input.length').val(feature.geometry.getLength());
}
