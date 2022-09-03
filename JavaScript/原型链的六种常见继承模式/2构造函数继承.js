function Person(name) {
  this.name = name;
}

function Student(grade, name) {
  Person.call(this, name); // 重点
  this.grade = grade;
}
var stu = new Student(100, "张三");
var sta = new Student(99, "李四");
console.log(sta);
console.log(stu);

// 缺点
// 1.未继承原型
// 2.每个实例都存一个副本,臃肿.
