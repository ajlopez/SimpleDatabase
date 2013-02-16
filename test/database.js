
var sdb = require('../');

exports['Create Database'] = function (test) {
	var db = sdb.database('test').run();
	test.ok(db);
	test.done();
};