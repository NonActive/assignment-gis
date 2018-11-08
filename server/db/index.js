const promise = require('bluebird');
const repos = require('./repos');

const initOptions = {
    // Use a custom promise library, instead of the default ES6 Promise
    promiseLib: promise,

    extend(obj, dc) {
        obj.GeodataRepository = new repos.GeodataRepository(obj, pgp);
    }
}

const pgp = require('pg-promise')(initOptions);

// TODO move database config to separate file
const connectionConfig = {
    host: 'localhost',
    port: 5432,
    database: 'pdt-postgis',
    user: 'postgres',
    password: 'postgres'
}

// Load and initialize pg-promise:
const db = pgp(connectionConfig);

module.exports = db;
