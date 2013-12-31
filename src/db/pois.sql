DROP TABLE IF EXISTS pois;

CREATE TABLE pois AS 
        (SELECT "osm_id", "amenity", "historic", "leisure", "man_made", "name", "natural", "religion", "shop", "tags", "tourism", "way", "z_order", "ele"
           FROM planet_osm_point WHERE osm_id IN 
                (SELECT DISTINCT osm_id
                   FROM planet_osm_point
                  WHERE "natural" in ('spring','beach','cave_entrance','peak','tree','tree_row','stone','sinkhole')
                     OR "man_made" in ('adit','campanile','chimney','tower','watermill','water_well','windmill')
                     OR "leisure" in ('firepit','nature_reserve','water_park') 
                     OR "historic" in ('archaelogical_site','monastery','mine','battlefield','boundry_stone','castle','city_gate','memorial','monument','ruins','wayside_cross̈́','wayside_shrine')
                     OR "tourism" in ('alpine_hut','artwork','camp_site','caravan_site','chalet','gallery','museum','guest_house','hostel','hotel','motel','information','picnic_site','theme_park','viewpoint','zoo')  
                     OR "shop" = 'gift'
                     OR "amenity" in('fountain','bench','place_of_worship','parking','parking_space','parking_entrance','bicycle_rental','pub','restaurant','fast_food','drinking_water','cafe','biergarten')
                )
        );

