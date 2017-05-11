'use strict';

const async = require('async');
const moment = require('moment');
const knex = require('../lib/knex');

const releaseDateFormat = "to_char(year_of_release, 'YYYY-MM-DD') as year_of_release";
const uploadDateFormat = "to_char(date_uploaded, 'YYYY-MM-DD') as date_uploaded";
const datesToFormat = [releaseDateFormat, uploadDateFormat];
const dateFormat = datesToFormat.join(', ');

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

module.exports.getAll = (opts, cb) => {
    let limit;
    let offset;

    if (!cb) {
        cb = opts;
    }

    limit = opts.perPage || 10;
    offset = (opts.page - 1) * limit || 0;

    knex.queryBuilder()
        .select('*')
        .from('haikus')
        .column(toChar('date_uploaded'), toChar('year_of_release'))
        .limit(limit)
        .offset(offset)
        .asCallback((err, allHaikus) => {
            if (err) return cb(err);
            cb(null, allHaikus);
        });

};

module.exports.get = (haikuId, cb) => {
    knex.queryBuilder()
        .select('*')
        .from('haikus')
        .where({
            id: haikuId
        })
        .column(knex.raw(dateFormat))
        .asCallback((err, haiku) => {
            if (err) return cb(err);

            cb(null, haiku);
        });
};

module.exports.getAllAuthors = (cb) => {
    const lastActive = toChar('max(date_uploaded)', 'last_active');

    knex.queryBuilder()
        .select('author', lastActive)
        .count('author as haikus')
        .from('haikus')
        .groupBy('author')
        .asCallback((err, allAuthors) => {
            if (err) return cb(err);

            async.map(allAuthors, lastActiveFormat, (err, results) => {
                if (err) return cb(err);
                cb(null, results);
            });
        });
};

function lastActiveFormat(eachAuthor, cb) {
    cb(null, Object.assign({}, eachAuthor, {
        last_active: moment(eachAuthor.last_active).fromNow()
    }));
};

function toChar(valueToChar, nameOfChar) {
    if (!nameOfChar) {
        nameOfChar = valueToChar;
    }

    return knex.raw(`to_char(${valueToChar}, 'YYYY-MM-DD') as ${nameOfChar}`)
}
