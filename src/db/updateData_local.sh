#! /bin/bash

#download latest data
wget http://download.geofabrik.de/europe/czech-republic-latest.osm.bz2

#bunzip file
bunzip2 czech-republic-latest.osm.bz2

#transfer data to db
osm2pgsql --slim --cache-strategy dense --hstore -d toulavej czech-republic-latest.osm

#create table tourist_tracks
psql -U shaitan -d toulavej --file=hiking_routes.sql

#create table Points of interest
psql -U shaitan -d toulavej --file=pois.sql

#remove osm file
rm czech-republic-latest.osm

#PGROUTING
#create function for pgrouting
#psql -U shaitan -d toulavej --file=wrapper.sql

