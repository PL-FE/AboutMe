function Parent1() {
  this.name = "parent1";
  this.play = [1, 2, 3];
}

function Child1() {
  this.type = "child2";
}

Child1.prototype = new Parent1(); // 重点
const c = new Child1();
const c1 = new Child1();

c.play.push(4);
console.log("c.play", c.play);
console.log("c1.play", c1.play);
// 缺点
// 1.内存空间是共享
