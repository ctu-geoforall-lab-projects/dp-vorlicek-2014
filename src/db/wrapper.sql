-- PGSQL WRAPPER from <http://workshop.pgrouting.org/chapters/wrapper.html>
-- modified for project Toulavej by CHrudos Vorlicek <chrudos.vorlicek@gmail.com>

DROP FUNCTION pgr_fromAtoB(varchar, double precision, double precision, double precision, double precision);

CREATE OR REPLACE FUNCTION pgr_fromAtoB(
                IN tbl varchar,
                IN x1 double precision,
                IN y1 double precision,
                IN x2 double precision,
                IN y2 double precision,
                OUT seq integer,
                OUT osm_id integer,
                OUT name text,
                OUT heading double precision,
                OUT cost double precision,
                OUT way geometry
        )
        RETURNS SETOF record AS
$BODY$
DECLARE
        sql     text;
        rec     record;
        source  integer;
        target  integer;
        point   integer;

BEGIN
        -- Find nearest node
        EXECUTE 'SELECT id::integer FROM planet_osm_line_vertices_pgr
                        ORDER BY the_geom <-> ST_GeometryFromText(''POINT('
                        || x1 || ' ' || y1 || ')'',900913) LIMIT 1' INTO rec;
        source := rec.id;

        EXECUTE 'SELECT id::integer FROM planet_osm_line_vertices_pgr
                        ORDER BY the_geom <-> ST_GeometryFromText(''POINT('
                        || x2 || ' ' || y2 || ')'',900913) LIMIT 1' INTO rec;
        target := rec.id;

        -- Shortest path query (TODO: limit extent by BBOX)
        seq := 0;
        sql := 'SELECT osm_id, way, name, reverse_cost, source, target,
                                ST_Reverse(way) AS flip_way FROM ' ||
                        'pgr_dijkstra(''SELECT osm_id as id, source::int, target::int, '
                                        || 'reverse_cost::double AS cost FROM '
                                        || quote_ident(tbl) || ''', '
                                        || source || ', ' || target
                                        || ' , false, false), '
                                || quote_ident(tbl) || ' WHERE id2 = osm_id ORDER BY seq';

        -- Remember start point
        point := source;

        FOR rec IN EXECUTE sql
        LOOP
                -- Flip geometry (if required)
                IF ( point != rec.source ) THEN
                        rec.way := rec.flip_way;
                        point := rec.source;
                ELSE
                        point := rec.target;
                END IF;

                -- Calculate heading (simplified)
                EXECUTE 'SELECT degrees( ST_Azimuth(
                                ST_StartPoint(''' || rec.way::text || '''),
                                ST_EndPoint(''' || rec.way::text || ''') ) )'
                        INTO heading;

                -- Return record
                seq				:= seq + 1;
                osm_id			:= rec.id;
                name		    := rec.name;
                cost			:= rec.reverse_cost;
                way				:= rec.way;
                RETURN NEXT;
        END LOOP;
        RETURN;
END;
$BODY$
LANGUAGE 'plpgsql' VOLATILE STRICT;