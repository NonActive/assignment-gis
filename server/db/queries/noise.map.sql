SELECT
  'FeatureCollection' AS type,
  array_to_json(ARRAY_AGG(features_data)) AS features 
FROM
  (
    SELECT
      'Feature' AS type,
      noise.level AS level,
      st_asgeojson(noise.geom)::json AS geometry 
    FROM
      noise_level AS noise
  )
  AS features_data