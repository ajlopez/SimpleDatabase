
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

exports['Create table'] = function (test) {
    test.async();
    
    async()
    .exec(function (next) { sdb.db('test').tableCreate('users').run(connection, next); })
    .exec(function (data, next) {
        test.ok(data);
        test.equal(typeof data, 'object');
        
        test.ok(data.config_changes);
        test.ok(Array.isArray(data.config_changes));
        test.ok(data.tables_created);
        test.equal(data.tables_created, 1);
        
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
