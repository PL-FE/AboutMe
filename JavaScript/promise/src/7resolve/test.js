const promise = require("./promise.js");

promise.resolve(1).then((res) => {
  console.log("res", res);
});
