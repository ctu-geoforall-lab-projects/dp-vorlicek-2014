-- tabulka USER
CREATE TABLE "user"
(
  id serial NOT NULL,
  name character varying(255) NOT NULL,
  email character varying(255) NOT NULL,
  passwd character varying(255) NOT NULL,
  passwd_salt character varying(255) NOT NULL,
  fbuid character varying(255),
  osm_account character varying(255),
  note character varying(255) DEFAULT ''::character varying,
  active boolean NOT NULL DEFAULT true,
  attempts integer NOT NULL DEFAULT 0,
  role character varying(255) NOT NULL DEFAULT 'user'::character varying,
  about text NULL,
  CONSTRAINT user_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);

-- tabulka SHOUTBOARD pro diskuzi
CREATE TABLE "shoutboard" (
  "id" serial NOT NULL PRIMARY KEY, 
  "user_id" integer NULL,
  "name" character varying(50) NOT NULL,
  "message" text NOT NULL,
  "posted" timestamp NOT NULL DEFAULT NOW()
);


INSERT INTO user VALUES
(1,"Chrudoš","chrudos.vorlicek@gmail.com","62d301aa84d93b51740fc83491547baeacce2b869badce90136a7736e488ce51","895181557","","vorel6@post.cz","SHAitanBelialLeviathanLucifer666",TRUE,0,"admin","");

-- propojení do jedné tabulky bez mezikroku hiking_routes
CREATE TABLE tourist_tracks
    AS (SELECT roads.osm_id, roads.route, roads.z_order, roads.way_area, roads.way, rels.*
	FROM planet_osm_roads AS roads
        JOIN planet_osm_rels AS rels
          ON -roads.osm_id = rels.id
       WHERE route IN ('foot','hiking')
         AND roads.operator LIKE '%cz:K%');

-- přidání sloupců s barvou a typem turistické značky
ALTER TABLE "tourist_tracks"
ADD "kct_color" character varying(50) NULL,
ADD "kct_type" character varying(50) NULL;
COMMENT ON TABLE "tourist_tracks" IS '';

-- UPDATE COLUMN kct_color
UPDATE tourist_tracks
   SET kct_color = 'kct_yellow'
 WHERE osm_id IN (
        SELECT osm_id
          FROM (
                SELECT *, generate_subscripts(tags, 1) AS t
                  FROM tourist_tracks) AS foo
                 WHERE tags[t] ~~ '%kct_yellow%');

UPDATE tourist_tracks
   SET kct_color = 'kct_blue'
 WHERE osm_id IN (
        SELECT osm_id
          FROM (
                SELECT *, generate_subscripts(tags, 1) AS t
                  FROM tourist_tracks) AS foo
                 WHERE tags[t] ~~ '%kct_blue%');

UPDATE tourist_tracks
   SET kct_color = 'kct_green'
 WHERE osm_id IN (
        SELECT osm_id
          FROM (
                SELECT *, generate_subscripts(tags, 1) AS t
                  FROM tourist_tracks) AS foo
                 WHERE tags[t] ~~ '%kct_green%');

UPDATE tourist_tracks
   SET kct_color = 'kct_red'
 WHERE osm_id IN (
        SELECT osm_id
          FROM (
                SELECT *, generate_subscripts(tags, 1) AS t
                  FROM tourist_tracks) AS foo
                 WHERE tags[t] ~~ '%kct_red%');

--UPDATE COLUMN kct_type

