let ConditionAwaiter = function(conditionFn, timeout, callback, waitTime) {

  waitTime = waitTime || 100;

  function check(t) {
    if (t <= 0) {
      callback(false);
    } else {
      if (conditionFn()) {
        callback(true);
      } else {
        setTimeout(() => check(t - waitTime), waitTime);
      }
    }
  }

  this.start = function() {
    check(timeout);
  };
};

module.exports = ConditionAwaiter;
