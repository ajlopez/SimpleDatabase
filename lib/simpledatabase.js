
var databases = {};

function DatabaseRef(name) {
    this.run = function () {
        var database = databases[name];

        if (!database)
            database = databases[name] = new Database(name);

        return database;
    }
}

function Database() {
    this.run = function () {
        return this;
    }
}

exports.database = function(name) { return new DatabaseRef(name); }
