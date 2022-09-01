const promise1 = require("./promise.js");
new promise1((resolve, reject) => {
  setTimeout(() => {
    resolve(1);
  }, 1000);
})
  .then((res) => {
    console.log("res", res);
    return 1;
  })
  .then((res) => {
    console.log("res2", res);
  });
