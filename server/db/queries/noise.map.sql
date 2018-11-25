WITH noise_max_min AS 
(
  SELECT
    MIN(noise.level),
    MAX(noise.level) 
  FROM
    noise_level AS noise 
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
            noise.level,
            (
              SELECT
                min 
              FROM
                noise_max_min
            )
,
            (
              SELECT
                max 
              FROM
                noise_max_min
            )
        )
        AS t)) AS properties,
        ST_AsGeoJSON(noise.geom)::json AS geometry 
      FROM
        noise_level AS noise 
  )
  AS features_data