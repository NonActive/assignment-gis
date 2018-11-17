'use strict'

class GeodataRepository {
    constructor(db, pgp) {
        this.db = db;
        this.pgp = pgp; 
    }

    getTerritory() {
        return this.db.any('SELECT \'FeatureCollection\' AS type, array_to_json(array_agg(features_data)) AS features FROM(\
            SELECT \'Feature\' AS type, ST_AsGeoJson(zastav_t.geom_new)::json AS geometry, row_to_json((SELECT t FROM (SELECT  zastav_t.gid) as t)) as properties FROM  zastavitelne_uzemi as zastav_t WHERE zastav_t.zastav LIKE \'zastavitelne\' LIMIT 100 \
        ) as features_data ');
    }

    getNoise() {
        return this.db.any('SELECT \'FeatureCollection\' AS type, array_to_json(array_agg(features_data)) AS features FROM (SELECT \'Feature\' AS type, hluk_t.db_hi AS level, ST_AsGeoJson(hluk_t.geom)::json AS geometry  FROM  hlukova_mapa as hluk_t) as features_data ')
    }

    getTest() {
        return this.db.any('SELECT row_to_json(feature_data) FROM ( \
            SELECT \'Feature\' AS type, ST_AsGeoJson(zastav_t.geom_new)::json AS geometry FROM  zastavitelne_uzemi as zastav_t \
                WHERE ST_Contains( \
                    zastav_t.geom_new,  \
                    ST_GeomFromText(\'POINT(14.243070167535926 50.103326025500046)\', 4326) \
                ) \
        ) AS feature_data');
    }
}

module.exports = GeodataRepository;