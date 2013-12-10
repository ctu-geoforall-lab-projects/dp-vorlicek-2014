DROP TABLE IF EXISTS tourist_tracks;

CREATE TABLE tourist_tracks AS (
SELECT	osm_id,
		tags->'osmc:symbol' AS kct_symbol,
		tags->'destinations' AS kct_destinations,
		tags->'route_name' AS kct_name,
			CASE
				WHEN tags->'osmc:symbol' LIKE 'blue:white:blue%' THEN 'kct_blue'
				WHEN tags->'osmc:symbol' LIKE 'green:white:green%' THEN 'kct_green'
				WHEN tags->'osmc:symbol' LIKE 'red:white:red%' THEN 'kct_red'
				WHEN tags->'osmc:symbol' LIKE 'yellow:white:yellow%' THEN 'kct_yellow'
			END AS kct_color,
		operator,
		route,
		way,
		z_order,
		way_area
  FROM planet_osm_line
 WHERE operator LIKE '%cz:K%' AND route IN ('foot','hiking')
);
