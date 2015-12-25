
function TableWrapper(table, result) {
    this.run = function (cb) { cb(null, result); };
}

function Table() {
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

