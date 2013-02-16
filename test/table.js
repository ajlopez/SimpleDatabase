
var sdb = require('../');

exports['Create Table'] = function (test) {
	var table = sdb.database('test').table('customers').run();
	test.ok(table);
	test.done();
};

exports['Create and Get Table'] = function (test) {
	var table = sdb.database('test').table('customers').run();
    var table2 = sdb.database('test').table('customers').run();
    
    test.ok(table === table2);

	test.done();
};