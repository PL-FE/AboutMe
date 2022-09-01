const PENDDING = "pendding";
const REJECT = "reject";
const FULL = "full";

class Promise {
  constructor(executor) {
    this.status = PENDDING;
    this.value = null;

    const resolve = (val) => {
      if (this.status === PENDDING) {
        this.status = FULL;
        this.value = val;
      }
    };
    const reject = (reason) => {
      if (this.status === PENDDING) {
        this.status = REJECT;
        this.value = reason;
      }
    };
    try {
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }

  then(onResolve, onReject) {
    if (this.status === FULL) {
      onResolve(this.value);
    }
    if (this.status === REJECT) {
      onReject(this.value);
    }
  }
}

module.exports = Promise;
