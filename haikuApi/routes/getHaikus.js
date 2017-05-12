'use strict';

const router = require('express').Router();
const haikus = require('../models/haikus');

router.get('/haikus', (req, res, next) => {
    const page = req.query.page || "1";
    const perPage = req.query.perPage || "10";

    const opts = {
        page,
        perPage
    };
    haikus.getAll(opts, (err, allHaikus) => {
        if (err) {
            return next(err)
        };
        res.json({
            page,
            perPage,
            results: allHaikus
        });
    });
});

module.exports = router;
