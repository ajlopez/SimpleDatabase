
var sdb = require('../');
var async = require('simpleasync');

var connection;

exports['get connection'] = function (test) {
    test.async();
    
    sdb.connection(function (err, conn) {
        test.ok(!err);
        test.ok(conn);
        
        test.equal(typeof conn, 'object');
        
        connection = conn;
        
        test.done();
    });
};

exports['create table'] = function (test) {
    test.async();
    
    async()
    .exec(function (next) { sdb.db('test').tableCreate('persons').run(connection, next); })
    .then(function (data, next) {
        test.ok(data);
        test.equal(typeof data, 'object');
        
        test.ok(data.config_changes);
        test.ok(Array.isArray(data.config_changes));
        test.ok(data.tables_created);
        test.equal(data.tables_created, 1);
        
        test.done();
    });
}

exports['insert document'] = function (test) {
    test.async();
    
    var doc = { name: 'Adam' };
    
    async()
    .exec(function (next) {
        sdb
        .db('test')
        .table('persons')
        .insert(doc)
        .run(connection, next);
    })
    .then(function (result, next) {
        test.ok(result);
        test.equal(result.inserted, 1);
        test.equal(result.errors, 0);
        test.ok(result.generated_keys);
        test.equal(result.generated_keys.length, 1);
        test.equal(result.generated_keys[0], 1);

        test.done();
    })
};

exports['insert an array with two documents'] = function (test) {
    test.async();
    
    var docs = [{ name: 'Adam' }, {name : 'Eve'}];
    
    async()
    .exec(function (next) {
        sdb
        .db('test')
        .table('persons')
        .insert(docs)
        .run(connection, next);
    })
    .then(function (result, next) {
        test.ok(result);
        test.equal(result.inserted, 2);
        test.equal(result.errors, 0);
        test.ok(result.generated_keys);
        test.equal(result.generated_keys.length, 2);
        test.equal(result.generated_keys[0], 2);
        test.equal(result.generated_keys[1], 3);

        test.done();
    })
};

