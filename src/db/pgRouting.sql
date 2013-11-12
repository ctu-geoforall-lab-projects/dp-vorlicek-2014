--PG ROUTING NAD TOURIST TRACKS
ALTER TABLE tourist_tracks ADD COLUMN "source" integer;
ALTER TABLE tourist_tracks ADD COLUMN "target" integer;
SELECT pgr_createTopology('tourist_tracks',0.00001, 'way','id');
ALTER TABLE tourist_tracks ADD COLUMN reverse_cost double precision;
UPDATE tourist_tracks SET reverse_cost = ST_Length(way) ;

--A* ALGORITHM
ALTER TABLE tourist_tracks ADD COLUMN x1 double precision;
ALTER TABLE tourist_tracks ADD COLUMN y1 double precision;
ALTER TABLE tourist_tracks ADD COLUMN x2 double precision;
ALTER TABLE tourist_tracks ADD COLUMN y2 double precision;

UPDATE tourist_tracks SET x1 = ST_x(ST_PointN(way, 1));
UPDATE tourist_tracks SET y1 = ST_y(ST_PointN(way, 1));

UPDATE tourist_tracks SET x2 = ST_x(ST_PointN(way, ST_NumPoints(way)));
UPDATE tourist_tracks SET y2 = ST_y(ST_PointN(way, ST_NumPoints(way)));
