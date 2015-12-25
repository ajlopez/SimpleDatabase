
function Database() {
    this.createTable = function (name, cb) { cb(null, { config_changes: [], tables_created: 1 }); }
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

