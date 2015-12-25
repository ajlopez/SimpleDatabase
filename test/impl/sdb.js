
var sdb = require('../../lib/impl/sdb');
var async = require('simpleasync');

exports['get test db'] = function (test) {
    test.async();
    
    async()
    .then(function (data, next) {
        sdb.db('test', next);
    })
    .then(function (data, next) {
        test.ok(data);
        test.equal(typeof data, 'object');
        test.done();
    })
    .run();
};

exports['create author table'] = function (test) {
    test.async();
    
    async()
    .then(function (data, next) {
        sdb.db('test', next);
    })
    .then(function (db, next) {
        db.createTable('authors', next);
    })
    .then(function (table, next) {
        table.run(next);
    })
    .then(function (data, next) {
        test.ok(data);
        test.equal(typeof data, 'object');
        
        test.ok(data.config_changes);
        test.ok(Array.isArray(data.config_changes));
        test.ok(data.tables_created);
        test.equal(data.tables_created, 1);
        
        test.done();
    })
    .run();
};

exports['create existing author table'] = function (test) {
    test.async();
    
    async()
    .then(function (data, next) {
        sdb.db('test', next);
    })
    .then(function (db, next) {
        db.createTable('authors', next);
    })
    .then(function (table, next) {
        table.run(next);
    })
    .then(function (data, next) {
        test.ok(data);
        test.equal(typeof data, 'object');
        
        test.ok(data.config_changes);
        test.ok(Array.isArray(data.config_changes));
        test.equal(data.tables_created, 0);
        
        test.done();
    })
    .run();
};

