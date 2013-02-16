
var databases = {};

function DatabaseRef(name, options) {
    this.run = function () {
        var database = databases[name];

        if (!database || (options && options.create))
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
    
    this.insert = function (row) {
        return this.run().insert(row);
    }
}

function Table() {
    var nid = 0;
    var rows = [];
    
    this.run = function () {
        return this;
    };
    
    this.insert = function (row) {
        return new InsertRef(row, insertRow);
    };
    
    function insertRow(row) {
        if (!row.id)
            row.id = ++nid;
        
        rows[row.id] = row;
    }
}

function InsertRef(row, fn) {
    var rows;
    
    this.run = function () {
        if (rows) {
            rows.forEach(function (row) {
                fn(row);
            });
            return rows;
        }
        else {
            fn(row);
            return row;
        }
    };
    
    this.insert = function (newrow) {
        if (!rows)
            rows = [row];

        rows.push(newrow);
        
        return this;
    }
}

exports.database = function(name, options) { return new DatabaseRef(name, options); }
