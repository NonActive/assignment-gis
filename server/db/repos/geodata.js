'use strict'

class GeodataRepository {
    constructor(db, pgp) {
        this.db = db;
        this.pgp = pgp; 
    }

    get() {
         return this.db.any('SELECT * FROM new_table as ts LIMIT 2');
    }
}

module.exports = GeodataRepository;