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
