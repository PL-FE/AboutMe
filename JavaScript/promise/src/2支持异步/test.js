const promise1 = require("./promise.js");
new promise1((resolve, reject) => {
  setTimeout(() => {
    resolve(1);
  }, 3000);
}).then((res) => {
  console.log("res", res);
});
