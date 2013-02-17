
var sdb = require('../');

function getTable() {
    sdb.dbCreate('test').run();
    var db = sdb.db('test');
    db.tableCreate('customers').run();
    var table = db.table('customers');
    return table;
}

exports['Insert Document'] = function (test) {
    var table = getTable();
	var result = table.insert({ name: 'Adam' }).run();

	test.ok(result);
    test.equal(result.inserted, 1);
    test.equal(result.errors, 0);
    test.ok(result.keys);
    test.equal(result.keys.length, 1);
    test.equal(result.keys[0], 1);

    var count = table.count().run();
    test.equal(count, 1);
    
    var document = table.get(1).run();
    
    test.ok(document);
    test.equal(document.id, 1);
    test.equal(document.name, 'Adam');

	test.done();
};

exports['Insert an Array with Two Documents'] = function (test) {
    var table = getTable();
	var result = table.insert([{ name: 'Adam' }, {name : 'Eve'}]).run();
    
	test.ok(result);
    test.equal(result.inserted, 2);
    test.equal(result.errors, 0);
    test.ok(result.keys);
    test.equal(result.keys.length, 2);
    test.equal(result.keys[0], 1);
    test.equal(result.keys[1], 2);

    var count = table.count().run();    
    test.equal(count, 2);

    var document = table.get(1).run();
    
    test.ok(document);
    test.equal(document.id, 1);
    test.equal(document.name, 'Adam');

    var document = table.get(2).run();
    
    test.ok(document);
    test.equal(document.id, 2);
    test.equal(document.name, 'Eve');
    
    test.equal(table.get(3).run(), null);
    
	test.done();
};

