WITH cena AS 
(
  SELECT
    cena 
  FROM
    cenova_mapa 
  WHERE
    ST_Contains( geom_new, st_geomfromtext('POINT(%lng% %lat%)', 4326) ) 
),
noise_level AS 
(
  SELECT
    level 
  FROM
    noise_level 
  WHERE
    ST_Contains( geom, st_geomfromtext('POINT(%lng% %lat%)', 4326) ) 
),
air_quality AS 
(
  SELECT
    gridvalue 
  FROM
    bonita_klimatu_mapa
  WHERE
    ST_Contains( geom_new, st_geomfromtext('POINT(%lng% %lat%)', 4326) ) 
)
SELECT
  row_to_json(feature_data) 
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
            zastav_t.zastav AS zastavitelne,
            (
              SELECT
                cena 
              FROM
                cena 
            )
            AS price,
            (
              SELECT
                level 
              FROM
                noise_level 
            )
            AS noise,
            (
              SELECT
                gridvalue 
              FROM
                air_quality 
            )
            AS air_quality
        )
        AS t)) AS properties,
        ST_AsGeoJson(zastav_t.geom_new)::json AS geometry
      FROM
        zastavitelne_uzemi AS zastav_t 
      WHERE
        ST_Contains( zastav_t.geom_new, ST_GeomFromText('POINT(%lng% %lat%)', 4326) ) 
  )
  AS feature_data