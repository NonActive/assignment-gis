const db = require('../db');

let getCityZonesOverview = ((req, res) => {
    db.GeodataRepository.getCityZonesOverview().then((results) => {
        const data = results;

        return res.status(200).send(data)
    }).catch(err => {
        return sendError(res, err.message);
    });
});

let getCityZoneById = ((req, res) => {
    const zoneId = req.params.id;
    
    db.GeodataRepository.getCityZone(zoneId).then((results) => {
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

let getAirQuality = ((req, res) => {
    db.GeodataRepository.getAirQuality().then((results) => {
        const data = results;

        return res.status(200).send(data)
    }).catch(err => {
        return sendError(res, err.message);
    });
});

let getPriceMap = ((req, res) => {
    const zoneId = req.params.id;

    db.GeodataRepository.getPriceMap(zoneId).then((results) => {
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

function sendError(res, err) {
    return res.status(500).send({
        status: 500,
        message: err
    });
};

module.exports = {
    getNoise,
    getPointInfo,
    getPriceMap,
    getCityZonesOverview,
    getCityZoneById,
    getAirQuality
}