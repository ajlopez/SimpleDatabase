
var sdb = require('../');

exports['Insert Row'] = function (test) {
	var row = sdb.database('test', { create: true }).table('customers').insert({ name: 'Adam' }).run();
	test.ok(row);
    test.ok(row.id);
    test.equal(row.id, 1);
    test.equal(row.name, 'Adam');
	test.done();
};

exports['Insert Rows'] = function (test) {
	var rows = sdb.database('test', { create: true }).table('customers').insert({ name: 'Adam' }).insert({name : 'Eve'}).run();
	test.ok(rows);
    test.equal(rows.length, 2);
    test.equal(rows[0].id, 1);
    test.equal(rows[0].name, 'Adam');
    test.equal(rows[1].id, 2);
    test.equal(rows[1].name, 'Eve');
	test.done();
};
