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

function generateHaiku(id) {
    const haiku = Object.assign({}, haiku1, {
        id
    });
    return haiku;
};
const haiku2 = generateHaiku('haiku2');
const haikusGetAll = [haiku1, generateHaiku('haiku2')];

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
        it('gets all the haikus', (done) => {
            haikus.getAll((err, allHaikus) => {
                assert.ifError(err);
                assert.deepEqual(allHaikus, [haiku1, haiku2]);
                done();
            });
        });
    });

    describe('.save', () => {
        it('saves a haiku to the database', (done) => {
            const haiku3 = generateHaiku('haiku3');

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

        it('returns true when a new haiku is added', (done) => {
            const haiku3 = generateHaiku('haiku3');

            haikus.save(haiku3, (err, created) => {
                assert.ifError(err);
                assert.equal(created, true);
                done();
            })
        });

        it('updates a haiku already in the database', (done) => {
            const updateHaiku2 = Object.assign({}, haiku2, {
                author: 'Some other author'
            });

            async.series([
                function updateHaiku(cb) {
                    haikus.save(updateHaiku2, cb);
                },
                function checkSaved(cb) {
                    knex.queryBuilder()
                        .where({
                            id: 'haiku2'
                        })
                        .select('*')
                        .from('haikus')
                        .column(knex.raw(dateFormat))
                        .asCallback((err, updatedHaiku) => {
                            assert.ifError(err);
                            assert.deepEqual(updatedHaiku, [updateHaiku2]);
                            cb();
                        });
                }
            ], done);
        });

        it('returns false when a haiku is updated', (done) => {
            const updateHaiku2 = Object.assign({}, haiku2, {
                author: 'Some other author'
            });

            haikus.save(updateHaiku2, (err, created) => {
                assert.ifError(err);
                assert.equal(created, false);
                done();
            })
        });

    });

    describe('.delete', () => {
        it('deletes a haiku from the database', (done) => {

            async.series([
                function saveHaiku(cb) {
                    haikus.delete(haiku2, cb);
                },
                function checkSaved(cb) {
                    knex.queryBuilder()
                        .select('*')
                        .from('haikus')
                        .column(knex.raw(dateFormat))
                        .asCallback((err, remainingHaikus) => {
                            assert.ifError(err);
                            assert.deepEqual(remainingHaikus, [haiku1]);
                            cb();
                        });
                }
            ], done);
        });

        it('does not give an error when the haiku to delete doesn\'t exist', (done) => {
            const haiku4 = generateHaiku('haiku4');
            async.series([
                function saveHaiku(cb) {
                    haikus.delete(haiku4, cb);
                },
                function checkSaved(cb) {
                    knex.queryBuilder()
                        .select('*')
                        .from('haikus')
                        .column(knex.raw(dateFormat))
                        .asCallback((err, remainingHaikus) => {
                            assert.ifError(err);
                            assert.deepEqual(remainingHaikus, [haiku1, haiku2]);
                            cb();
                        });
                }
            ], done);
        });
    });
});
