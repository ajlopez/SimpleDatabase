
var sdb = require('../../lib/impl/sdb');
var async = require('simpleasync');

exports['get test db'] = function (test) {
    test.async();
    
    async()
    .then(function (data, next) {
        sdb.db('test', next);
    })
    .then(function (data, next) {
        test.ok(data);
        test.equal(typeof data, 'object');
        test.done();
    })
    .run();
};

