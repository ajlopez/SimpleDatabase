
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
    .exec(function (next) { sdb.db('test').tableCreate('customers').run(connection, next); })
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

exports['insert and retrieve an invariant document'] = function (test) {
    test.async();
    
    var doc = { name: 'Adam' };
    
    async()
    .exec(function (next) {
        sdb
        .db('test')
        .table('customers')
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
        
        test.ok(doc.id === undefined);
        doc.name = 'New Adam';

        sdb
        .db('test')
        .table('customers')
        .get(1)
        .run(connection, next);
    })
    .then(function (result, next) {
        test.ok(result);
        test.equal(result.id, 1);
        test.equal(result.name, 'Adam');

        test.done();
    });
};

exports['insert and get invariant document with array values'] = function (test) {
    test.async();
    
    var doc = { name: 'Adam', values: [1,2,3] };
    
    async()
    .exec(function (next) {
        sdb
        .db('test')
        .table('customers')
        .insert(doc)
        .run(connection, next);
    })
    .then(function (result, next) {
        test.ok(result);
        test.equal(result.inserted, 1);
        test.equal(result.errors, 0);
        test.ok(result.generated_keys);
        test.equal(result.generated_keys.length, 1);
        test.equal(result.generated_keys[0], 2);
        
        test.ok(doc.id === undefined);
        doc.name = 'New Adam';
        doc.values.push(4);

        sdb
        .db('test')
        .table('customers')
        .get(2)
        .run(connection, next);
    })
    .then(function (result, next) {
        test.ok(result);
        test.equal(result.id, 2);
        test.equal(result.name, 'Adam');
        test.equal(result.values.length, 3);
        test.deepEqual(result.values, [1,2,3]);

        test.done();
    });
};

exports['insert and get an invariant document with nested document'] = function (test) {
    test.async();
    
    var doc = { name: 'Adam', wife: { name: 'Eve' } };
    
    async()
    .exec(function (next) {
        sdb
        .db('test')
        .table('customers')
        .insert(doc)
        .run(connection, next);
    })
    .then(function (result, next) {
        test.ok(result);
        test.equal(result.inserted, 1);
        test.equal(result.errors, 0);
        test.ok(result.generated_keys);
        test.equal(result.generated_keys.length, 1);
        test.equal(result.generated_keys[0], 3);
        
        test.ok(doc.id === undefined);
        doc.name = 'New Adam';
        doc.wife.name = 'Lilith';

        sdb
        .db('test')
        .table('customers')
        .get(3)
        .run(connection, next);
    })
    .then(function (result, next) {
        test.ok(result);
        test.equal(result.id, 3);
        test.equal(result.name, 'Adam');
        test.equal(result.wife.name, 'Eve');

        test.done();
    });
};

