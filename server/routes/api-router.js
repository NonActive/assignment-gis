const router = require('express').Router();

const { 
    getPriceMap,
    getNoise,
 } = require('./geodata');

router
    .get('/', (req, res) => {
        res.status(200).json({message: 'connected!'});
    })
    .get('/territory', getPriceMap)
    .get('/noise', getNoise);

module.exports = router