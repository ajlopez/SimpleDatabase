
var sdb = require('..');

var connection;

exports['get connection'] = function (test) {
    test.async();
    
    sdb.connection(function (err, data) {
        test.ok(!err);
        test.ok(data);
        connection = data;
        test.done();
    });
};

exports['get database'] = function (test) {
    test.async();
    
    sdb.db('test').run(connection, function (err, data) {
        test.ok(!err);
        test.ok(data);
        test.done();
    });
};

exports['create database'] = function (test) {
    test.async();
    
    sdb.dbCreate('sales').run(connection, function (err, data) {
        test.ok(!err);
        test.ok(data);
        test.done();
    });
};