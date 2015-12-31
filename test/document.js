
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

exports['Insert and Get an Invariant Document with Array Values'] = function (test) {
    var table = getTable();
    var doc = { name: 'Adam', values: [1,2,3] };
	var result = table.insert(doc).run();

	test.ok(result);
    test.equal(result.inserted, 1);
    test.equal(result.errors, 0);
    test.ok(result.keys);
    test.equal(result.keys.length, 1);
    test.equal(result.keys[0], 1);
    
    test.ok(doc.id === undefined);
    
    doc.name = 'New Adam';
    doc.values.push(4);
    
    var newdoc = table.get(1).run();
    
    test.ok(newdoc);
    test.equal(newdoc.id, 1);
    test.equal(newdoc.name, 'Adam');
    test.equal(newdoc.values.length, 3);
    test.deepEqual(newdoc.values, [1,2,3]);

	test.done();
};

exports['Insert and Get an Invariant Document with Nested Document'] = function (test) {
    var table = getTable();
    var doc = { name: 'Adam', wife: { name: 'Eve' } };
	var result = table.insert(doc).run();

	test.ok(result);
    test.equal(result.inserted, 1);
    test.equal(result.errors, 0);
    test.ok(result.keys);
    test.equal(result.keys.length, 1);
    test.equal(result.keys[0], 1);
    
    test.ok(doc.id === undefined);
    
    doc.name = 'New Adam';
    doc.wife.name = 'Lilith';
    
    var newdoc = table.get(1).run();
    
    test.ok(newdoc);
    test.equal(newdoc.id, 1);
    test.equal(newdoc.name, 'Adam');
    test.equal(newdoc.wife.name, 'Eve');

	test.done();
};

exports['Get a Copy of a Document'] = function (test) {
    var table = getTable();
    var doc = { name: 'Adam' };
	table.insert(doc).run();
    
    var doc = table.get(1).run();
    
    test.equal(doc.name, 'Adam');
    doc.name = 'New Adam';
    
    var doc2 = table.get(1).run();
    test.equal(doc.name, 'New Adam');
    test.equal(doc2.name, 'Adam');

	test.done();
};
