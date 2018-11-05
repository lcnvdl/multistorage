const Deserializable = require("../Deserializable");

class FileExistenceResponse extends Deserializable {
    constructor() {
        super();
        this.exists = false;
        this.name = "";
        this.isDirectory = false;
        this.fragments = [];
        this.totalFragments = 0;
        this.fragmentSize = 0;
        this.node = "";
        this.creation = new Date();
        this.modification = new Date();
    }
}

module.exports = FileExistenceResponse;