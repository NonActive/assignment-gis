const db = require('../db');

var getPriceMap = ((req, res) => {
    db.GeodataRepository.get().then((results) => {

        return res.status(200).send(JSON.stringify({
             'geom': results[0].geom
        }));
    });
});

module.exports = {
    getPriceMap
}