const db = require('../db');

let getCityZonesOverview = ((req, res) => {
    db.GeodataRepository.getCityZonesOverview().then((results) => {
        const data = results;

        return res.status(200).send(data)
    }).catch(err => {
        return sendError(res, err.message);
    });
});

let getNoise = ((req, res) => {
    db.GeodataRepository.getNoise().then((results) => {
        const data = results;

        return res.status(200).send(data)
    }).catch(err => {
        return sendError(res, err.message);
    });
});

let getPointInfo = ((req, res) => {
    let point = req.query.point;

    db.GeodataRepository.getPointInfo(point).then(results => {
        let data = {};

        if (!results['row_to_json'])
            return res.status(200).send(results)

        data = results['row_to_json'];
        return res.status(200).send(data)
    }).catch(err => {
        return sendError(res, err.message);
    });
});

let getPriceMap = ((req, res) => {
    db.GeodataRepository.getTerritory().then((results) => {
        const data = results[0];

        return res.status(200).send(data);
    });
});

function sendError(res, err) {
    return res.status(500).send({
        status: 500,
        message: err
    });
};

module.exports = {
    getPriceMap,
    getNoise,
    getPointInfo,
    getCityZonesOverview
}