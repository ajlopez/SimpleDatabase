
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