'use strict'

const sql = require('../sql');

class GeodataRepository {
    constructor(db, pgp) {
        this.db = db;
        this.pgp = pgp;
    }

    getCityZonesOverview() {
        return sql.initQuery('city.zones').then(query => {
            return this.db.any(query);
        }).catch(err => {
            console.log('DB error: ', err);
        });;
    }

    getTerritory() {
        return sql.initQuery('territory.area').then(query => {
            return this.db.any(query)
        }).catch(err => {
            console.log('DB error: ', err);
        });
    }

    getNoise() {
        return sql.initQuery('noise.map').then(query => {
            return this.db.one(query)
        }).catch(err => {
            console.log('DB error: ', err);
            return err;
        });
    }

    getPointInfo(point) {
        return sql.initQuery('point.info', {
            lng: point[0],
            lat: point[1]
        }).then(query => {
            return this.db.one(query)
        }).catch(err => {
            console.log('DB error: ', err);
            return err;
        });
    }
}

module.exports = GeodataRepository;