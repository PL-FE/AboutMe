// 函数容器
function content(obj) {
  function F() {}
  F.prototype = obj;
  return new F();
}

// 对象加工厂
function createStudent(obj) {
  let clone = content(obj);
  clone.sayHi = function () {
    console.log("hi");
  };
  return clone;
}

// 父类
function Person(name) {
  this.age = 10;
}

const p = new Person();

const stu1 = createStudent(p);

stu1.sayHi(); // hi
