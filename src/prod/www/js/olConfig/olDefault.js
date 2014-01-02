var map;
var renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
renderer = (renderer) ? [renderer] : OpenLayers.Layer.Vector.prototype.renderers;
var center;
var zoom;
var host, workspace;

//import styles
var style = new OpenLayers.Style();
style.addRules(createStyles());

function init(params) {
	OpenLayers.ProxyHost = "/cgi-bin/proxy.cgi?url=";
	//nastavení prostředí
	if (window.location.hostname === 'toulavej.loc') {
		host = 'toulavej.loc';
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
	map = new OpenLayers.Map({div: 'map',
		units: "m",
		projection: "EPSG:900913",
		maxResolution: "auto"
	});

	//background map
	var osm = new OpenLayers.Layer.OSM('OpenStreetMap', '',
			{displayInLayerSwitcher: false});
	map.addLayer(osm);
	map.setCenter([params['lon'], params['lat']], params['zoom']);

	geolocateLayer = new OpenLayers.Layer.Vector();

	//OSM DATA
	//hiking layers
	var hiking = createHiking();
	var hikingWFS = hiking[0];
	map.addLayers(hiking);

	//religious objects
	var religionWFS = createReligion();
	map.addLayer(religionWFS);

	var photoWFS = createPhoto();
	map.addLayer(photoWFS);

	var foodWFS = createFood();
	map.addLayer(foodWFS);

	var castleWFS = createCastle();
	map.addLayer(castleWFS);

	var infoWFS = createInfo();
	map.addLayer(infoWFS);

	var accommodationWFS = createAccommodation();
	map.addLayer(accommodationWFS);

	var peakWFS = createPeak();
	map.addLayer(peakWFS);

	var treeWFS = createTree();
	map.addLayer(treeWFS);

	var springWFS = createSpring();
	map.addLayer(springWFS);

	//camps for showing on localhost
	if (host === 'toulavej.loc') {
		var kempyWFS = createKempyWFS();
		map.addLayer(kempyWFS);
		selectControl = new OpenLayers.Control.SelectFeature([kempyWFS, hikingWFS, religionWFS, photoWFS, foodWFS, castleWFS, infoWFS, accommodationWFS, peakWFS, treeWFS, springWFS]);
	}
	else {
		selectControl = new OpenLayers.Control.SelectFeature([hikingWFS, religionWFS, photoWFS, foodWFS, castleWFS, infoWFS, accommodationWFS, peakWFS, treeWFS, springWFS]);
	}

	// Interaction
	map.addControl(selectControl);
	selectControl.activate();
	if (host === 'toulavej.loc')
	{
		kempyWFS.events.on({
			'featureselected': onFeatureSelect,
			'featureunselected': onFeatureUnselect
		});
	}
	hikingWFS.events.on({
		'featureselected': onRouteSelect,
		'featureunselected': onFeatureUnselect
	});

	religionWFS.events.on({
		'featureselected': onReligionSelect,
		'featureunselected': onFeatureUnselect
	});

	photoWFS.events.on({
		'featureselected': onPhotoSelect,
		'featureunselected': onFeatureUnselect
	});

	foodWFS.events.on({
		'featureselected': onFoodSelect,
		'featureunselected': onFeatureUnselect
	});

	castleWFS.events.on({
		'featureselected': onCastleSelect,
		'featureunselected': onFeatureUnselect
	});

	infoWFS.events.on({
		'featureselected': onInfoSelect,
		'featureunselected': onFeatureUnselect
	});
	accommodationWFS.events.on({
		'featureselected': onAccommodationSelect,
		'featureunselected': onFeatureUnselect
	});

	peakWFS.events.on({
		'featureselected': onPeakSelect,
		'featureunselected': onFeatureUnselect
	});

	treeWFS.events.on({
		'featureselected': onTreeSelect,
		'featureunselected': onFeatureUnselect
	});

	springWFS.events.on({
		'featureselected': onSpringSelect,
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
	map.addControl(new OpenLayers.Control.MousePosition({displayProjection: "EPSG:4326"})); //mouse position
	map.addControl(new OpenLayers.Control.ScaleLine()); //scaleLine
	map.addControl(new OpenLayers.Control.Scale()); //scale
	map.addControl(new OpenLayers.Control.KeyboardDefaults());
	map.addControl(new OpenLayers.Control.Permalink());
	map.addControl(new OpenLayers.Control.LayerSwitcher());
}

function onPopupClose(evt) {
	this.destroy();
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