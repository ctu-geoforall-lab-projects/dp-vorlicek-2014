/* 
 * Styles of OpenLayers map layers
 * @author: Chrudoš Vorlíček <chrudos.vorlicek@gmail.com>
 */

function createStyles() {

//hiking tracks sybmols
	var blueTrack = new OpenLayers.Rule({
		filter: new OpenLayers.Filter.Comparison({
			type: OpenLayers.Filter.Comparison.EQUAL_TO,
			property: "kct_color",
			value: "kct_blue"
		}),
		symbolizer: {strokeWidth: 2,
			strokeColor: "blue"}
	});
	var greenTrack = new OpenLayers.Rule({
		filter: new OpenLayers.Filter.Comparison({
			type: OpenLayers.Filter.Comparison.EQUAL_TO,
			property: "kct_color",
			value: "kct_green"
		}),
		symbolizer: {strokeWidth: 2,
			strokeColor: "green"}
	});
	var yellowTrack = new OpenLayers.Rule({
		filter: new OpenLayers.Filter.Comparison({
			type: OpenLayers.Filter.Comparison.EQUAL_TO,
			property: "kct_color",
			value: "kct_yellow"
		}),
		symbolizer: {strokeWidth: 3,
			strokeColor: "yellow"}
	});
	var redTrack = new OpenLayers.Rule({
		filter: new OpenLayers.Filter.Comparison({
			type: OpenLayers.Filter.Comparison.EQUAL_TO,
			property: "kct_color",
			value: "kct_red"
		}),
		symbolizer: {strokeWidth: 3,
			strokeColor: "red"}
	});
	var rest = new OpenLayers.Rule({
		filter: new OpenLayers.Filter.Comparison({
			type: OpenLayers.Filter.Comparison.EQUAL_TO,
			property: "kct_color",
			value: ""
		}),
		symbolizer: {strokeWidth: 3,
			strokeColor: "black"}
	});
	//Religion symbols
	var christian = new OpenLayers.Rule({
		filter: new OpenLayers.Filter.Comparison({
			type: OpenLayers.Filter.Comparison.EQUAL_TO,
			property: "religion",
			value: "christian"
		}),
		symbolizer: {
			externalGraphic: './../images/map_marks/cross.png',
			graphicWidth: 7,
			graphicHeight: 14,
			graphicOpacity: 1
		}
	});
	var judaism = new OpenLayers.Rule({
		filter: new OpenLayers.Filter.Comparison({
			type: OpenLayers.Filter.Comparison.EQUAL_TO,
			property: "religion",
			value: "jewish"
		}),
		symbolizer: {
			externalGraphic: './../images/map_marks/6_star.png',
			graphicWidth: 14,
			graphicHeight: 14,
			graphicOpacity: 1
		}
	});
	var otherRel = new OpenLayers.Rule({
		filter: new OpenLayers.Filter.Comparison({
			type: OpenLayers.Filter.Comparison.EQUAL_TO,
			property: "religion",
			value: "buddhist"
		}),
		symbolizer: {
			externalGraphic: './../images/map_marks/otherRel.png',
			graphicWidth: 7,
			graphicHeight: 7,
			graphicOpacity: 1
		}
	});
	//photo
	var photo = new OpenLayers.Rule({
		filter: new OpenLayers.Filter.Comparison({
			type: OpenLayers.Filter.Comparison.NOT_EQUAL_TO,
			property: "filename",
			value: null
		}),
		symbolizer: {
			strokeColor: 'rgb(255,0,0)',
			fillColor: 'rgb(255,0,0)',
			strokeWidth: '2'
		}
	});
	//food
	var food = new OpenLayers.Rule({
		filter: new OpenLayers.Filter.Logical({
			type: OpenLayers.Filter.Logical.OR,
			filters: [
				new OpenLayers.Filter.Comparison({
					type: OpenLayers.Filter.Comparison.EQUAL_TO,
					property: "amenity",
					value: "pub"
				}),
				new OpenLayers.Filter.Comparison({
					type: OpenLayers.Filter.Comparison.EQUAL_TO,
					property: "amenity",
					value: "restaurant"
				}),
				new OpenLayers.Filter.Comparison({
					type: OpenLayers.Filter.Comparison.EQUAL_TO,
					property: "amenity",
					value: "fast_food"
				}),
				new OpenLayers.Filter.Comparison({
					type: OpenLayers.Filter.Comparison.EQUAL_TO,
					property: "amenity",
					value: "cafe"
				}),
				new OpenLayers.Filter.Comparison({
					type: OpenLayers.Filter.Comparison.EQUAL_TO,
					property: "amenity",
					value: "biergarten"
				}),
				new OpenLayers.Filter.Comparison({
					type: OpenLayers.Filter.Comparison.EQUAL_TO,
					property: "amenity",
					value: "bar"
				})
			]
		}),
		symbolizer: {
			externalGraphic: './../images/map_marks/food.png',
			graphicWhidth: 10,
			graphicHeight: 10,
			graphicOpacity: 1
		}
	});
	//castle
	var castle = new OpenLayers.Rule({
		filter: new OpenLayers.Filter.Comparison({
			type: OpenLayers.Filter.Comparison.EQUAL_TO,
			property: "historic",
			value: "castle"
		}),
		symbolizer: {
			externalGraphic: './../images/map_marks/castle.png',
			graphicWidth: 25,
			graphicHeight: 30,
			graphicOpacity: 1
		}
	});
	var ruins = new OpenLayers.Rule({
		filter: new OpenLayers.Filter.Comparison({
			type: OpenLayers.Filter.Comparison.EQUAL_TO,
			property: "historic",
			value: "ruins"
		}),
		symbolizer: {
			externalGraphic: './../images/map_marks/ruins.png',
			graphicWidth: 25,
			graphicHeight: 30,
			graphicOpacity: 1
		}
	});

	//information
	var info = new OpenLayers.Rule({
		filter: new OpenLayers.Filter.Comparison({
			type: OpenLayers.Filter.Comparison.EQUAL_TO,
			property: "tourism",
			value: "information"
		}),
		symbolizer: {
			externalGraphic: './../images/map_marks/info.png',
			graphicWidth: 7,
			graphicHeight: 16,
			graphicOpacity: 1
		}
	});
	var guidepost = new OpenLayers.Rule({
		filter: new OpenLayers.Filter.Logical({
			type: OpenLayers.Filter.Logical.AND,
			filters: [
				new OpenLayers.Filter.Comparison({
					type: OpenLayers.Filter.Comparison.EQUAL_TO,
					property: "tourism",
					value: "information"
				}),
				new OpenLayers.Filter.Comparison({
					type: OpenLayers.Filter.Comparison.LIKE,
					property: "info_type",
					value: "guidepost"
				})
			]

		}),
		symbolizer: {
			externalGraphic: './../images/map_marks/sign.png',
			graphicWidth: 20,
			graphicHeight: 30,
			graphicYOffset: -30,
			graphicOpacity: 1
		}
	});

	//accommodation
	var camps = new OpenLayers.Rule({
		filter: new OpenLayers.Filter.Logical({
			type: OpenLayers.Filter.Logical.OR,
			filters: [
				new OpenLayers.Filter.Comparison({
					type: OpenLayers.Filter.Comparison.EQUAL_TO,
					property: "tourism",
					value: "camping_site"
				}),
				new OpenLayers.Filter.Comparison({
					type: OpenLayers.Filter.Comparison.LIKE,
					property: "tourism",
					value: "caravan_site"
				})
			]

		}),
		symbolizer: {
			externalGraphic: './../images/map_marks/camp.png',
			graphicWidth: 30,
			graphicHeight: 15,
			graphicOpacity: 1
		}
	});

	var hotel = new OpenLayers.Rule({
		filter: new OpenLayers.Filter.Logical({
			type: OpenLayers.Filter.Logical.OR,
			filters: [
				new OpenLayers.Filter.Comparison({
					type: OpenLayers.Filter.Comparison.EQUAL_TO,
					property: "tourism",
					value: "chalet"
				}),
				new OpenLayers.Filter.Comparison({
					type: OpenLayers.Filter.Comparison.EQUAL_TO,
					property: "tourism",
					value: "guest_house"
				}),
				new OpenLayers.Filter.Comparison({
					type: OpenLayers.Filter.Comparison.EQUAL_TO,
					property: "tourism",
					value: "hostel"
				}),
				new OpenLayers.Filter.Comparison({
					type: OpenLayers.Filter.Comparison.EQUAL_TO,
					property: "tourism",
					value: "hotel"
				}),
				new OpenLayers.Filter.Comparison({
					type: OpenLayers.Filter.Comparison.EQUAL_TO,
					property: "tourism",
					value: "motel"
				}),
				new OpenLayers.Filter.Comparison({
					type: OpenLayers.Filter.Comparison.LIKE,
					property: "tourism",
					value: "alpine_hut"
				})
			]

		}),
		symbolizer: {
			externalGraphic: './../images/map_marks/accommodation.png',
			graphicWidth: 30,
			graphicHeight: 15,
			graphicOpacity: 1
		}
	});

	//peak
	var peak = new OpenLayers.Rule({
		filter: new OpenLayers.Filter.Comparison({
			type: OpenLayers.Filter.Comparison.EQUAL_TO,
			property: "natural",
			value: "peak"
		}),
		symbolizer: {
			externalGraphic: './../images/map_marks/peak.png',
			graphicWidth: 14,
			graphicHeight: 14,
			graphicOpacity: 1
		}
	});
	
	//tree
	var tree = new OpenLayers.Rule({
		filter: new OpenLayers.Filter.Comparison({
			type: OpenLayers.Filter.Comparison.EQUAL_TO,
			property: "natural",
			value: "tree"
		}),
		symbolizer: {
			externalGraphic: './../images/map_marks/tree.png',
			graphicWidth: 30,
			graphicHeight: 30,
			graphicOpacity: 1
		}
	});

	//spring
	var spring = new OpenLayers.Rule({
		filter: new OpenLayers.Filter.Comparison({
			type: OpenLayers.Filter.Comparison.EQUAL_TO,
			property: "natural",
			value: "spring"
		}),
		symbolizer: {
			externalGraphic: './../images/map_marks/spring.png',
			graphicWidth: 20,
			graphicHeight: 20,
			graphicOpacity: 1
		}
	});

	return [blueTrack, greenTrack, yellowTrack, redTrack, rest, christian, judaism, otherRel, photo, food, castle, ruins, info, guidepost, camps, hotel, peak, tree, spring];
}


