
var sdb = require('./impl/sdb');

function copyDocument(obj) {
    if (!obj || typeof obj !== 'object')
        return obj;

    if (Array.isArray(obj))
        return copyArray(obj);

    var newobj = {};
    
    for (var n in obj)
        newobj[n] = copyDocument(obj[n]);
        
    return newobj;
}

function copyArray(arr) {
    var newarr = [];

    for (var n in arr)
        newarr[n] = copyDocument(arr[n]);

    return newarr;
}

function ColumnExpression(name) {
    this.evaluate = function (document) {
        return document[name];
    }
    
    this.add = function (value) {
        return new BinaryExpression(this, value, function (left, right) { return left + right; });
    }
    
    this.sub = function (value) {
        return new BinaryExpression(this, value, function (left, right) { return left - right; });
    }
    
    this.mul = function (value) {
        return new BinaryExpression(this, value, function (left, right) { return left * right; });
    }
    
    this.div = function (value) {
        return new BinaryExpression(this, value, function (left, right) { return left / right; });
    }
}

function BinaryExpression(leftvalue, rightvalue, fn) {
    var leftexpr = makeExpression(leftvalue);
    var rightexpr = makeExpression(rightvalue);
    
    this.evaluate = function (document) {
        return fn(leftexpr.evaluate(document),rightexpr.evaluate(document));
    }
}

function makeExpression(value) {
    if (isExpression(value))
        return value;

    return new ValueExpression(value);
}

function isExpression(value) {
    return value && typeof value === 'object' && value.evaluate && typeof value.evaluate === 'function';
}

function ValueExpression(value) {
    this.evaluate = function() {
        return value;
    };
}

function RunCreateTable(name, rundb) {
    this.run = function (conn, cb) {
        rundb.run(conn, function (err, db) {
            if (err)
                return cb(err, null);

            db.tableCreate(name, cb);
        });
    };    
}

function RunListTables(name, rundb) {
    this.run = function (conn, cb) {
        rundb.run(conn, function (err, db) {
            if (err)
                return cb(err, null);

            db.tableList(cb);
        });
    };    
}

function RunInsert(data, table) {
    this.run = function (conn, cb) {
        table.run(conn, function (err, table) {
            table.insert(data, cb);
        });
    };
}

function RunUpdate(data, parent) {
    this.run = function (conn, cb) {
        parent.run(conn, function (err, elems) {
            elems.update(data, cb);
        });
    };
}

function RunGet(id, table) {
    this.run = function (conn, cb) {
        table.run(conn, function (err, table) {
            cb(null, table.get(id));
        });
    };
    
    this.update = function(newdata, cb) {
        return new RunUpdate(newdata, this);
    }
}

function RunTable(name, rundb) {
    this.run = function (conn, cb) {
        rundb.run(conn, function (err, db) {
            if (err)
                return cb(err, null);

            db.table(name, cb);
        });
    };
    
    this.insert = function (data) {
        return new RunInsert(data, this);
    }
    
    this.get = function (id) {
        return new RunGet(id, this);
    }
} 

function RunDatabase(name) {
    this.run = function (conn, cb) {
        conn.db(name, cb);
    }
    
    this.tableCreate = function (name) {
        return new RunCreateTable(name, this);
    }
    
    this.tableList = function (name) {
        return new RunListTables(name, this);
    }
    
    this.table = function (name) {
        return new RunTable(name, this);
    }
}

function RunCreateDatabase(name) {
    this.run = function (conn, cb) {
        conn.dbCreate(name, cb);
    }
}

exports.db = function (name) { return new RunDatabase(name); };

exports.dbCreate = function (name) { return new RunCreateDatabase(name); }

exports.row = function (name) { return new ColumnExpression(name); }

exports.connection = function (cb) {
    setImmediate(function () { cb(null, sdb); });
};

