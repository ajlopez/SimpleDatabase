
var sdb = require('../');

exports['Create Database'] = function (test) {
	var db = sdb.dbCreate('test').run();
	test.ok(db);
	test.done();
};

exports['Create and Get Database'] = function (test) {
	var db = sdb.dbCreate('test').run();
    var db2 = sdb.db('test').run();
    
    test.ok(db === db2);

	test.done();
};