const Awaiter = require("./Awaiter");
let Enumerable = require("linq");

class NodeMap {
    constructor(ttlNode, nodeMapClient) {
        this.nodes = {};
        this.client = nodeMapClient;
        this.client.callbacks.recv = data => this.onReceive(data);
        this.ttlNode = ttlNode;
    }

    get allNodes() {
        let list = [];
        for(let k in this.nodes) {
            list.push(this.nodes[k]);
        }
        return list;
    }

    getAllNodesOfFile(path) {
        let p = new Promise((resolve, reject) => {
            let awaiter = new Awaiter();
            awaiter.join(this.allNodes.map(n => n.contains(path))).then(r => {
                //  r is FileExistenceResponse
                resolve(r);
            });
        });

        return p;
    }

    /**
     * Sends to all nodes the message to invalidate old files.
     * @param {FileInfoResponse[]} allFilesOfDirectory 
     */
    invalidateOldFiles(allFilesOfDirectory) {
        var oldFilesOfNodes = {};
        var lastVersions = this.__getLastVersions(allFilesOfDirectory);

        allFilesOfDirectory.forEach(fi => {
            let k = this.__getKeyFromFile(fi);
            if(+fi.modification < lastVersions[k]) {
                oldFilesOfNodes[fi.node] = oldFilesOfNodes[fi.node] || [];
                oldFilesOfNodes[fi.node].push(fi);
            }
        });

        for(let nodeId in oldFilesOfNodes) {
            let node = this.nodes[nodeId];
            node.invalidateOldFiles(oldFilesOfNodes[nodeId]);
        }
    }

    /**
     * Returns the list of files in a directory.
     * @param {string} directory 
     */
    list(directory) {
        let p = new Promise((resolve, reject) => {
            let awaiter = new Awaiter();
            awaiter.join(this.allNodes.map(n => n.list(directory))).then(r => {
                //  r is FileInfoResponse
                let result = Enumerable.from(r).selectMany(r => r).distinct(r => r.realCompletePath).toArray();
                resolve(result);
            });
        });

        return p;
    }

    unlink(file) {
        return this.__prepareAndAct(file, (n, f) => n.prepareUnlink(f), (n, f) => n.unlink(f));
    }

    mkdir(directory) {
        return this.__prepareAndAct(directory, (n, d) => n.prepareMkdir(d), (n, d) => n.mkdir(d));
    }

    rmdir(directory) {
        return this.__prepareAndAct(directory, (n, d) => n.prepareRmdir(d), (n, d) => n.rmdir(d));
    }

    onReceive(data) {
        let s = data.split("|");
        let cmd = s[0];

        if(cmd === "ping") {
            uuid = s[1];
            status = s[2];
            this.updateNodeStatus(uuid, status);
        }
        else {
        }
    }

    refresh() {
        this.client.send("ping");
    }

    updateNodeStatus(uuid, status) {
        let node = this.nodes[uuid];
        if(!node) {
            node = new Node();
            node.uuid = uuid;
            this.nodes[uuid] = node;
        }

        node.updateStatus(status, this.nodeTTL);
    }

    __prepareAndAct(argument, prepare, act) {
        let p = new Promise((resolve, reject) => {
            let awaiter = new Awaiter();
            awaiter.join(this.allNodes.map(n => prepare(n, argument))).then(responses => {
                if(responses.some(r => !r.success)) {
                    reject(responses.find(r => !r.success));
                }
                else {
                    let subAwaiter = new Awaiter();
                    subAwaiter.join(this.allNodes.map(n => act(n, argument))).then(results => {
                        resolve(results);
                    });
                }
            });
        });

        return p;
    }

    /**
     * @param {FileInfoResponse[]} allFilesOfDirectory 
     */
    __getLastVersions(allFilesOfDirectory) {
        var lastVersions = {};

        allFilesOfDirectory.forEach(fi => {
            let k = this.__getKeyFromFile(fi);
            lastVersions[k] = Math.max(lastVersions[k] || 0, +fi.modification);
        });

        return lastVersions;
    }

    __getKeyFromFile(fi) {
        let k = fi.path + "/" + fi.name;
        return k;
    }
}

module.exports = NodeMap;