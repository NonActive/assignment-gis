SELECT
  'FeatureCollection' AS type,
  array_to_json(ARRAY_AGG(features_data)) AS features 
FROM
  (
    SELECT
      'Feature' AS type,
      ST_AsGeoJSON(zastav_t.geom_new)::json AS geometry,
      row_to_json((
      SELECT
        t 
      FROM
        (
          SELECT
            zastav_t.gid
        )
        AS t)) AS properties 
      FROM
        zastavitelne_uzemi AS zastav_t 
      WHERE
        zastav_t.zastav LIKE 'zastavitelne' LIMIT 100 
  )
  AS features_data