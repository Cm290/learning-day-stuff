'use strict';

const router = require('express').Router();
const haikus = require('../models/haikus');

router.get('/haikus/authors', (req, res, next) => {
    const page = req.query.page || '1';
    const perPage = req.query.perPage || '10';

    const opts = {
        page,
        perPage
    };

    haikus.getAllAuthors(opts, (err, allAuthors) => {
        if (err) return next(err);
        res.json({
            page,
            perPage,
            results: allAuthors
        });
    });
});

module.exports = router;
