function Person(name) {
  this.name = name;
  this.list = [1, 2, 3, 4];
}
Person.prototype.getName = function () {
  return this.name;
};
// 先封装一个函数容器，用来输出对象和承载原型
function Baba(prototypeObj, color) {
  function f() {
    this.color = color;
  }
  f.prototype = prototypeObj; // 继承了传入的obj
  return new f(); // 返回函数对象
}
const per = new Person("baba"); // 创建父类对象
const ba1 = Baba(per, "2"); // 传入父类对象，将父类作为函数的原型，并返回函数；
const ba2 = Baba(per, "4"); // 传入父类对象，将父类作为函数的原型，并返回函数；
ba1.list.push(9);
console.log(ba1.name); // baba
console.log(ba1.color); // 2
console.log(ba1.list); // [1, 2, 3, 4, 9]
console.log(ba2.list); // [1, 2, 3, 4, 9]
console.log(ba2.getName()); // baba

// 缺点
// 1.内存空间是共享
