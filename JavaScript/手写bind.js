// fn.apply(obj, [1, 2]); // 改变fn中的this，并且把fn立即执行
// fn.call(obj, 1, 2); // 改变fn中的this，并且把fn立即执行
// fn.bind(obj, 1, 2); // 改变fn中的this，fn并不执行

Function.prototype.myBind = function (fun = window, ...args) {
  const _this = this;
  return function (...args1) {
    return _this.call(fun, ...args, ...args1);
  };
};
function demo1(val) {
  console.log("val", val);
  console.log("this.value1", this.value); // undefined
  this.value = 1;
}

function demo2() {
  const fun = demo1.myBind(this);
  fun(2);
  fun(3);
  console.log("this.value2", this.value); // 1
  this.value = 2;
}
new demo2();
