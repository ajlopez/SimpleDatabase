    
var sdb = require('../');
var async = require('simpleasync');

var connection;

var adamId;

exports['get connection'] = function (test) {
    test.async();
    
    sdb.connection(function (err, conn) {
        test.ok(!err);
        test.ok(conn);
        
        test.equal(typeof conn, 'object');
        
        connection = conn;
        
        test.done();
    });
};

exports['create database'] = function (test) {
    test.async();
    
    sdb.dbCreate('company').run(connection, function (err, data) {
        test.ok(!err);
        test.ok(data);
        test.done();
    });
};

exports['create table'] = function (test) {
    test.async();
    
    async()
    .exec(function (next) { sdb.db('company').tableCreate('persons').run(connection, next); })
    .then(function (data, next) {
        test.ok(data);
        test.equal(typeof data, 'object');
        
        test.ok(data.config_changes);
        test.ok(Array.isArray(data.config_changes));
        test.ok(data.tables_created);
        test.equal(data.tables_created, 1);
        
        test.done();
    });
}

exports['insert document'] = function (test) {
    test.async();
    
    var doc = { name: 'Adam' };
    
    async()
    .exec(function (next) {
        sdb
        .db('company')
        .table('persons')
        .insert(doc)
        .run(connection, next);
    })
    .then(function (result, next) {
        test.ok(result);
        test.equal(result.inserted, 1);
        test.equal(result.errors, 0);
        test.ok(result.generated_keys);
        test.equal(result.generated_keys.length, 1);
        test.equal(result.generated_keys[0], 1);

        adamId = result.generated_keys[0];
        
        test.done();
    })
};

exports['update document with new value'] = function (test) {
    test.async();
    
    async()
    .exec(function (next) {
        sdb
        .db('company')
        .table('persons')
        .get(adamId)
        .update({ age: 800 })
        .run(connection, next);
    })
    .then(function (data, next) {
        test.ok(data);
        test.equal(data.deleted, 0);
        test.equal(data.errors, 0);
        test.equal(data.inserted, 0);
        test.ok(Array.isArray(data.changes));
        test.equal(data.changes.length, 0);
        test.deepEqual(data.changes, []);
        test.equal(data.replaced, 1);
        test.equal(data.skipped, 0);
        test.equal(data.unchanged, 0);        

        sdb
        .db('company')
        .table('persons')
        .get(adamId)
        .run(connection, next);    
    })
    .then(function (data, next) {
        test.ok(data);
        
        test.equal(data.id, adamId);
        test.equal(data.name, "Adam");
        test.equal(data.age, 800);

        test.done();
    });
};

exports['update column with column expression'] = function (test) {
    test.async();
    
    async()
    .exec(function (next) {
        sdb
        .db('company')
        .table('persons')
        .get(adamId)
        .update({ username: sdb.row('name') })
        .run(connection, next);
    })
    .then(function (data, next) {
        test.ok(data);
        test.equal(data.deleted, 0);
        test.equal(data.errors, 0);
        test.equal(data.inserted, 0);
        test.ok(Array.isArray(data.changes));
        test.equal(data.changes.length, 0);
        test.deepEqual(data.changes, []);
        test.equal(data.replaced, 1);
        test.equal(data.skipped, 0);
        test.equal(data.unchanged, 0);        

        sdb
        .db('company')
        .table('persons')
        .get(adamId)
        .run(connection, next);    
    })
    .then(function (data, next) {
        test.ok(data);
        
        test.equal(data.id, adamId);
        test.equal(data.name, "Adam");
        test.equal(data.username, "Adam");
        test.equal(data.age, 800);

        test.done();
    });
};

exports['update column with add expression'] = function (test) {
    test.async();
    
    async()
    .exec(function (next) {
        sdb
        .db('company')
        .table('persons')
        .get(adamId)
        .update({ age: sdb.row('age').add(100) })
        .run(connection, next);
    })
    .then(function (data, next) {
        test.ok(data);
        test.equal(data.deleted, 0);
        test.equal(data.errors, 0);
        test.equal(data.inserted, 0);
        test.ok(Array.isArray(data.changes));
        test.equal(data.changes.length, 0);
        test.deepEqual(data.changes, []);
        test.equal(data.replaced, 1);
        test.equal(data.skipped, 0);
        test.equal(data.unchanged, 0);        

        sdb
        .db('company')
        .table('persons')
        .get(adamId)
        .run(connection, next);    
    })
    .then(function (data, next) {
        test.ok(data);
        
        test.equal(data.id, adamId);
        test.equal(data.name, "Adam");
        test.equal(data.username, "Adam");
        test.equal(data.age, 900);

        test.done();
    });
};

exports['update column with sub expression'] = function (test) {
    test.async();
    
    async()
    .exec(function (next) {
        sdb
        .db('company')
        .table('persons')
        .get(adamId)
        .update({ age: sdb.row('age').sub(50) })
        .run(connection, next);
    })
    .then(function (data, next) {
        test.ok(data);
        test.equal(data.deleted, 0);
        test.equal(data.errors, 0);
        test.equal(data.inserted, 0);
        test.ok(Array.isArray(data.changes));
        test.equal(data.changes.length, 0);
        test.deepEqual(data.changes, []);
        test.equal(data.replaced, 1);
        test.equal(data.skipped, 0);
        test.equal(data.unchanged, 0);        

        sdb
        .db('company')
        .table('persons')
        .get(adamId)
        .run(connection, next);    
    })
    .then(function (data, next) {
        test.ok(data);
        
        test.equal(data.id, adamId);
        test.equal(data.name, "Adam");
        test.equal(data.username, "Adam");
        test.equal(data.age, 850);

        test.done();
    });
};
