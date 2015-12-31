
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
    .exec(function (next) { sdb.db('test').tableCreate('users').run(connection, next); })
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

exports['Insert documents'] = function (test) {
    test.async();
    
    async()
    .exec(function (next) { 
        sdb.db('test')
        .table('users')
        .insert([
            { name: 'Adam', age: 800 },
            { name: 'Eve', age: 700 }
        ])
        .run(connection, next);
    })
    .then(function (data, next) {
        test.ok(data);
        test.equal(typeof data, 'object');
        
        test.equal(data.unchanged, 0);
        test.equal(data.skipped, 0);
        test.equal(data.replaced, 0);
        test.equal(data.inserted, 2);
        test.ok(data.generated_keys);
        test.ok(Array.isArray(data.generated_keys));
        test.equal(data.generated_keys.length, 2);
        test.equal(data.errors, 0);
        test.equal(data.deleted, 0);
        
        test.done();
    });
}

exports['Cursor of one Document'] = function (test) {
	var table = getTable();
    table.insert({ name: 'Adam', age: 800 }).run();
    var cursor = table.run();
    var total = 0;
    
    cursor.next(function (document) {
        total += document.age;
        return true;
    });
    
	test.equal(total, 800);    
    
	test.done();
};

exports['Cursor of Two Documents'] = function (test) {
	var table = getTable();
    table.insert([{ name: 'Adam', age: 800 }, { name: 'Eve', age: 600 }]).run();
    var cursor = table.run();
    var total = 0;
    
    cursor.next(function (document) {
        total += document.age;
        return true;
    });
    
	test.equal(total, 1400);    
    
	test.done();
};

exports['Cursor returns Copy of Documents'] = function (test) {
	var table = getTable();
    table.insert([{ name: 'Adam', age: 800 }, { name: 'Eve', age: 600 }]).run();
    var cursor = table.run();
    var total = 0;
    
    cursor.next(function (document) {
        total += document.age;
        document.age += 1000;
        return true;
    });

    var cursor2 = table.run();
    var total2 = 0;
    
    cursor2.next(function (document) {
        total2 += document.age;
        return true;
    });
    
	test.equal(total, 1400);    
	test.equal(total2, 1400);    
    
	test.done();
};
