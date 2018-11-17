const db = require('../db');

var getNoise = ((req, res) => {
    db.GeodataRepository.getTest().then((results) => {
        console.log(results);
        const data = results[0]['row_to_json'];

        return res.status(200).send(data)
    });
});

var getPriceMap = ((req, res) => {
    db.GeodataRepository.getTerritory().then((results) => {
        const data = results[0];

        return res.status(200).send(data);
    });
});

module.exports = {
    getPriceMap,
    getNoise
}