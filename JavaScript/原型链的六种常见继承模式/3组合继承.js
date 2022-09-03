function Person(name) {
  this.name = name;
}
function Student(grade, name) {
  Person.call(this, name); // 重点 调用了1次原型方法
  this.grade = grade;
}

Student.prototype = new Person(); // 重点 调用了1次原型方法
Student.prototype.constructor = Person;

var stu = new Student(100, "张三");
var sta = new Student(99, "李四");
console.log(sta);
console.log(stu);

// 缺点
// 1.调用了2次原型方法
// 2.每个实例都存一个副本,臃肿
