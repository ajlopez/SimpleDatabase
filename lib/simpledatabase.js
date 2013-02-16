
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
        return new Cursor(rows);
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
    
    function getRow(key) {
        return rows[key];
    }
    
    function countRows() {
        return nrows;
    }    
    
    this.count = function () {
        return new CountRef(countRows);
    };
    
    this.get = function (key) {
        return new GetRef(getRow, key);
    }
}

function InsertRef(row, fn) {
    var rows;

    if (Array.isArray(row))
        rows = row;

    this.run = function () {
        var result = { inserted: 0, errors: 0, keys: [] };
        if (rows)
            rows.forEach(function (row) { insertRow(row, fn, result); });
        else
            insertRow(row, fn, result);

        return result;
    };

    function insertRow(row, fn, result) {
        try {
            var nokey = row.id == null;
            fn(row);
            result.inserted++;
            if (nokey)
                result.keys.push(row.id);
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
        return fn(key);
    };
}

function Cursor(rows) {
    this.next = function (fn) {
        for (var n in rows) {
            var row = rows[n];
            if (!fn(row))
                return;
        }
    }
}

exports.database = function(name, options) { return new DatabaseRef(name, options); }
