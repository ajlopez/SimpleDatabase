
var databases = {};

function copyDocument(obj) {
    if (!obj || typeof obj !== 'object')
        return obj;

    if (Array.isArray(obj))
        return cloneArray(obj);

    var newobj = {};
    
    for (var n in obj)
        newobj[n] = copyDocument(obj[n]);
        
    return newobj;
}

function Database() {
    var tables = {};
    
    this.run = function () {
        return this;
    };
    
    this.table = function (name) {
        return tables[name];
    };
    
    this.tableCreate = function (name) {
        return new RunRef(function () {
            var table = new Table(name);
            tables[name] = table;
            return table;
        });
    };
}

function Table(name) {
    var nid = 0;
    var documents = [];
    var ndocuments = 0;
    
    this.run = function () {
        return new Cursor(documents);
    };
    
    this.insert = function (document) {
        return new InsertRef(document, insertDocument);
    };
    
    function insertDocument(document) {
        if (!document.id)
            document.id = ++nid;

        if (!documents[document.id])
            ndocuments++;

        documents[document.id] = document;
    }

    function getDocument(key) {
        return documents[key];
    }

    function countDocuments() {
        return ndocuments;
    }    

    this.count = function () {
        return new CountRef(countDocuments);
    };

    this.get = function (key) {
        return new GetRef(getDocument, key);
    }
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
}

function RunRef(fn) {
    this.run = function () {
        return fn();
    }
}

function Cursor(documents) {
    this.next = function (fn) {
        for (var n in documents) {
            var document = documents[n];
            if (!fn(document))
                return;
        }
    }
}

exports.db = function (name) { return databases[name]; };

exports.dbCreate = function (name) {
    return new RunRef(function () {
        var db = new Database(name);
        databases[name] = db;
        return db;
    });
}
