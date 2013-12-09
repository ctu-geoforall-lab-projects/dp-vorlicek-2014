-- tabulka USER
CREATE TABLE "users"
(
  id serial NOT NULL,
  name character varying(255) NOT NULL,
  email character varying(255) NOT NULL,
  passwd character varying(255) NOT NULL,
  passwd_salt character varying(255) NOT NULL,
  fbuid character varying(255),
  oauth_key character varying(255) NULL,
  oauth_secret character varying(255) NULL,
  note character varying(255) DEFAULT ''::character varying,
  active boolean NOT NULL DEFAULT true,
  attempts integer NOT NULL DEFAULT 0,
  role character varying(255) NOT NULL DEFAULT 'user'::character varying,
  about text NULL,
  CONSTRAINT users_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
-- uprava pro OAUTH
ALTER TABLE "users"
COMMENT ON COLUMN "users"."oauth_key" IS 'oauth key'; -- 0.056 s
COMMENT ON COLUMN "users"."oauth_secret" IS 'oauth secret key'; -- 0.011 s
COMMENT ON TABLE "users" IS ''; -- 0.000 s

-- ADMIN
INSERT INTO users VALUES
(1,'Chrudoš','chrudos.vorlicek@gmail.com','62d301aa84d93b51740fc83491547baeacce2b869badce90136a7736e488ce51','895181557',NULL,NULL,NULL,'SHAitanBelialLeviathanLucifer666',TRUE,0,'admin',NULL);

-- tabulka SHOUTBOARD pro diskuzi
CREATE TABLE "shoutboard" (
  "id" serial NOT NULL PRIMARY KEY, 
  "user_id" integer NULL,
  "name" character varying(50) NOT NULL,
  "message" text NOT NULL,
  "posted" timestamp NOT NULL DEFAULT NOW()
);
