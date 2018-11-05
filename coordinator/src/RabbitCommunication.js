const amqp = require("amqplib/callback_api");
const uuid = require("uuid/v1");

let nodes = {};
let response = () => {};

let connect = () => {
  amqp.connect(
    "amqp://localhost",
    function(err, conn) {
      //  Receive
      conn.createChannel(function(err, ch) {
        var ex = "file_node_response";

        ch.assertExchange(ex, "fanout", { durable: false });

        ch.assertQueue("", { exclusive: true }, function(err, q) {
          ch.bindQueue(q.queue, ex, "");

          ch.consume(
            q.queue,
            function(msg) {
              for (let k in nodes) {
                nodes[k].trigger("recv", msg);
              }
            },
            { noAck: true }
          );
        });
      });

      //  Response
      conn.createChannel(function(err, ch) {
        var ex = "file_node";

        ch.assertExchange(ex, "fanout", { durable: false });

        response = msg => {
          ch.publish(ex, "", new Buffer(msg));
          console.log(" [x] Sent %s", msg);
        };
      });
    }
  );
};

class RabbitNodeCommunicationClient {
  constructor(callbacks) {
    this.uuid = uuid();
    this.callbacks = callbacks || {};
  }

  send(msg) {
    response(msg);
  }

  trigger(name, args) {
    this.callbacks && this.callbacks[name] && this.callbacks[name](args);
  }

  subscript() {
    nodes[this.uuid] = this;
  }

  dispose() {
    delete nodes[this.uuid];
  }
}

module.exports = {
  Connect: connect,
  Client: RabbitNodeCommunicationClient
};
