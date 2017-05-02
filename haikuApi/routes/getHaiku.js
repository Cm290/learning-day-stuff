'use strict';

const router = require('express').Router();

const haikus = require('../models/haikus');

router.get('/', (req, res) => {
    const haikuId = req.params.haikuId;
    haikus.get(haikuId, (err, haiku) => {
        res.json(haiku);
    });
});

module.exports = router;
