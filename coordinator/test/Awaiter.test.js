const expect = require("chai").expect;
const Awaiter = require("../src/Awaiter");

let instance;

describe("Awaiter", () => {
  beforeEach(function() {
    instance = new Awaiter();
  });

  describe("#constructor", () => {
    it("should work fine", () => {
        expect(instance).to.be.ok;
    });
  });
});
