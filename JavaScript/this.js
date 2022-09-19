/*
 * 谈谈你对this的了解及应用场景?
 *   + this的五种情况分析
 *     this执行主体，谁把它执行的「和在哪创建&在哪执行都没有必然的关系」
 *     Q1:函数执行，看方法前面是否有“点”，没有“点”，this是window「严格模式下是undefined」，有“点”，“点”前面是谁this就是谁
 *     Q2:给当前元素的某个事件行为绑定方法，当事件行为触发，方法中的this是当前元素本身「排除attachEvent」
 *     Q3:构造函数体中的this是当前类的实例
 *     Q4:箭头函数中没有执行主体，所用到的this都是其所处上下文中的this
 *     Q5:可以基于Function.prototype上的call/apply/bind去改变this指向
 *   + 手撕call/bind源码
 *   + 掌握this的好玩应用：鸭子类型
 */

const fn = function fn() {
  console.log(this);
};
let obj = {
  name: "OBJ",
  fn: fn,
};
fn(); // window
obj.fn(); //obj
// 总结：词法作用域（静态作用域）

let demo = {
  name: "DEMO",
  fn() {
    console.log(this); // demo

    setTimeout(function () {
      console.log(this); // window
    }, 1000);

    setTimeout(() => {
      console.log(this); // 寻找上下文 demo
    }, 1000);
  },
};
demo.fn();

// call bind

// 原理：就是利用 “点”定THIS机制，context.xxx=self “obj.xxx=func” => obj.xxx()
Function.prototype.call = function call(context, ...params) {
  // this/self->func  context->obj  params->[10,20]
  let self = this,
    key = Symbol("KEY"),
    result;
  context == null ? (context = window) : null;
  !/^(object|function)$/i.test(typeof context)
    ? (context = Object(context))
    : null; // 装箱，为了解决 context 是基本类型 Object(1)=>Number(1)
  context[key] = self;
  result = context[key](...params);
  delete context[key];
  return result;
};

// func函数基于__proto__找到Function.prototype.call，把call方法执行
//   在call方法内部「call执行的时候」  call(context->obj,...params->[10,20])
//     + 把func中的this改为obj
//     + 并且把params接收的值当做实参传递给func函数
//     + 并且让func函数立即执行
// func.call(obj, 10, 20);
// func.apply(obj, [10, 20]);

Function.prototype.bind = function bind(context, ...params) {
  // this/self->func  context->obj  params->[10,20]
  let self = this;

  return function proxy(...args) {
    // 把func执行并且改变this即可  args->是执行proxy的时候可能传递的值
    self.apply(context, params.concat(args));
  };
};

// func函数基于__proto__找到Function.prototype.bind，把bind方法执行
//   在bind方法内部
//     和call/apply的区别：并没有把func立即执行
//     把传递进来的obj/10/20等信息存储起来「闭包」
//     执行bind返回一个新的函数 例如:proxy，把proxy绑定给元素的事件，当事件触发执行的是返回的proxy，在proxy内部，再去把func执行，把this和值都改变为之前存储的那些内容
// document.body.addEventListener('click', func.bind(obj, 10, 20));
// document.body.addEventListener('click', proxy)

// 掌握this的好玩应用：鸭子类型
//   像鸭子，我们就说他是鸭子 -> 类数组像数组「结构、一些操作...」，我们让其用数组上的方法「不能直接用」

[].forEach.call(arguments, (item) => {
  console.log(item);
});
