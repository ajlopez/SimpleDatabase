
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
    
    doc.name = 'New Adam';
    
    var newdoc = table.get(1).run();
    
    test.ok(newdoc);
    test.equal(newdoc.id, 1);
    test.equal(newdoc.name, 'Adam');

	test.done();
};


exports['Insert and Get an Invariant Document with Array Values'] = function (test) {
    var table = getTable();
    var doc = { name: 'Adam', values: [1,2,3] };
	var result = table.insert(doc).run();

	test.ok(result);
    test.equal(result.inserted, 1);
    test.equal(result.errors, 0);
    test.ok(result.keys);
    test.equal(result.keys.length, 1);
    test.equal(result.keys[0], 1);
    
    test.ok(doc.id === undefined);
    
    doc.name = 'New Adam';
    doc.values.push(4);
    
    var newdoc = table.get(1).run();
    
    test.ok(newdoc);
    test.equal(newdoc.id, 1);
    test.equal(newdoc.name, 'Adam');
    test.equal(newdoc.values.length, 3);
    test.deepEqual(newdoc.values, [1,2,3]);

	test.done();
};

exports['Get a Copy of a Document'] = function (test) {
    var table = getTable();
    var doc = { name: 'Adam' };
	table.insert(doc).run();
    
    var doc = table.get(1).run();
    
    test.equal(doc.name, 'Adam');
    doc.name = 'New Adam';
    
    var doc2 = table.get(1).run();
    test.equal(doc.name, 'New Adam');
    test.equal(doc2.name, 'Adam');

	test.done();
};
