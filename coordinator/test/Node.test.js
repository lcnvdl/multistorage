const expect = require("chai").expect;
const Node = require("../src/Node");
const FileExistenceResponse = require("../src/Responses/FileExistenceResponse");
const FileInfoResponse = require("../src/Responses/FileInfoResponse");

let instance;
let sendCallback = () => {};

describe("Node", () => {
  beforeEach(function() {
    instance = new Node();
    instance.uuid = "uuid";
    instance.communicator = {
      send: sendCallback
    };
  });

  describe("#constructor", () => {
    it("should work fine", () => {
        expect(instance).to.be.ok;
    });
  });

  describe("#contains", () => {
    it("not exists should work fine", done => {
        let p = instance.contains("test").then(r => {
          expect(r).to.be.ok;
          expect(r.exists).to.be.false;
          done();
        });

        setTimeout(() => {
          let response = new FileExistenceResponse();
          response.exists = false;

          let msg = ["contains", "uuid", p.custom.id, response.serialize()].join("|");
          instance.trigger("recv", msg);
        }, 1);
    });
  });

  describe("#list", () => {
    it("should work fine", done => {
        let p = instance.list("/").then(r => {
          expect(r).to.be.ok;
          expect(r[0]).to.be.ok;
          expect(r[0].name).to.equals("test");
          expect(r[0].size).to.equals(1024);
          done();
        });

        setTimeout(() => {
          let response = [ new FileInfoResponse() ];
          response[0].isDirectory = false;
          response[0].name = "test";
          response[0].size = 1024;
          response[0].path = "/"; // Esta bien?
          response[0].creation = new Date();
          response[0].modification = new Date();
          response[0].node = "uuid";

          let data = JSON.stringify(response.map(m => m.serializeToDictionary()));

          let msg = ["list", "uuid", p.custom.id, data].join("|");

          instance.trigger("recv", msg);
        }, 1);
    });
  });
});
