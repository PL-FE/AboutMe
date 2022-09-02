function debouncing(fun, wait) {
  let timer;
  return function (...args) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fun(...args);
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
