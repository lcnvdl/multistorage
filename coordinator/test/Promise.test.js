const expect = require("chai").expect;
const Promise = require("../src/Promise");

let instance;

describe("Promise", () => {
  describe("#constructor", () => {
    it("should work fine", () => {
      instance = new Promise();
      expect(instance).to.be.ok;
    });
  });

  describe("#then", () => {
    it("should be ok", done => {
      let i = 0;
      let p = new Promise((resolve) => resolve(++i));
      p.then(() => {
        expect(i).to.equals(1);
        done();
      }).catch(e => {
        expect(e).to.be.false;
        done();
      });
    });
  });
  
});
