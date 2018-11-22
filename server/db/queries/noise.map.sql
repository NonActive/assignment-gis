-- SELECT
--   'FeatureCollection' AS type,
--   array_to_json(ARRAY_AGG(features_data)) AS features 
-- FROM
--   (
--     SELECT
--       'Feature' AS type,
--   row_to_json((
--       SELECT
--         t 
--       FROM
--         (
--           SELECT noise.level
--         )
--         AS t)) AS properties,
--       st_asgeojson(noise.geom)::json AS geometry 
--     FROM
--       noise_level AS noise
--   )
--   AS features_data

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
          SELECT bonita_klimatu.gridvalue
        )
        AS t)) AS properties,
      st_asgeojson(bonita_klimatu.geom)::json AS geometry 
    FROM
      bonita_klimatu_mapa AS bonita_klimatu
  )
  AS features_data