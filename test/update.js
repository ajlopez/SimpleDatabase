
var sdb = require('../');

function getTable() {
    sdb.dbCreate('test').run();
    var db = sdb.db('test');
    db.tableCreate('customers').run();
    var table = db.table('customers');
    return table;
}

exports['Update Document with New Value'] = function (test) {
    var table = getTable();
	var result = table.insert({ name: 'Adam' }).run();
    
    var id = result.keys[0];
    table.get(id).update({ age: 800 }).run();
    
    var document = table.get(id).run();
    
    test.ok(document);
    test.equal(document.id, id);
    test.equal(document.name, 'Adam');
    test.equal(document.age, 800);

	test.done();
};

exports['Update Column with Column Expression'] = function (test) {
    var table = getTable();
	var result = table.insert({ name: 'Adam' }).run();
    
    var id = result.keys[0];
    table.get(id).update({ username: sdb.row('name') }).run();
    
    var document = table.get(id).run();
    
    test.ok(document);
    test.equal(document.id, id);
    test.equal(document.name, 'Adam');
    test.equal(document.username, 'Adam');

	test.done();
};

exports['Update Column with Add Expression'] = function (test) {
    var table = getTable();
	var result = table.insert({ name: 'Adam', age: 800 }).run();
    
    var id = result.keys[0];
    table.get(id).update({ age: sdb.row('age').add(100) }).run();
    
    var document = table.get(id).run();
    
    test.ok(document);
    test.equal(document.id, id);
    test.equal(document.name, 'Adam');
    test.equal(document.age, 900);

	test.done();
};

exports['Update Column with Sub Expression'] = function (test) {
    var table = getTable();
	var result = table.insert({ name: 'Adam', age: 800 }).run();
    
    var id = result.keys[0];
    table.get(id).update({ age: sdb.row('age').sub(100) }).run();
    
    var document = table.get(id).run();
    
    test.ok(document);
    test.equal(document.id, id);
    test.equal(document.name, 'Adam');
    test.equal(document.age, 700);

	test.done();
};
