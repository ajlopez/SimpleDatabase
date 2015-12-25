
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

function FilterWrapper(table, fn) {
    this.run = function (cb) { cb(null, new Cursor(table, fn)); };
}

function TableWrapper(table, result) {
    this.run = function (cb) { cb(null, result); };
    
    this.insert = function (data, cb) { table.insert(data, cb); };

    this.filter = function (fnwrapper, cb) { cb(null, new FilterWrapper(table, fnwrapper.fn())); };
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
    
    this.insert = function (data, next) {
        var result = generateEmptyResult();
        
        data.forEach(function (row) {
            var newrow = clone(row);
            newrow.id = ++maxid;
            result.inserted++;
            result.generated_keys.push(maxid);
            rows[newrow.id] = newrow;
        });
        
        next(null, new TableWrapper(this, result));
    }
    
    this.keys = function () { return Object.keys(rows); }
    
    this.get = function (key) { return rows[key]; }
}

function Database() {
    var tables = {};
    
    this.createTable = function (name, cb) {
        var result;
        
        if (tables[name])
            result = new TableWrapper(tables[name], { config_changes: [], tables_created: 0 });
        else {
            tables[name] = new Table();
            
            result = new TableWrapper(tables[name], { config_changes: [], tables_created: 1 });
        }
        
        cb(null, result);
    }
    
    this.table = function (name, cb) {
        cb(null, new TableWrapper(tables[name], new Cursor(tables[name])));
    }
}

var databases = {
    test: new Database()
}

function getDatabase(name, cb) {
    cb(null, databases[name]);
}

function FunctionWrapper(func) {
    this.eq = function(value) { return new FunctionWrapper(function (row) { return func(row) == value; }) };
    this.fn = function () { return func };
}

function createFieldFilter(name) {
    return new FunctionWrapper(function (row) { return row[name]; });
}

module.exports = {
    db: getDatabase,
    row: createFieldFilter
}

