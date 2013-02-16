
var sdb = require('../');

exports['Insert Row'] = function (test) {
    var table = sdb.database('test', { create: true }).table('customers');
	var result = table.insert({ name: 'Adam' }).run();

	test.ok(result);
    test.equal(result.inserted, 1);
    test.equal(result.errors, 0);
    test.ok(result.keys);
    test.equal(result.keys.length, 1);
    test.equal(result.keys[0], 1);

    var count = table.count().run();
    test.equal(count, 1);
    
    var row = table.get(1).run();
    
    test.ok(row);
    test.equal(row.id, 1);
    test.equal(row.name, 'Adam');

	test.done();
};

exports['Insert an Array with Two Rows'] = function (test) {
    var table = sdb.database('test', { create: true }).table('customers');
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

    var row = table.get(1).run();
    
    test.ok(row);
    test.equal(row.id, 1);
    test.equal(row.name, 'Adam');

    var row = table.get(2).run();
    
    test.ok(row);
    test.equal(row.id, 2);
    test.equal(row.name, 'Eve');
    
    test.equal(table.get(3).run(), null);
    
	test.done();
};

