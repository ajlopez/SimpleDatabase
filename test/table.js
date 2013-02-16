
var sdb = require('../');

exports['Create Table'] = function (test) {
	var table = sdb.database('test', { create: true }).table('customers');
	test.ok(table);    
    test.equal(table.count().run(), 0);
    
	test.done();
};

exports['Create and Get Table'] = function (test) {
	var table = sdb.database('test', { create: true }).table('customers');
    var table2 = sdb.database('test').table('customers');
    
    test.ok(table === table2);

	test.done();
};