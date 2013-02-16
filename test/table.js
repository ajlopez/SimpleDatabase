
var sdb = require('../');

function getDb() {
    var db = sdb.dbCreate('test').run();
    return db;
}

exports['Create Table'] = function (test) {
    var db = getDb();
	var table = db.tableCreate('customers').run();
	test.ok(table);    
    test.equal(table.count().run(), 0);
    
	test.done();
};

exports['Create and Get Table'] = function (test) {
    var db = getDb();
	var table = db.tableCreate('customers').run();
    var table2 = db.table('customers');
    
    test.ok(table === table2);

	test.done();
};