const PENDDING = "pendding";
const REJECT = "reject";
const FULL = "full";

class Promise {
  constructor(executor) {
    this.status = PENDDING;
    this.value = null;
    this.onfullCb = []; // 支持异步
    this.onRejectCb = [];

    // 异步结束了 执行这里 -----2
    // 改变状态并触发then存入的方法
    const resolve = (val) => {
      if (this.status === PENDDING) {
        this.status = FULL;
        this.value = val;
        this.onfullCb.forEach((cb) => cb());
      }
    };
    const reject = (reason) => {
      if (this.status === PENDDING) {
        this.status = REJECT;
        this.value = reason;
        this.onRejectCb.forEach((cb) => cb());
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
    // 异步的时候执行这里，----1
    if (this.status === PENDDING) {
      // 还没执行完，then 里面的函数存入数组，使得支持异步
      this.onfullCb.push(() => onResolve(this.value));
      this.onRejectCb.push(() => onReject(this.value));
    }
  }
}

module.exports = Promise;
