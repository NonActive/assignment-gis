ALTER TABLE cenova_mapa
ADD geom_new geometry(Geometry, 4326);

UPDATE zastavitelne_uzemi SET geom_new = (ST_Dump(ST_Force2D(ST_SetSRID(geom, 4326)))).geom;

ALTER TABLE zastavitelne_uzemi
ADD geom_new geometry(Geometry, 4326);

UPDATE cenova_mapa SET geom_new = (ST_Dump(ST_Force2D(ST_SetSRID(geom, 4326)))).geom;

ALTER TABLE hlukova_mapa
ADD geom_new geometry(Geometry, 4326);

UPDATE hlukova_mapa SET geom_new = (ST_Dump(ST_Force2D(ST_SetSRID(geom, 4326)))).geom;

ALTER TABLE bonita_klimatu_mapa
ADD geom_new geometry(Geometry, 4326);

UPDATE bonita_klimatu_mapa SET geom_new = (ST_Dump(ST_Force2D(ST_SetSRID(geom, 4326)))).geom;

ALTER TABLE mestske_casti
ADD geom_new geometry(Geometry, 4326);

UPDATE mestske_casti SET geom_new = (ST_Dump(ST_Force2D(ST_SetSRID(geom, 4326)))).geom;