const PENDDING = "pendding";
const REJECT = "reject";
const FULL = "full";

class Promise {
  constructor(executor) {
    this.status = PENDDING;
    this.value = null;
    this.onfullCb = []; // 支持异步
    this.onRejectCb = [];

    const resolveWrap = (promise, val) => {
      // 一些校验
      // 1不能是自己
      if (val === promise) {
        return;
      }
      // 2是其他promise
      if (val instanceof Promise) {
        val.then(resolve, reject);
        return;
      }
      // 3是对象或者function **理解难点
      if (
        (typeof val === "object" && val !== null) ||
        typeof val === "function"
      ) {
        try {
          const then = val.then;
          if (typeof then === "function") {
            // 无法再细化了有then说明就是promise了
            then.call(
              val,
              (res) => {
                resolveWrap(promise, res);
              },
              (err) => {
                reject(err);
              }
            );
          } else {
            resolve(val);
          }
        } catch (error) {
          reject(error);
        }
      }

      if (this.status === PENDDING) {
        this.status = FULL;
        this.value = val;
        this.onfullCb.forEach((cb) => cb());
      }
    };
    // 异步结束了 执行这里 -----2
    // 改变状态并触发then存入的方法
    const resolve = (val) => {
      resolveWrap(this, x);
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
    const promise2 = new Promise((resolve, reject) => {
      const onResolveWrap = () => {
        setTimeout(() => {
          try {
            const x = onResolve(this.value);
            resolve(x);
          } catch (error) {
            reject(error);
          }
        }, 10);
      };
      const onRejectWrap = () => {
        setTimeout(() => {
          try {
            const x = onReject(this.value);
            resolve(x);
          } catch (error) {
            reject(error);
          }
        }, 10);
      };

      if (this.status === FULL) {
        onResolveWrap();
      }
      if (this.status === REJECT) {
        onRejectWrap();
      }
      // 异步的时候执行这里，----1
      if (this.status === PENDDING) {
        // 还没执行完，then 里面的函数存入数组，使得支持异步
        this.onfullCb.push(() => onResolveWrap());
        this.onRejectCb.push(() => onRejectWrap());
      }
    });
    return promise2;
  }

  catch(errcb) {
    return this.then(null, errcb);
  }

  finally(callback) {
    this.then(
      (data) => {
        callback();
        return data;
      },
      (err) => {
        callback();
        return err;
      }
    );
  }

  static resolve(value) {
    if (value instanceof Promise) {
      return value;
    }
    return new Promise((resolve) => {
      resolve(value);
    });
  }

  static reject(value) {
    return new Promise((resolve, reject) => {
      reject(value);
    });
  }

  static all(promises) {
    if (!promises.length) {
      return Promise.resolve([]);
    }
    return new Promise((resolve, reject) => {
      let res = [];
      let count = 0;
      for (let index = 0; index < promises.length; index++) {
        Promise.resolve(promises[index]).then(
          (data) => {
            res[index] = data;
            count++;
            if (count === promises.length) {
              resolve(res);
            }
          },
          (err) => {
            reject(err);
          }
        );
      }
    });
  }
}

module.exports = Promise;
