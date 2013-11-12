SELECT *
  FROM planet_osm_line
  JOIN planet_osm_rels
    ON -planet_osm_line.osm_id = planet_osm_rels.id
 WHERE planet_osm_line.route IN ('hiking','foot')
   AND planet_osm_rels.tags = '{%kct%}'
 LIMIT 10;

--SELECT DISTINCT COLORS FROM ARRAY :) FINALLY
SELECT *
  FROM (SELECT *,
           generate_subscripts(tags, 1) AS t
        FROM tourist_tracks) AS foo
 WHERE tags[t] ~~ '%kct_yellow%'
 LIMIT 10;
