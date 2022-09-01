function myNew(target, ...args) {
  const newObj = Object.create(target.prototype);
  const res = target.call(newObj, ...args);
  if (typeof res === "object") {
    return res;
  }
  return newObj;
}

function Obj(value) {
  this.value = value;
  return {
    // 如果返回了一个对象。那么obj就是这个对象
    value: 1,
  };
}

const obj = myNew(Obj, "seq");
console.log("obj.value", obj.value);
