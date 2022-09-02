function throttling(fun, wait) {
  let timer = null;
  return (...args) => {
    if (timer) {
      return;
    }
    timer = setTimeout(() => {
      fun.call(this, ...args);
      timer = null;
    }, wait);
  };
}
function demo1(val) {
  console.log("val", val);
}
const funWrap = throttling(demo1, 1000);

setTimeout(() => {
  funWrap(1);
}, 200);
setTimeout(() => {
  funWrap(2);
}, 200);
setTimeout(() => {
  funWrap(3);
}, 200);
setTimeout(() => {
  funWrap(4);
}, 2000);
