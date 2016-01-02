
function generateEmptyResult() {
    return {
        unchanged: 0,
        skipped: 0,
        replaced: 0,
        inserted: 0,
        generated_keys: [],
        errors: 0,
        deleted: 0
    };
}

function cloneObject(obj) {
    var result = { };
    
    for (var n in obj)
        result[n] = clone(obj[n]);
        
    return result;
}

function cloneArray(obj) {
    var result = [];
    
    for (var n in obj)
        result[n] = clone(obj[n]);
        
    return result;
}

function clone(obj) {
    if (obj == null)
        return null;
        
    if (Array.isArray(obj))
        return cloneArray(obj);
        
    if (typeof obj === 'object')
        return cloneObject(obj);
        
    return obj;
}

function Cursor(table, fn) {
    this.toArray = function (cb) {
        var keys = table.keys();
    
        var result = [];
        
        keys.forEach(function (key) {
            var row = table.get(key);
            
            if (row && (fn == null || fn(row)))
                result.push(clone(row));
        });
        
        cb(null, result);
    };
}

function Table() {
    var rows = { };
    var maxid = 0;
    
    this.filter = function (fn, next) {
        next(null, new Cursor(this, fn.fn()));
    }
    
    this.insert = function (data, next) {
        var result = generateEmptyResult();
        
        if (Array.isArray(data))
            data.forEach(insertRow);
        else
            insertRow(data);
        
        next(null, result);
        
        function insertRow(row) {
            var newrow = clone(row);
            newrow.id = ++maxid;
            result.inserted++;
            result.generated_keys.push(maxid);
            rows[newrow.id] = newrow;
        }
    }
    
    this.keys = function () { return Object.keys(rows); }
    
    this.get = function (key) { return rows[key]; }

    this.toArray = function (cb) {
        var self = this;
        var keys = this.keys();
    
        var result = [];
        
        keys.forEach(function (key) {
            var row = self.get(key);
            
            if (row)
                result.push(clone(row));
        });
        
        cb(null, result);
    };
}

function Database() {
    var tables = {};
    
    this.tableCreate = function (name, cb) {
        var result;
        
        if (tables[name])
            result = { config_changes: [], tables_created: 0 };
        else {
            tables[name] = new Table();
            
            result = { config_changes: [], tables_created: 1 };
        }
        
        cb(null, result);
    }
    
    this.tableList = function (cb) {
        cb(null, Object.keys(tables));
    }
    
    this.table = function (name, cb) {
        cb(null, tables[name]);
    }
}

var databases = {
    test: new Database()
}

function getDatabase(name, cb) {
    if (!databases[name])
        return cb(new Error("Database '" + name + "' does not exist"), null);

    cb(null, databases[name]);
}

function createDatabase(name, cb) {
    if (databases[name])
        return cb(new Error("Database '" + name + "' already exists"), null);

    databases[name] = new Database();
    cb(null, databases[name]);
}

function FunctionWrapper(func) {
    this.eq = function(value) { return new FunctionWrapper(function (row) { return func(row) == value; }) };
    this.gt = function(value) { return new FunctionWrapper(function (row) { return func(row) > value; }) };
    this.fn = function () { return func };
}

function createFieldFilter(name) {
    return new FunctionWrapper(function (row) { return row[name]; });
}

module.exports = {
    db: getDatabase,
    dbCreate: createDatabase,
    row: createFieldFilter
}

