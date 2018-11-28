SELECT
   'FeatureCollection' AS type,
   array_to_json(ARRAY_AGG(features_data)) AS features 
FROM
   (
      SELECT
         'Feature' AS type,
         ST_AsGeoJSON(ST_Transform(point.way,4326)::geography)::json AS geometry,
         row_to_json(( 
         SELECT
            t 
         FROM
            (
               SELECT
                  point.name 
            )
            AS t)) AS properties 
         FROM
            planet_osm_point AS point 
         WHERE
            ST_Distance(st_geomfromtext( 'POINT(%lng% %lat%)'), ST_Transform(point.way, 4326)::geography) < %distance% 
            AND point.amenity LIKE 'parking' 
   )
   AS features_data