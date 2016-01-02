
var sdb = require('./impl/sdb');

var databases = {};

function dbList() {
    return new RunRef(function () {
        return new Cursor(Object.keys(databases));
    });
}

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

function InsertRef(document, fn) {
    var documents;

    if (Array.isArray(document))
        documents = document;

    this.run = function () {
        var result = { inserted: 0, errors: 0, keys: [] };
        if (documents)
            documents.forEach(function (document) { insertDocument(document, fn, result); });
        else
            insertDocument(document, fn, result);

        return result;
    };

    function insertDocument(newdocument, fn, result) {
        try {
            var document = copyDocument(newdocument);
            var nokey = document.id == null;
            fn(document);
            result.inserted++;
            if (nokey)
                result.keys.push(document.id);
        }
        catch (err) {
            result.errors++;
        }
    }
}

function CountRef(fn) {
    this.run = function () {
        return fn();
    };
}

function GetRef(fn, key) {
    this.run = function () {
        return copyDocument(fn(key));
    };
    
    this.update = function(values) {
        return new GetUpdateRef(fn, key, values);
    }
}

function GetUpdateRef(fn, key, values) {
    this.run = function () {
        var document = fn(key);

        for (var n in values) {
            var value = values[n];
            
            if (isExpression(value))
                value = value.evaluate(document);
                
            document[n] = value;
        }
    }
}

function RunRef(fn) {
    this.run = function () {
        return fn();
    }
}

function Cursor(documents) {
    this.next = function (fn) {
        for (var n in documents) {
            var document = copyDocument(documents[n]);
            if (!fn(document))
                return;
        }
    }
    
    this.collect = function (fn) {
        var results = copyDocument(documents);
        fn(results);
    }
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

exports.dbList = dbList;

exports.row = function (name) { return new ColumnExpression(name); }

exports.connection = function (cb) {
    setImmediate(function () { cb(null, sdb); });
};

