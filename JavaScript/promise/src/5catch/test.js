const promise = require("./promise.js");
new promise((resolve, reject) => {
  JSON.parse("{sds}");
  setTimeout(() => {
    resolve(2);
  }, 1000);
}).catch((err) => {
  console.log("err11111", err);
});
