function getTyoe(obj) {
  return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
}

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
