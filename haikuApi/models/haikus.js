'use strict';

const async = require('async');
const knex = require('../lib/knex');

const releaseDateFormat = "to_char(year_of_release, 'YYYY-MM-DD') as year_of_release";
const uploadDateFormat = "to_char(date_uploaded, 'YYYY-MM-DD') as date_uploaded";
const datesToFormat = [releaseDateFormat, uploadDateFormat];
const dateFormat = datesToFormat.join(', ');
// knex.queryBuilder()
//     .select('*')
//     .from('haikus')
//     .asCallback((err, rows) => {
//         if (err) return next(err);
//         res.send(rows);
//     });

function deleteHaiku(id, trx, cb) {
    if (!cb) {
        cb = trx;
        trx = knex;
    }

    trx.queryBuilder()
        .del()
        .from('haikus')
        .where({
            id
        })
        .asCallback((err, results) => {
            if (err) return cb(err);

            const created = results ? false : true;
            cb(null, created);
        });
};

function saveHaiku(haikuSave, trx, cb) {
    if (!cb) {
        cb = trx;
        trx = knex;
    }
    trx.queryBuilder()
        .insert(haikuSave)
        .into('haikus')
        .asCallback(cb);
};

module.exports.getAll = (cb) => {

    knex.queryBuilder()
        .select('*')
        .from('haikus')
        .column(knex.raw(dateFormat))
        .asCallback((err, allHaikus) => {
            if (err) return cb(err);
            cb(null, allHaikus);
        });

};

module.exports.save = (haikuSave, cb) => {
    const haikuId = haikuSave.id;
    knex.transaction((trx) => {
        async.series({
            deleteHaiku: async.apply(deleteHaiku, haikuId, trx),
            saveHaiku: async.apply(saveHaiku, haikuSave, trx)
        }, (err, results) => {
            if (err) return trx.rollback(err);

            const created = results.deleteHaiku;
            trx.commit(created);
        });
    }).asCallback(cb);
};

module.exports.delete = (haikuDelete, cb) => {
    const haikuId = haikuDelete.id;
    deleteHaiku(haikuId, cb);
};

module.exports.get = (cb) => {
    cb();
};
