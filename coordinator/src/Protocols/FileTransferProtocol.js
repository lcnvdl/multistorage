class FileTransferProtocol {
    constructor(session, replyCallback) {
        this.session = session;
        this.replyCallback = data => replyCallback(data);
    }

    /**
     * Procesa un comando.
     * @param {*} type 
     * @param {string} cmd 
     * @param {string} messageUUID 
     * @param {string[]} args Todos los argumentos
     */
    process(type, cmd, messageUUID, args) {
        if(cmd === "prepare") {

        }
        else if(cmd === "get-segment") {

        }
        else if(cmd === "finish") {

        }
    }
}

module.exports = FileTransferProtocol;