const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const router = express.Router();
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');
const Bear = require('./models/bear');

mongoose.connect('mongodb://localhost/myappdatabase');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

router.use((req, res, next) => {
    console.log('A thing happened');
    next();
});

router.get('/', (req, res) => {
    res.json({
        message: 'hooray! welcome to our api!'
    });
});

router.route('/bears')
    .post((req, res) => {
        if (req.body.length === 0)
            return res.json({
                message: 'No Bear'
            });
        var bear = new Bear();

        bear.name = req.body.name;

        bear.save((err) => {
            if (err)
                res.send(err);

            res.json({
                message: 'Bear successfully made'
            });
        })
    })
    .get((req, res) => {
        Bear.find((err, bears) => {
            if (err) res.send(err);
            res.json(bears);
        })
    })

router.route('/bears/:bear_id')
    .get((req, res) => {
        Bear.findById(req.params.bear_id, (err, bear) => {
            if (err) res.send(err);
            res.json(bear);
        })
    })
    .put((req, res) => {
        Bear.findById(req.params.bear_id, (err, bear) => {
            if (err) res.send(err);

            bear.name = req.body.name;

            bear.save((err) => {
                if (err) res.send(err);
                res.json({
                    message: 'Bear updated'
                });
            })

        })
    })
    .delete((req, res) => {
        Bear.remove({
            _id: req.params.bear_id
        }, (err, bear) => {
            if (err) res.send(err);
            res.json({
                message: 'Successfully deleted'
            });
        })
    })

app.use('/api', router);
app.listen(port);
console.log('Magic happens on port ' + port);
