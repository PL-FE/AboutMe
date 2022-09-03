function content(o) {
  function F() {}
  F.prototype = o;
  return new F();
}

// 其实只是需要父类的一个副本而已
function inheritPrototype(person, student) {
  // 是创建超类型原型的一个副本
  var prototype = content(person.prototype); // 创建对象

  // 为创建的副本添加 constructor 属性，从而弥补因重写原型而失去的默认的 constructor 属性
  prototype.constructor = student; // 增强对象

  // 将新创建的对象（即副本）赋值给子类型的原型
  student.prototype = prototype; // 指定对象
}

// 父类
function Person(name) {
  this.name = name;
  this.todo = function (sth) {
    console.log(sth);
  };
}

Person.prototype.sex = 1;

function Student(name) {
  if (name) {
    Person.call(this, name);
  }
  this.age = 16;
}

// Student.prototype = new Person('原始人') // 寄生组合式继承 将会替换这行
inheritPrototype(Person, Student); // 这一句，替代了组合继承中的SubType.prototype = new Person()

// 可传参
const S1 = new Student("王晓");
const S2 = new Student();

// 从子类构造函数中获取
console.log(S1.name); // 王晓
console.log(S1.age); // 16
// 通过父类构造函数获取
console.log(S2.name); // undefined ,没有往父类构造函数传参

// 通过父类原型链获取
console.log(S2.sex); //1
