const Promise = require("./Promise");

class FileExplorerSession {
  constructor() {
    this.cd = "/";
    this.variables = {};
  }

  goTo(path) {
      let p = new Promise((resolve, error) => {
        this.cd = this.calculateNewPath(path);
        resolve(this.cd);  
      });
      
      return p;
  }

  calculateNewPath(path, cd) {
    let newDir = cd || this.cd;

    if (path[0] === ".") {
      if (path.indexOf("..") === 0) {

        if(newDir[newDir.length-1] != "/") {
          newDir += "/";
        }

        if(newDir.lastIndexOf("/") > 0) {
          newDir = newDir.substr(0, newDir.lastIndexOf("/") - 1);
          newDir = newDir.substr(0, newDir.lastIndexOf("/"));
        }
        
        newDir += path.substr(2);
      } else {
        newDir += path.substr(1);
      }
    } else if (path[0] === "/") {
      newDir = path;
    } else {
      newDir += "/" + path;
    }

    return newDir;
  }
}

module.exports = FileExplorerSession;