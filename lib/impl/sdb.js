
function Database() {
    this.createTable = function (name, cb) { cb(null, {}); }
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

