// Demo
// function demo1() {
//   console.log("this.value1", this.value); // undefined
//   this.value = 1;
// }

// function demo2() {
//   demo1.call(this);
//   console.log("this.value2", this.value); // 1
//   this.value = 2;
// }

Function.prototype.myCall = function (fun, ...args) {
  fun.__a = this;
  const res = fun.__a(...args);
  delete fun.__a;
  return res;
};
function demo1(val) {
  console.log("val", val);
  console.log("this.value1", this.value); // undefined
  this.value = 1;
}

function demo2() {
  demo1.myCall(this, "KKKK");
  console.log("this", this);
  console.log("this.value2", this.value); // 1
  this.value = 2;
}
new demo2();
