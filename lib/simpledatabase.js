
function Database(name) {
    this.run = function () {
        return this;
    }
}

exports.database = function(name) { return new Database(); }
