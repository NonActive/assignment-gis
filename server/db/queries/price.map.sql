WITH price_max_min AS 
(
  SELECT
    MIN(cm.cena::integer),
    MAX(cm.cena::integer) 
  FROM
    cenova_mapa AS cm 
  WHERE
    cm.cena NOT LIKE 'N' 
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
            cm.cena AS price,
            (
              SELECT
                min 
              FROM
                price_max_min
            )
,
            (
              SELECT
                max 
              FROM
                price_max_min
            )
        )
        AS t)) AS properties,
        ST_AsGeoJSON(cm.geom_new)::json AS geometry 
      FROM
        cenova_mapa AS cm 
      WHERE
        ST_Intersects((
        SELECT
          geom_new 
        FROM
          mestske_casti AS mc 
        WHERE
          mc.gid = 7), cm.geom_new) 
  )
  AS features_data