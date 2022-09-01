const promise = require("./promise.js");

promise
  .reject(11)
  .then((res) => {
    console.log("res", res);
  })
  .catch((err) => {
    console.log("err11", err);
  });
