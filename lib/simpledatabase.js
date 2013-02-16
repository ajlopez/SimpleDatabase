
var databases = {};

function DatabaseRef(name) {
    this.run = function () {
        var database = databases[name];

        if (!database)
            database = databases[name] = new Database(name);

        return database;
    };
    
    this.table = function (name) {
        return this.run().table(name);
    }
}

function Database() {
    var tables = {};
    
    this.run = function () {
        return this;
    };
    
    this.table = function(name) {
        return new TableRef(name, tables);
    };
}

function TableRef(name, tables) {
    this.run = function () {
        var table = tables[name];
        
        if (!table)
            table = tables[name] = new Table(name);
            
        return table;
    };
}

function Table() {
    this.run = function () {
        return this;
    };
}

exports.database = function(name) { return new DatabaseRef(name); }
