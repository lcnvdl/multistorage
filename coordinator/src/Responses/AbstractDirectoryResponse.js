const Deserializable = require("../Deserializable");

class AbstractDirectoryResponse extends Deserializable {
  constructor(noErrorCode) {
    super();
    this.noErrorCode = noErrorCode;
    this.errorCode = noErrorCode;
    this.path = "";
    this.name = "";
    this.node = "";
  }

  get success() {
      return this.errorCode === this.noErrorCode;
  }
}

module.exports = AbstractDirectoryResponse;
