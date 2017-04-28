'use strict';

const express = require('express');
const app = express();
const index = require('./routes/index');
const path = require('path');
const getHaikus = require('./routes/getHaikus');
const putHaikus = require('./routes/putHaikus');
const bodyParser = require('body-parser');

function errorHandler(err, req, res, next) {
    if (err.isBoom) {
        const error = err.output.payload;
        res.status(error.statusCode || 500);
        res.json({
            message: error.message,
            error: error.error
        })
    } else {
        res.status(err.status || 500);
        res.json({
            message: err.message,
            error: err
        });
    };
};

app.use(bodyParser.json());
app.use('/', index);
app.use('/haikus', getHaikus);
app.use('/haikus/:haikusId', putHaikus);
app.use(express.static(path.join(__dirname, 'public')));
app.use(errorHandler);

const server = app.listen(3000, function() {
    console.log('Example app listening on port 3000!')
});

module.exports = server;
