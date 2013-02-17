
var sdb = require('../');

function getDb() {
    sdb.dbCreate('test').run();
    return sdb.db('test');
}

exports['Create Table'] = function (test) {
    var db = getDb();
	var query = db.tableCreate('customers').run();
    
    query.collect(function (results) {
        test.ok(results);
        test.equal(results.length, 0);
    });

    var table = db.table('customers');
	test.ok(table);    
    test.equal(table.count().run(), 0);
    
	test.done();
};

exports['Create and Get Table'] = function (test) {
    var db = getDb();
	db.tableCreate('customers').run();
    var table = db.table('customers');
    var table2 = db.table('customers');
    
    test.ok(table === table2);

	test.done();
};

exports['List Table'] = function (test) {
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