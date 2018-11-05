class Promise {
  constructor(action, start) {
    this.callbacks = [];
    this.catchCallbacks = [];
    this.action = action;
    this.isFinished = false;
    this.data = null;
    this.error = null;
    this.custom = {};

    if (typeof start === "undefined" || start) {
      setTimeout(() => this.run(), 1);
    }
  }

  run() {
    try {
      this.action(
        data => {
          this.callbacks.forEach(c => c(data));
          this.isFinished = true;
          this.data = data;
        },
        error => {
          this.catchCallbacks.forEach(c => c(error));
          this.isFinished = true;
          this.error = error;
        }
      );
    } catch (e) {
      this.catchCallbacks.forEach(c => c(e));
    }
  }

  then(action) {
    if (this.isFinished) {
      !this.error && action(this.data);
      return;
    }
    this.callbacks.push(action);
    return this;
  }

  catch(action) {
    if (this.isFinished && this.error) {
      this.error && action(this.error);
      return;
    }
    this.catchCallbacks.push(action);
    return this;
  }
}

module.exports = Promise;
