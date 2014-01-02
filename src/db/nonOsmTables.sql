--create table for news
CREATE TABLE news
(
  id serial NOT NULL PRIMARY KEY,
  user_id integer NOT NULL,
  note text NOT NULL,
  created timestamp without time zone NOT NULL
)
WITH (
  OIDS=FALSE
);

--create table for track_reviews
CREATE TABLE track_reviews
(
  id serial NOT NULL,
  user_id integer NOT NULL, -- přidal
  track_id integer NOT NULL, -- trasa
  created timestamp without time zone NOT NULL, -- přidáno
  review text NOT NULL -- článek
)
WITH (
  OIDS=FALSE
);
COMMENT ON COLUMN track_reviews.user_id IS 'přidal';
COMMENT ON COLUMN track_reviews.track_id IS 'trasa';
COMMENT ON COLUMN track_reviews.created IS 'přidáno';
COMMENT ON COLUMN track_reviews.review IS 'článek';

--create table for tracks
CREATE TABLE tracks
(
  name character varying(255), -- označení trasy
  user_id integer NOT NULL, -- přidal
  note character varying(255), -- poznámka
  the_geom geometry(LineString),
  length double precision, -- délka prvku
  created timestamp without time zone, -- vytvořeno
  id serial NOT NULL,
  CONSTRAINT tracks_id PRIMARY KEY (id),
  CONSTRAINT tracks_user_id_fkey FOREIGN KEY (user_id)
      REFERENCES users (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=FALSE
);
COMMENT ON COLUMN tracks.name IS 'označení trasy';
COMMENT ON COLUMN tracks.user_id IS 'přidal';
COMMENT ON COLUMN tracks.note IS 'poznámka';
COMMENT ON COLUMN tracks.length IS 'délka prvku';
COMMENT ON COLUMN tracks.created IS 'vytvořeno';

-- create table for photos
CREATE TABLE images
(
  id serial NOT NULL,
  name character varying(255),
  user_id integer,
  the_geom geometry,
  created timestamp without time zone,
  note character varying(255),
  filename character varying(255) NOT NULL,
  CONSTRAINT images_id PRIMARY KEY (id),
  CONSTRAINT images_user_id_fkey FOREIGN KEY (user_id)
      REFERENCES users (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=FALSE
);

