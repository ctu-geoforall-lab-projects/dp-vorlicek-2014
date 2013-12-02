--PG ROUTING FOR PLANET_OSM_LINE
ALTER TABLE planet_osm_line ADD COLUMN "source" integer;
ALTER TABLE planet_osm_line ADD COLUMN "target" integer;

SELECT pgr_createTopology('planet_osm_line',0.00001, 'way','osm_id');

-- Add indices
CREATE INDEX source_idx ON planet_osm_line("source");
CREATE INDEX target_idx ON planet_osm_line("target");

-- PREREQUISITIES
-- DIJKSTRA ALGORITHM
ALTER TABLE planet_osm_line ADD COLUMN reverse_cost double precision;
UPDATE planet_osm_line SET reverse_cost = ST_Length(way) ;

--A* ALGORITHM
--ALTER TABLE planet_osm_line ADD COLUMN x1 double precision;
--ALTER TABLE planet_osm_line ADD COLUMN y1 double precision;
--ALTER TABLE planet_osm_line ADD COLUMN x2 double precision;
--ALTER TABLE planet_osm_line ADD COLUMN y2 double precision;

--UPDATE planet_osm_line SET x1 = ST_x(ST_PointN(way, 1));
--UPDATE planet_osm_line SET y1 = ST_y(ST_PointN(way, 1));

--UPDATE planet_osm_line SET x2 = ST_x(ST_PointN(way, ST_NumPoints(way)));
--UPDATE planet_osm_line SET y2 = ST_y(ST_PointN(way, ST_NumPoints(way)));

CREATE TABLE classess(
        id integer PRIMARY KEY,
        name varchar(255)
); 
