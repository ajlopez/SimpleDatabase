
var sdb = require('../');

exports['Cursor of one Row'] = function (test) {
	var table = sdb.database('test', { create: true }).table('customers');
    table.insert({ name: 'Adam', age: 800 }).run();
    var cursor = table.run();
    var total = 0;
    
    cursor.next(function (row) {
        total += row.age;
    });
    
	test.equal(total, 800);    
    
	test.done();
};
