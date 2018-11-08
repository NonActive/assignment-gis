const router = require('express').Router();

const { getPriceMap } = require('./geodata');

router
    .get('/', (req, res) => {
        res.status(200).json({message: 'connected!'});
    })
    .get('/geodata', getPriceMap);

module.exports = router