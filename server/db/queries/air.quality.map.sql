WITH bonita_max_min AS 
(
  SELECT
    MIN(bk.gridvalue),
    MAX(bk.gridvalue) 
  FROM
    bonita_klimatu_mapa AS bk 
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
            bk.gridvalue,
            (
              SELECT
                min 
              FROM
                bonita_max_min
            )
,
            (
              SELECT
                max 
              FROM
                bonita_max_min
            )
        )
        AS t)) AS properties,
        ST_AsGeoJSON(bk.geom)::json AS geometry 
      FROM
        bonita_klimatu_mapa AS bk 
  )
  AS features_data