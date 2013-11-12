CREATE TABLE hiking_routes
  AS (SELECT *
	FROM planet_osm_roads
       WHERE route IN ('foot','hiking'));

--propojení relací a hiking routes -> do jedné tabulky + extrahovat z toho barvu podle tagů
SELECT *
  FROM hiking_routes
  JOIN planet_osm_rels
    ON -osm_id = planet_osm_rels.id;

CREATE TABLE tourist_tracks AS
(SELECT hr.osm_id, hr.route, hr.z_order, hr.way_area, hr.way, rels.*
  FROM hiking_routes AS hr
  JOIN planet_osm_rels AS rels
    ON -osm_id = id
 WHERE hr.operator LIKE '%cz:K%');

-- propojení do jedné tabulky bez mezikroku hiking_routes
CREATE TABLE tourist_tracks
    AS (SELECT roads.osm_id, roads.route, roads.z_order, roads.way_area, roads.way, rels.*
	FROM planet_osm_roads AS roads
        JOIN planet_osm_rels AS rels
          ON -roads.osm_id = rels.id;
       WHERE route IN ('foot','hiking')
         AND roads.operator LIKE '%cz:K%');
