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
      round(AVG((nl.db_lo + nl.db_hi) / 2), 2) 
    FROM
      hlukova_mapa_den AS nl 
    WHERE
      ST_Intersects(mc.geom, nl.geom) 
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