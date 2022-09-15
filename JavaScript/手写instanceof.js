// instanceof 的缺点
// 1 不能检测基本数据类型
// 2 由于可以随意修改原型，所以不一定准确

function myinstanceof(obj, Fn) {
  let p = obj.__proto__;
  while (p) {
    if (p === Fn.prototype) {
      return true;
    }
    p = p.__proto__;
  }
  return false;
}

console.log(myinstanceof(() => {}, Function));
