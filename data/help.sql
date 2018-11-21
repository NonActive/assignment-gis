select count(zastav_t.zastav) from  zastavitelne_uzemi as zastav_t group by zastav_t.zastav

select zastav_t from  zastavitelne_uzemi as zastav_t

SELECT 'FeatureCollection' AS type, array_to_json(array_agg(features_data)) AS features FROM (
	SELECT 'Feature' AS type, ST_AsGeoJson(zastav_t.geom_new)::json AS geometry, 
	row_to_json((SELECT t FROM (SELECT  zastav_t.gid) as t)) as properties   FROM  zastavitelne_uzemi as zastav_t WHERE zastav_t.zastav LIKE 'zastavitelne'
) as features_data 

SELECT ST_AsGeoJson(zastav_t.geom)   FROM  zastavitelne_uzemi as zastav_t WHERE zastav_t.zastav LIKE 'zastavitelne' limit 1

select * from  noise_level

select (ST_Dump(ST_Force2D(ST_SetSRID(cm.geom, 4326)))).geom as test from zastavitelne_uzemi as cm

select cm.geom from cenova_mapa as cm
select * from cenova_mapa as cm limit 1

SELECT 'FeatureCollection' AS type, array_to_json(array_agg(features_data)) AS features FROM (
	SELECT 'Feature' AS type, hluk_t.level AS level, 
	row_to_json((SELECT t FROM (SELECT hluk_t.level, hluk_t.id) as t)) as properties  FROM  noise_level as hluk_t 
) as features_data 

UPDATE cenova_mapa SET geom_new = (ST_Dump(ST_Force2D(ST_SetSRID(geom, 4326)))).geom

ALTER TABLE cenova_mapa
ADD geom_new geometry(Geometry,4326);

// Get polygon containing specific point
SELECT * FROM zastavitelne_uzemi zastav_t
WHERE ST_Contains(
  zastav_t.geom_new,
  ST_GeomFromText('POINT(14.243070167535926 50.103326025500046)', 4326)
)

SELECT row_to_json(feature_data) FROM (
	SELECT 'Feature' AS type, ST_AsGeoJson(zastav_t.geom_new)::json AS geometry FROM  zastavitelne_uzemi as zastav_t
		WHERE ST_Contains(
			zastav_t.geom_new, 
			ST_GeomFromText('POINT(14.243070167535926 50.103326025500046)', 4326)
		)
) AS feature_data

SELECT row_to_json(feature_data) FROM ( 
            SELECT 'Feature' AS type, ST_AsGeoJson(zastav_t.geom_new)::json AS geometry FROM  zastavitelne_uzemi as zastav_t 
                WHERE ST_Contains( 
                    zastav_t.geom_new,  
                    ST_GeomFromText('POINT(14.243070167535926 50.103326025500046)', 4326) 
                ) 
        ) AS feature_data

