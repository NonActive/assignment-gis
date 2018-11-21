SELECT 'FeatureCollection' AS type, array_to_json(array_agg(features_data)) AS features FROM (
	SELECT 'Feature' AS type, hluk_t.db_hi AS level, ST_AsGeoJson(hluk_t.geom)::json AS geometry  FROM  hlukova_mapa as hluk_t
) as features_data 

--create noise table and import data
CREATE TABLE noise_level(
	id serial primary key,
	level integer,
	geojson_str text,
	geom geometry(Geometry,4326)
);

COPY noise_level(level, geojson_str) FROM '/srv/git/assignment-gis/data/noise.csv' DELIMITER ';' QUOTE '''' CSV;
UPDATE noise_level SET geom = ST_SetSRID(ST_GeomFromGeoJSON(geojson_str), 4326);

CREATE INDEX noise_level_index ON noise_level USING gist (geom) WITH (fillfactor=100);