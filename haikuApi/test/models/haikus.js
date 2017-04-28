'use strict';

const assert = require('assert');
const async = require('async');
const fs = require('fs');

const knex = require('../../lib/knex');
const haikus = require('../../models/haikus');
const knexStub = require('../knexStub');
const createSchema = fs.readFileSync('./sql/createSchema.sql').toString();

const releaseDateFormat = "to_char(year_of_release, 'YYYY-MM-DD') as year_of_release";
const uploadDateFormat = "to_char(date_uploaded, 'YYYY-MM-DD') as date_uploaded";
const datesToFormat = [releaseDateFormat, uploadDateFormat];
const dateFormat = datesToFormat.join(', ');

const haiku1 = {
    id: 'haiku1',
    title: 'Silence',
    author: 'Basho Matsuo',
    text: 'An old silent pond... A frog jumps into the pond, splash! Silence again.',
    year_of_release: '1600-01-01',
    date_uploaded: '2017-04-21'
};
const haiku2 = {
    id: 'haiku2',
    title: 'Silence',
    author: 'Basho Matsuo',
    text: 'An old silent pond... A frog jumps into the pond, splash! Silence again.',
    year_of_release: '1600-01-01',
    date_uploaded: '2017-04-21'
};

const haiku3 = {
    id: 'haiku3',
    title: 'Snail',
    author: 'Kobayashi Issa',
    text: 'O snail Climb Mount Fuji, But slowly, slowly!',
    year_of_release: '1700-01-01',
    date_uploaded: '2017-04-21'
};

describe('haikus', () => {
    beforeEach((done) => {
        async.series([
            function flush(cb) {
                knex.schema
                    .raw(createSchema)
                    .asCallback(cb);
            },
            function insertHaiku(cb) {
                knex.queryBuilder()
                    .insert([haiku1, haiku2])
                    .into('haikus')
                    .asCallback(cb);
            }
        ], done);
    });
    afterEach(() => {
        knexStub.restore();
    });
    describe('.getAll', () => {
        const haikusGetAll = [haiku1, haiku2];
        it('gets all the haikus', (done) => {
            haikus.getAll((err, allHaikus) => {
                assert.ifError(err);
                assert.deepEqual(allHaikus, haikusGetAll);
                done();
            });
        });
    });

    describe('.save', () => {
        it('saves a haiku to the database', (done) => {
            async.series([
                function saveHaiku(cb) {
                    haikus.save(haiku3, cb);
                },
                function checkSaved(cb) {
                    knex.queryBuilder()
                        .where({
                            id: 'haiku3'
                        })
                        .select('*')
                        .from('haikus')
                        .column(knex.raw(dateFormat))
                        .asCallback((err, savedHaiku) => {
                            assert.ifError(err);
                            assert.deepEqual(savedHaiku, [haiku3]);
                            cb();
                        });
                }
            ], done);
        });
    });
});
