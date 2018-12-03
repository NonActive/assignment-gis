WITH noise_max_min AS 
(
   SELECT
      MIN( avg_noise ),
      MAX( avg_noise ) 
   FROM
      (
         SELECT
            AVG((noise.db_lo + noise.db_hi) / 2) AS avg_noise 
         FROM
            hlukova_mapa_den AS noise 
         GROUP BY
            noise.db_lo,
            noise.db_hi
      )
      AS sub 
)
SELECT
   'FeatureCollection' AS type,
   array_to_json(ARRAY_AGG(features_data)) AS features 
FROM
   (
      SELECT
         'Feature' AS type,
         row_to_json(( 
         SELECT
            t 
         FROM
            (
               SELECT
                  AVG((noise.db_lo + noise.db_hi) / 2) AS level,
                  (
                     SELECT
                        MIN 
                     FROM
                        noise_max_min 
                  )
,
                  (
                     SELECT
                        MAX 
                     FROM
                        noise_max_min 
                  )
            )
            AS t)) AS properties,
            ST_AsGeoJSON(noise.geom)::json AS geometry 
         FROM
            hlukova_mapa_den AS noise 
         GROUP BY
            noise.db_lo,
            noise.db_hi,
            noise.geom 
   )
   AS features_data