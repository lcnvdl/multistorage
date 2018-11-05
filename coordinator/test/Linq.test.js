const expect = require("chai").expect;
let Enumerable = require("linq");

describe("Enumerable", () => {
  describe("#distinct", () => {
    it("should work fine", () => {
      let data = [
        { id: 1, file: "abc" },
        { id: 2, file: "abc" },
        { id: 3, file: "def" }
      ];
      let result = Enumerable.from(data)
        .distinct(e => e.file)
        .toArray();
      expect(result.length).to.equals(2);
      expect(result[0].file).to.equals("abc");
      expect(result[1].file).to.equals("def");
    });
  });
});
