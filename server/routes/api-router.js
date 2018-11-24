const router = require('express').Router();

const { 
    getPriceMap,
    getNoise,
    getPointInfo,
    getCityZonesOverview
 } = require('./geodata');

router
    .get('/', (req, res) => {
        res.status(200).json({message: 'connected!'});
    })
    .get('/territory', getPriceMap)
    .get('/noise-map', getNoise)
    .get('/city-zones', getCityZonesOverview)
    .get('/point-info', getPointInfo);

module.exports = router