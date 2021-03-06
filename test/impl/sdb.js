
var sdb = require('../../lib/impl/sdb');
var async = require('simpleasync');
var sl = require('simplelists');

exports['get test db'] = function (test) {
    test.async();
    
    async()
    .exec(function (next) {
        sdb.db('test', next);
    })
    .then(function (data, next) {
        test.ok(data);
        test.equal(typeof data, 'object');
        test.done();
    });
};

exports['get unknown db'] = function (test) {
    test.async();
    
    async()
    .exec(function (next) {
        sdb.db('foo', next);
    })
    .error(function (err) {
        test.equal(err, "Error: Database 'foo' does not exist");
        test.done();
    });
};

exports['create database'] = function (test) {
    test.async();
    
    async()
    .exec(function (next) {
        sdb.dbCreate('sales', next);
    })
    .then(function (data, next) {
        test.ok(data);
        test.strictEqual(typeof data, 'object');
        
        sdb.db('sales', next);
    })
    .then(function (data, next) {
        test.ok(data);
        test.strictEqual(typeof data, 'object');
        test.done();
    });
};

exports['create existing db'] = function (test) {
    test.async();
    
    async()
    .exec(function (next) {
        sdb.dbCreate('sales', next);
    })
    .error(function (err) {
        test.equal(err, "Error: Database 'sales' already exists");
        test.done();
    });
};

exports['create author table'] = function (test) {
    test.async();
    
    async()
    .exec(function (next) {
        sdb.db('test', next);
    })
    .then(function (db, next) {
        db.tableCreate('authors', next);
    })
    .then(function (data, next) {
        test.ok(data);
        test.equal(typeof data, 'object');
        
        test.ok(data.config_changes);
        test.ok(Array.isArray(data.config_changes));
        test.ok(data.tables_created);
        test.equal(data.tables_created, 1);
        
        test.done();
    });
};

exports['create existing author table'] = function (test) {
    test.async();
    
    async()
    .exec(function (next) {
        sdb.db('test', next);
    })
    .then(function (db, next) {
        db.tableCreate('authors', next);
    })
    .then(function (data, next) {
        test.ok(data);
        test.equal(typeof data, 'object');
        
        test.ok(data.config_changes);
        test.ok(Array.isArray(data.config_changes));
        test.equal(data.tables_created, 0);
        
        test.done();
    });
};

exports['insert authors'] = function (test) {
    test.async();
    
    async()
    .exec(function (next) {
        sdb.db('test', next);
    })
    .then(function (db, next) {
        db.table('authors', next);
    })
    .then(function (table, next) {
        table.insert([
            { name: 'Adam', age: 800 },
            { name: 'Eve', age: 700 },
            { name: 'Abel', age: 600 }
        ], next);
    })
    .then(function (data, next) {
        test.ok(data);
        test.equal(typeof data, 'object');
        
        test.equal(data.unchanged, 0);
        test.equal(data.skipped, 0);
        test.equal(data.replaced, 0);
        test.equal(data.inserted, 3);
        test.ok(data.generated_keys);
        test.ok(Array.isArray(data.generated_keys));
        test.equal(data.generated_keys.length, 3);
        test.equal(data.errors, 0);
        test.equal(data.deleted, 0);
        
        test.done();
    });
};

exports['retrieve authors'] = function (test) {
    test.async();
    
    async()
    .exec(function (next) {
        sdb.db('test', next);
    })
    .then(function (db, next) {
        db.table('authors', next);
    })
    .then(function (table, next) {
        table.toArray(next);
    })
    .then(function (data, next) {
        test.ok(data);
        test.ok(Array.isArray(data));
        test.equal(data.length, 3);
        
        test.ok(sl.exist(data, { id: 1, name: 'Adam', age: 800 }));
        test.ok(sl.exist(data, { id: 2, name: 'Eve', age: 700 }));
        test.ok(sl.exist(data, { id: 3, name: 'Abel', age: 600 }));
        
        test.done();
    });
};

exports['filter authors by name'] = function (test) {
    test.async();
    
    async()
    .exec(function (next) {
        sdb.db('test', next);
    })
    .then(function (db, next) {
        db.table('authors', next);
    })
    .then(function (table, next) {
        table.filter(sdb.row('name').eq('Adam'), next);
    })
    .then(function (filter, next) {
        filter.toArray(next);
    })
    .then(function (data, next) {
        test.ok(data);
        test.ok(Array.isArray(data));
        test.equal(data.length, 1);
        
        test.ok(sl.exist(data, { id: 1, name: 'Adam', age: 800 }));
        
        test.done();
    });
};

exports['filter authors by age greater 600'] = function (test) {
    test.async();
    
    async()
    .exec(function (next) {
        sdb.db('test', next);
    })
    .then(function (db, next) {
        db.table('authors', next);
    })
    .then(function (table, next) {
        table.filter(sdb.row('age').gt(600), next);
    })
    .then(function (filter, next) {
        filter.toArray(next);
    })
    .then(function (data, next) {
        test.ok(data);
        test.ok(Array.isArray(data));
        test.equal(data.length, 2);
        
        test.ok(sl.exist(data, { id: 1, name: 'Adam', age: 800 }));
        test.ok(sl.exist(data, { id: 2, name: 'Eve', age: 700 }));
        
        test.done();
    });
};

