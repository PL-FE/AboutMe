// typeof null 为什么等于 object?
// 因为 null 和 object 底层都是以000开始的二进制存值，所以 null 被认为是一个空对象的引用，

function getTyoe(obj) {
  return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
}

// Object.prototype.toString.call(obj)
// Object.prototype.toString 返回当前实例所属的类，那么我们把this指向传入的实例即可得到传入实例的类

console.log("getTyoe(1)", getTyoe(1));
console.log("type of 1", typeof 1);
console.log("getTyoe('1')", getTyoe("1"));
console.log("type of 1", typeof "1");
console.log("getTyoe({})", getTyoe(new Set()));
console.log("type of new Set()", typeof new Set());
console.log("getTyoe({})", getTyoe([]));
console.log("type of []", typeof []);
console.log(
  "getTyoe(function () {})",
  getTyoe(function () {})
);
console.log("type of function () {}", typeof function () {});
