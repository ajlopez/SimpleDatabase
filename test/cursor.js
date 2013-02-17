
var sdb = require('../');

function getTable() {
    var db = sdb.dbCreate('test').run();
    var table = db.tableCreate('customers').run();
    return table;
}

exports['Cursor of one Document'] = function (test) {
	var table = getTable();
    table.insert({ name: 'Adam', age: 800 }).run();
    var cursor = table.run();
    var total = 0;
    
    cursor.next(function (document) {
        total += document.age;
        return true;
    });
    
	test.equal(total, 800);    
    
	test.done();
};

exports['Cursor of Two Documents'] = function (test) {
	var table = getTable();
    table.insert([{ name: 'Adam', age: 800 }, { name: 'Eve', age: 600 }]).run();
    var cursor = table.run();
    var total = 0;
    
    cursor.next(function (document) {
        total += document.age;
        return true;
    });
    
	test.equal(total, 1400);    
    
	test.done();
};

exports['Cursor returns Copy of Documents'] = function (test) {
	var table = getTable();
    table.insert([{ name: 'Adam', age: 800 }, { name: 'Eve', age: 600 }]).run();
    var cursor = table.run();
    var total = 0;
    
    cursor.next(function (document) {
        total += document.age;
        document.age += 1000;
        return true;
    });

    var cursor2 = table.run();
    var total2 = 0;
    
    cursor2.next(function (document) {
        total2 += document.age;
        return true;
    });
    
	test.equal(total, 1400);    
	test.equal(total2, 1400);    
    
	test.done();
};
