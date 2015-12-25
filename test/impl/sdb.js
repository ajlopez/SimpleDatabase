
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

exports['insert authors'] = function (test) {
    test.async();
    
    async()
    .then(function (data, next) {
        sdb.db('test', next);
    })
    .then(function (db, next) {
        db.table('authors', next);
    })
    .then(function (table, next) {
        table.insert([
            { name: 'Adam', age: 800 },
            { name: 'Eve', age: 700 },
            { name: 'Abel', age: 600 }
        ], next);
    })
    .then(function (insert, next) {
        insert.run(next);
    })
    .then(function (data, next) {
        test.ok(data);
        test.equal(typeof data, 'object');
        
        test.equal(data.unchanged, 0);
        test.equal(data.skipped, 0);
        test.equal(data.replaced, 0);
        test.equal(data.inserted, 3);
        test.ok(data.generated_keys);
        test.ok(Array.isArray(data.generated_keys));
        test.equal(data.generated_keys.length, 3);
        test.equal(data.errors, 0);
        test.equal(data.deleted, 0);
        
        test.done();
    })
    .run();
};

exports['retrieve authors'] = function (test) {
    test.async();
    
    async()
    .then(function (data, next) {
        sdb.db('test', next);
    })
    .then(function (db, next) {
        db.table('authors', next);
    })
    .then(function (table, next) {
        table.run(next);
    })
    .then(function (cursor, next) {
        cursor.toArray(next);
    })
    .then(function (data, next) {
        test.ok(data);
        test.ok(Array.isArray(data));
        test.equal(data.length, 3);
        
        test.deepEqual(data[0], { id: 1, name: 'Adam', age: 800 });
        test.deepEqual(data[1], { id: 2, name: 'Eve', age: 700 });
        test.deepEqual(data[2], { id: 3, name: 'Abel', age: 600 });
        
        test.done();
    })
    .run();
};

exports['filter authors by name'] = function (test) {
    test.async();
    
    async()
    .then(function (data, next) {
        sdb.db('test', next);
    })
    .then(function (db, next) {
        db.table('authors', next);
    })
    .then(function (table, next) {
        table.filter(sdb.row('name').eq('Adam'), next);
    })
    .then(function (filter, next) {
        filter.run(next);
    })
    .then(function (cursor, next) {
        cursor.toArray(next);
    })
    .then(function (data, next) {
        test.ok(data);
        test.ok(Array.isArray(data));
        test.equal(data.length, 1);
        
        test.deepEqual(data[0], { id: 1, name: 'Adam', age: 800 });
        
        test.done();
    })
    .run();
};
