const Deserializable = require("../Deserializable");

class FileInfoResponse extends Deserializable {
    constructor() {
        super();
        this.creation = new Date();
        this.modification = new Date();
        this.path = "";
        this.size = 0;
        this.name = "";
        this.isDirectory = false;
        this.fragment = 0;
        this.fragmentSize = 0;
        this.node = "";
    }
}

module.exports = FileInfoResponse;