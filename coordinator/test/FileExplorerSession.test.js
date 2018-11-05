const expect = require("chai").expect;
const FileExplorerSession = require("../src/FileExplorerSession");

let instance;

describe("FileExplorerSession", () => {
  beforeEach(function() {
    instance = new FileExplorerSession();
  });

  describe("#constructor", () => {
    it("should work fine", () => {
        expect(instance).to.be.ok;
    });
  });

  describe("#calculateNewPath", () => {
    it("absolute", () => {
        let result = instance.calculateNewPath("/test", "/etc");
        expect(result).to.equals("/test");
    });

    it("relative", () => {
        let result = instance.calculateNewPath("./test", "/etc");
        expect(result).to.equals("/etc/test");
    });

    it("back", () => {
        let result = instance.calculateNewPath("../test", "/etc/test2");
        expect(result).to.equals("/etc/test");
    });

    it("back for single level", () => {
        let result = instance.calculateNewPath("../test", "/etc");
        expect(result).to.equals("/test");
    });
  });
});
