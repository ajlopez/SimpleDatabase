
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

function TableWrapper(table, result) {
    this.run = function (cb) { cb(null, result); };
    
    this.insert = function (data, cb) { table.insert(data, cb); };
}

function Table() {
    var rows = { };
    var maxid = 0;
    
    this.insert = function (data, next) {
        var result = generateEmptyResult();
        
        data.forEach(function (row) {
            result.inserted++;
            result.generated_keys.push(++maxid);
        });
        
        next(null, new TableWrapper(this, result));
    }
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
        cb(null, new TableWrapper(tables[name], null));
    }
}

var databases = {
    test: new Database()
}

function getDatabase(name, cb) {
    cb(null, databases[name]);
}

module.exports = {
    db: getDatabase
}

