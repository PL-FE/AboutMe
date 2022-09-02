function throttle(fun, wait) {
  let timer = null;
  return (...args) => {
    if (timer) {
      return;
    }
    fun.call(this, ...args);
    timer = setTimeout(() => {
      fun.call(this, ...args);
      timer = null;
    }, wait);
  };
}

// function throttle(fn, delay, immediate = true) {
//   let timer = null;
//   return function (...args) {
//     if (!timer) {
//       timer = setTimeout(() => {
//         timer = null;
//         !immediate && fn.apply(this, args);
//       }, delay);
//       immediate && fn.apply(this, args);
//     }
//   };
// }

function demo1(val) {
  console.log("val", val);
}
const funWrap = throttle(demo1, 1000);

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
