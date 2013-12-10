#! /bin/bash

#download latest data
wget http://download.geofabrik.de/europe/czech-republic-latest.osm.bz2

#bunzip file
echo "Extracting OSM data"
bunzip2 czech-republic-latest.osm.bz2

#transfer data to db
echo "Importing OSM data"
osm2pgsql --slim --cache-strategy dense --hstore -d vorlichr_dp czech-republic-latest.osm

#create table tourist_tracks
echo "Creating Hiking routes"
psql -U vorlichr  -d vorlichr_dp --file=hiking_routes.sql

#create table Points of interest
echo "Creating POIs"
psql -U vorlichr  -d vorlichr_dp --file=pois.sql

#remove osm file
echo "Removing czech-republic-latest.osm"
rm czech-republic-latest.osm

