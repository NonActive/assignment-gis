SELECT
  'Feature' AS type,
  ST_AsGeoJSON(mc.geom)::json AS geometry,
  row_to_json((
  SELECT
    t 
  FROM
    (
      SELECT
          mc.nazev_1 AS name
    )
    AS t)) AS properties 
  FROM
    mestske_casti AS mc 
  WHERE
    mc.gid = %zoneId%
