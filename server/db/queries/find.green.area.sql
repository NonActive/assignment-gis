SELECT
   leisure AS type,
   COUNT(*) 
FROM
   planet_osm_polygon 
WHERE
   ST_Dwithin(st_geomfromtext( 'POINT(%lng% %lat%)'), ST_Transform(way, 4326)::geography, %distance%) 
   AND 
   (
      leisure = 'park' 
      OR leisure = 'meadow' 
      OR leisure = 'dog_park' 
      OR leisure = 'recreation_ground' 
      OR leisure = 'garden'
   )
GROUP BY
   type