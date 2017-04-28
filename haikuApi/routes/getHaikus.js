'use strict';

const express = require('express');
const router = require('express').Router();
const haikus = require('../models/haikus');

router.get('/', (req, res, next) => {
    haikus.getAll((err, allHaikus) => {
        if (err) {
            return next(err)
        };
        res.json(allHaikus);
    });
});

module.exports = router;
