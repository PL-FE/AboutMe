function debouncing(fun, wait) {
  let timer;
  return function (...args) {
    if (timer) {
      clearTimeout(timer);
    } else {
      fun.call(this, ...args);
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
const funWrap = debouncing(demo1, 1000);

funWrap(1);
funWrap(2);
funWrap(3);
funWrap(4);

setTimeout(() => {
  funWrap(5);
}, 2000);
