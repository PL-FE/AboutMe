// fn.apply(obj, [1, 2]); // 改变fn中的this，并且把fn立即执行
// fn.call(obj, 1, 2); // 改变fn中的this，并且把fn立即执行
// fn.bind(obj, 1, 2); // 改变fn中的this，fn并不执行

Function.prototype.myApply = function (fun = window, args) {
  fun.__a = this;
  fun.__a(...args);
  delete fun.__a;
};
function demo1(val) {
  console.log("val", val);
  console.log("this.value1", this.value); // undefined
  this.value = 1;
}

function demo2() {
  demo1.myApply(this, ["KKKK"]);
  console.log("this.value2", this.value); // 1
  this.value = 2;
}
new demo2();
