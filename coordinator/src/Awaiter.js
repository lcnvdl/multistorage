const Awaiter = function() {
  let counter = 0;
  let callbacks = [];
  let results = [];

  this.then = function(c) {
    callbacks.push(c);

    if (counter === 0) {
      execute();
    }

    return this;
  };

  this.join = function(promises) {
    promises.forEach(p => {
      counter++;
      p.then(r => onFinish(r)).catch(e => onFinish(e));
    });

    return this;
  };

  function onFinish(r) {
    results.push(r);
    if (--counter === 0) {
      execute();
    }
  }

  function execute() {
    callbacks.forEach(c => c(results));
    callbacks = [];
    results = [];
  }
};

module.exports = Awaiter;
