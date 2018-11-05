const settings = require("./settings.json");
const express = require("express");
const app = express();
const WebSocket = require("ws");
const FileExplorerSession = require("./src/FileExplorerSession");
const rabbit = require("./src/RabbitCommunication");
const NodeMap = require("./src/NodeMap");
const Node = require("./src/Node");
const FileTransferProtocol = require("./src/Protocols/FileTransferProtocol");

rabbit.Connect();

let nodeTTL = settings.nodes.ttl;
let nodeMapClient = new rabbit.Client();
let nodeMap = new NodeMap(nodeTTL, nodeMapClient);

setTimeout(() => nodeMap.refresh(), settings.nodes.refresh * 1000);

let nodeClient = new rabbit.Client();

app.get("/dir/:path", function(req, res) {
  let session = new FileExplorerSession();
  let msg = ["dir", atob(req.params.path)].join("|");
  this.runCommand(msg, session, data => res.send(data));
});

app.listen(3000, function() {
  console.log("listening on *:3000");
});

const wss = new WebSocket.Server({ port: 8080 });

wss.on("connection", function connection(ws) {
  let session = new FileExplorerSession();

  ws.on("message", session, msg => runCommand(msg, send));

  function send(array) {
    ws.send(array.join("|"));
  }
});

function runCommand(msg, session, replyCallback) {
  
  let s = msg.split("|");
  let type = s[0];
  let messageUuid = s[1];
  let cmd = s[2];
  
  try {
    if (cmd === "cd") {
      let newDir = cd;
      let arg = s.length === 3 ? null : s[3];

      if (arg) {
        newDir = session.goTo(arg);
      }
      else {
        newDir = session.cd;
      }

      replyCallback([type, messageUuid, "1", newDir]);
    } 
    else if(cmd == "transfer") {
      let protocol = new FileTransferProtocol(replyCallback);
      let cmd2 = s[3];
      protocol.process(type, cmd2, messageUuid, s);
    }
    else {
      throw new Error("Invalid command: " + cmd);
    }
  } catch (e) {
    replyCallback([type, messageUuid, "0", e]);
  }
}
