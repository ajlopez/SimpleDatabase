
var sdb = require('..');

var connection;

exports['get connection'] = function (test) {
    test.async();
    
    sdb.connection(function (err, data) {
        test.ok(!err);
        test.ok(data);
        connection = data;
        test.done();
    });
};