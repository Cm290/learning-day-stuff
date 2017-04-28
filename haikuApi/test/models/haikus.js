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

function createHaiku(id) {
    const haiku = Object.assign({}, haiku1, {
        id
    });
    return haiku;
};

const haikusGetAll = [haiku1, createHaiku('haiku2')];

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
                    .insert(haikusGetAll)
                    .into('haikus')
                    .asCallback(cb);
            }
        ], done);
    });
    afterEach(() => {
        knexStub.restore();
    });
    describe('.getAll', () => {
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
            const haiku3 = createHaiku('haiku3');

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
