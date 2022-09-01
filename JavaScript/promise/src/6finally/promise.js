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
      // 一些校验
      // 1不能是自己
      if (val === this) {
        return;
      }
      // 2是其他promise
      if (val instanceof Promise) {
        val.then(resolve, reject);
        return;
      }
      // 3是对象或者function **难点

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
}

module.exports = Promise;
