const RemoveDirectoryErrorCodes = require("./Errors/RemoveDirectoryErrorCodes");

class RemoveDirectoryResponse extends AbstractDirectoryResponse {
  constructor() {
    super(RemoveDirectoryErrorCodes.NoError);
  }
}

module.exports = RemoveDirectoryResponse;
