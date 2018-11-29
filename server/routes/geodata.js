'use strict'

const db = require('../db');

const  CZK_TO_EUR = 0.039;

function converCzkToEur(value) {
    if (!isNaN(value))
        return Math.floor((value * CZK_TO_EUR) * 100) / 100;
    return value;
}

let getCityZonesOverview = ((req, res) => {
    db.GeodataRepository.getCityZonesOverview().then((results) => {
        const data = results.map(o => {
            o.price = converCzkToEur(o.price);
            return o;
        });

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
        let data = results;

        let features = data.features;
        
        data.features = features.map(o => {
            o.properties.price = converCzkToEur(o.properties.price);
            o.properties.min = converCzkToEur(o.properties.min);
            o.properties.max = converCzkToEur(o.properties.max);
            return o;
        });

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

        let pointInfo = results['row_to_json'];

        if (pointInfo.properties.price) {
            pointInfo.properties.price = converCzkToEur(pointInfo.properties.price);
        }

        data['point-info'] = pointInfo;

        db.GeodataRepository.findGreenAreasWithinDistance(point, 500).then(results => {
            data['parks'] = results;

            return res.status(200).send(data);
        })
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