SELECT
  mc.gid,
  mc.nazev_1 AS name,
  (
    SELECT
      round(AVG(bk.gridvalue), 2) 
    FROM
      bonita_klimatu_mapa AS bk 
    WHERE
      ST_Intersects(mc.geom, bk.geom) 
  )
  AS air_quality,
  (
    SELECT
      round(AVG(nl.level), 2) 
    FROM
      noise_level AS nl 
    WHERE
      ST_Intersects(mc.geom_new, nl.geom) 
  )
  AS noise_level,
  (
    SELECT
      round(AVG(cm.cena::integer), 2) 
    FROM
      cenova_mapa AS cm 
    WHERE
      cm.cena NOT LIKE 'N' 
      AND ST_Intersects(mc.geom, cm.geom) 
  )
  AS price 
FROM
  mestske_casti mc