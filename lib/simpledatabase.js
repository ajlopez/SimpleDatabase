
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
        var table = tables[name];
        
        if (!table)
            table = tables[name] = new Table(name);
            
        return table;
    };
}

function Table() {
    var nid = 0;
    var rows = [];
    var nrows = 0;
    
    this.run = function () {
        return this;
    };
    
    this.insert = function (row) {
        return new InsertRef(row, insertRow);
    };
    
    function insertRow(row) {
        if (!row.id)
            row.id = ++nid;

        if (!rows[row.id])
            nrows++;

        rows[row.id] = row;
    }
    
    function countRows() {
        return nrows;
    }    
    
    this.count = function () {
        return new CountRef(countRows);
    };
}

function InsertRef(row, fn) {
    var rows;
    
    if (Array.isArray(row))
        rows = row;
    
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

        if (Array.isArray(newrow))
            rows = rows.concat(newrow);
        else
            rows.push(newrow);
        
        return this;
    };
}

function CountRef(fn) {
    this.run = function () {
        return fn();
    };
}

exports.database = function(name, options) { return new DatabaseRef(name, options); }
