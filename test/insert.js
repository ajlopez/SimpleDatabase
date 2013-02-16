
var sdb = require('../');

exports['Insert Row'] = function (test) {
	var row = sdb.database('test', { create: true }).table('customers').insert({ name: 'Adam' }).run();
	test.ok(row);
    test.ok(row.id);
    test.equal(row.id, 1);
    test.equal(row.name, 'Adam');

    var count = sdb.database('test').table('customers').count().run();
    test.equal(count, 1);

	test.done();
};

exports['Insert Two Rows'] = function (test) {
	var rows = sdb.database('test', { create: true }).table('customers').insert({ name: 'Adam' }).insert({name : 'Eve'}).run();
	test.ok(rows);
    test.equal(rows.length, 2);
    test.equal(rows[0].id, 1);
    test.equal(rows[0].name, 'Adam');
    test.equal(rows[1].id, 2);
    test.equal(rows[1].name, 'Eve');

    var count = sdb.database('test').table('customers').count().run();    
    test.equal(count, 2);

	test.done();
};

exports['Insert Array of Rows'] = function (test) {
	var rows = sdb.database('test', { create: true }).table('customers').insert([{ name: 'Adam' }, { name : 'Eve' }]).run();
	test.ok(rows);
    test.equal(rows.length, 2);
    test.equal(rows[0].id, 1);
    test.equal(rows[0].name, 'Adam');
    test.equal(rows[1].id, 2);
    test.equal(rows[1].name, 'Eve');

    var count = sdb.database('test').table('customers').count().run();    
    test.equal(count, 2);

	test.done();
};
