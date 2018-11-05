const expect = require("chai").expect;
const NodeMap = require("../src/NodeMap");
const FileExistenceResponse = require("../src/Responses/FileExistenceResponse");

let instance;
let nodeMapClientMock = {
  send: () => {},
  callbacks: {
    recv: () => {}
  }
};
let create = () => new NodeMap(120, nodeMapClientMock);

describe("NodeMap", () => {
  describe("#constructor", () => {
    it("should work fine", () => {
      instance = create();
      expect(instance).to.be.ok;
    });
  });

  describe("#getAllNodesOfFile", () => {
    it("should work fine", done => {
      let data1 = new FileExistenceResponse();

      let data2 = new FileExistenceResponse();
      data2.exists = true;
      data2.fragments = [0, 1]
      data2.totalFragments = 3;

      let data3 = new FileExistenceResponse();
      data2.exists = true;
      data2.fragments = [2]
      data2.totalFragments = 3;
      
      let promise1 = new Promise(resolve => {
        setTimeout(() => resolve(data1), 1);
      });

      let promise2 = new Promise(resolve => {
        setTimeout(() => resolve(data2), 1);
      });

      let promise3 = new Promise(resolve => {
        setTimeout(() => resolve(data3), 1);
      });

      instance = create();
      instance.nodes["test1"] = {
        contains: () => promise1
      };
      instance.nodes["test2"] = {
        contains: () => promise2
      };
      instance.nodes["test3"] = {
        contains: () => promise3
      };

      let p = instance.getAllNodesOfFile("file.txt");
      expect(p).to.be.ok;
      p.then(data => {
        expect(data).to.be.ok;
        done();
      });
    });
  });

  describe("#list", () => {
    it("should merge same path of files", done => {
      let data = [{ path: "/f1" }, { path: "/f2" }, { path: "/f1" }];
      let promise = new Promise(resolve => {
        setTimeout(() => resolve(data), 1);
      });

      instance = create();
      instance.nodes["test"] = {
        list: () => promise
      };

      let p = instance.list("test");
      expect(p).to.be.ok;
      p.then(data => {
        expect(data).to.be.ok;
        expect(data.length).to.equals(2);
        expect(data[0].path).to.equals("/f1");
        expect(data[1].path).to.equals("/f2");
        done();
      });
    });
  });
});
