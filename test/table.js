
var sdb = require('../');

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

exports['create database'] = function (test) {
    test.async();
    
    sdb.dbCreate('warehouse').run(connection, function (err, data) {
        test.ok(!err);
        test.ok(data);
        test.done();
    });
};

exports['create table'] = function (test) {
    test.async();
    
    async()
    .exec(function (next) { sdb.db('warehouse').tableCreate('employees').run(connection, next); })
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

exports['create another table'] = function (test) {
    test.async();
    
    async()
    .exec(function (next) { sdb.db('warehouse').tableCreate('products').run(connection, next); })
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

exports['list tables'] = function (test) {
    var db = getDb();
	db.tableCreate('customers').run();
	db.tableCreate('suppliers').run();
    var query = db.tableList().run();
    
    query.collect(function (results) {
        test.ok(results.indexOf('customers') >= 0);
        test.ok(results.indexOf('suppliers') >= 0);
    });

	test.done();
};