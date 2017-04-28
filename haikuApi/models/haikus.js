'use strict';
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

module.exports.getAll = (cb) => {

    knex.queryBuilder()
        .select('*')
        .from('haikus')
        .column(knex.raw(dateFormat))
        .asCallback((err, allHaikus) => {
            cb(null, allHaikus);
        });

};

module.exports.save = (haikuSave, cb) => {
    knex.queryBuilder()
        .insert(haikuSave)
        .into('haikus')
        .asCallback(cb);
};
