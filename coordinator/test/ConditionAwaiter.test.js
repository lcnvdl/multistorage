const expect = require("chai").expect;
const ConditionAwaiter = require("../src/ConditionAwaiter");

describe("ConditionAwaiter", () => {
  describe("#start", () => {
    it("should work fine", done => {
      let val = false;
      let instance = new ConditionAwaiter(() => val, 2000, success => {
        expect(success).to.be.ok;
        done();
      }, 10);
      instance.start();
      setTimeout(() => val = true, 1);
    });
  });
});
