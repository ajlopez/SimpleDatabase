
var sdb = require('../');

exports['Create Database'] = function (test) {
	sdb.dbCreate('test').run();
    var db = sdb.db('test');
	test.ok(db);
	test.done();
};

exports['Create and Get Database'] = function (test) {
	sdb.dbCreate('test').run();

	var db = sdb.db('test').run();
    var db2 = sdb.db('test').run();
    
    test.ok(db === db2);

	test.done();
};

exports['Create and List Databases'] = function (test) {
	sdb.dbCreate('test').run();
	sdb.dbCreate('sales').run();

    var query = sdb.dbList().run();
    
    query.collect(function (results) {
        test.ok(results);
        test.equal(results.length, 2);
        test.ok(results.indexOf('test') >= 0);
        test.ok(results.indexOf('sales') >= 0);
    });

	test.done();
};