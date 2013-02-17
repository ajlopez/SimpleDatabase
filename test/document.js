
var sdb = require('../');

function getTable() {
    var db = sdb.dbCreate('test').run();
    var table = db.tableCreate('customers').run();
    return table;
}

exports['Insert and Get an Invariant Document'] = function (test) {
    var table = getTable();
    var doc = { name: 'Adam' };
	var result = table.insert(doc).run();

	test.ok(result);
    test.equal(result.inserted, 1);
    test.equal(result.errors, 0);
    test.ok(result.keys);
    test.equal(result.keys.length, 1);
    test.equal(result.keys[0], 1);
    
    test.ok(doc.id === undefined);
    
    var newdoc = table.get(1).run();
    
    test.ok(newdoc);
    test.equal(newdoc.id, 1);
    test.equal(newdoc.name, 'Adam');

	test.done();
};
