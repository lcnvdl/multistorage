const CreateDirectoryErrorCodes = require("./Errors/CreateDirectoryErrorCodes");

class CreateDirectoryResponse extends AbstractDirectoryResponse {
  constructor() {
    super(CreateDirectoryErrorCodes.NoError);
  }
}

module.exports = CreateDirectoryResponse;
