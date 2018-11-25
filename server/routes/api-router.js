const router = require('express').Router();

const { 
    getNoise,
    getAirQuality,
    getPriceMap,
    getPointInfo,
    getCityZonesOverview,
    getCityZoneById
 } = require('./geodata');

router
    .get('/', (req, res) => {
        res.status(200).json({message: 'connected!'});
    })
    .get('/noise-map', getNoise)
    .get('/air-quality', getAirQuality)
    .get('/price-map/:id', getPriceMap)
    .get('/city-zone', getCityZonesOverview)
    .get('/city-zone/:id', getCityZoneById)
    .get('/point-info', getPointInfo);

module.exports = router