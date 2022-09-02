// 未考虑正则、set、map、symbol等
function getType(data) {
  return Object.prototype.toString.call(data).split(" ")[1].slice(0, -1);
}
function deepCopy(data, map = new WeakMap()) {
  if (getType(data) === "Arrary") {
    let res = [];
    for (const it of data) {
      res.push(deepCopy(it));
    }
    return res;
  }
  if (getType(data) === "Object") {
    if (map.get(data)) {
      return map.get(data);
    }
    let obj = {};
    for (const key in data) {
      // 性能优化 while = for >for of > for in
      obj[key] = deepCopy(data[key]);
    }
    map.set(data, obj);
    return obj;
  }
  return data;
}

let a = {
  b: {
    c: 1,
  },
};

let aa = deepCopy(a);

aa.b.c = aa;
console.log(aa);
console.log(a);
