const uuid = require("uuid/v1");
const NodeStatus = require("./NodeStatus");
const Promise = require("./Promise");
const FileInfoResponse = require("./Responses/FileInfoResponse");
const FileExistenceResponse = require("./Responses/FileExistenceResponse");

class Node {
    constructor() {
        this.uuid = uuid();
        this.alias = "node " + this.uuid;
        this.status = NodeStatus.Offline;
        this.lastUpdate = new Date();
        this.timeout = 0;
        this.communicator = null;
        this.promises = {};
    }

    contains(path) {
        return this.__addNewPromise(id => new Promise((resolve, reject) => {
            this.listenMessage("contains", id, data => {
                let info = new FileExistenceResponse();
                info.deserialize(data);
                resolve(info);
            }, reject);
            this.communicator.send(["contains", this.uuid, id, path].join("|"));
        }));
    }

    list(directory) {
        return this.__addNewPromise(id => new Promise((resolve, reject) => {
            this.listenMessage("list", id, data => {
                let files = [];
                data.forEach(fileInfo => {
                    let info = new FileInfoResponse();
                    info.deserialize(fileInfo);
                    files.push(info);
                });
                resolve(files);
            }, reject);

            this.communicator.send(["list", this.uuid, id, directory].join("|"));
        }));
    }

    listenMessage(name, id, resolve, reject) {
        this.promises[id].name = name;
        this.promises[id].resolve = resolve;
        this.promises[id].reject = reject;
    }

    updateStatus(status, ttl) {
        if(this.timeout) {
            clearTimeout(this.timeout);
        }

        this.status = status;
        this.lastUpdate = new Date();

        setTimeout(() => this.die(), ttl * 1000);
    }

    invalidateOldFiles(fileInfoList) {
        throw new Error("Not implemented");
    }

    prepareMkdir(directory) {
        throw new Error("Not implemented");
    }

    mkdir(directory) {
        throw new Error("Not implemented");
    }

    prepareRmdir(directory) {
        throw new Error("Not implemented");
    }

    rmdir(directory) {
        throw new Error("Not implemented");
    }

    prepareUnlink(file) {
        throw new Error("Not implemented");
    }

    unlink(file) {
        throw new Error("Not implemented");
    }

    die() {
        this.status = NodeStatus.Offline;
    }

    trigger(name, data) {
        let s = data.split("|");
        if(s[0] == "list" || s[0] == "contains") {
            if(s[1] == this.uuid) {
                let p = this.promises[s[2]];
                p && p.resolve(JSON.parse(s[3]));
            }
            else {
                console.log("Ignored");
            }
        }
        else {
            throw new Error("Invalid command");
        }
    }

    __addNewPromise(creation) {
        let id = uuid();
        let promise = creation(id);
        promise.custom.id = id;
        this.promises[id] = {
            name: "",
            nodeId: this.uuid,
            promiseId: id,
            resolve: null,
            reject: null,
            promise: promise
        };
        return promise;
    }
}

module.exports = Node;